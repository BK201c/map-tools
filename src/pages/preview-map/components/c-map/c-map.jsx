import { Map, View, TileLayer, WMTSTileGrid, WMTS } from "@/core/ol";
import * as filter from "@/utils/filter";
export default {
  name: "c-map",
  props: {
    center: {
      type: Array,
      default: () => [120, 31]
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    layerSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedLayerId: "",
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      map: null
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.initMapObj();
  },
  methods: {
    //支持瓦片鉴权验证
    tileLoader(tile, src) {
      const headers = this.$props.layerSource[0]?.headers;
      const client = new XMLHttpRequest();

      client.open("GET", src);
      client.responseType = "arraybuffer";
      if (headers !== "") {
        for (const key in headers) {
          client.setRequestHeader(key, headers[key]);
        }
      }

      client.onload = function() {
        const arrayBufferView = new Uint8Array(this.response);
        const blob = new Blob([arrayBufferView], { type: "image/png" });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        tile.getImage().src = imageUrl;
      };

      client.send();
    },
    //清空全部地图
    cleanAllLayer() {
      this.map.getLayers()?.forEach(l => this.map.removeLayer(l));
    },

    //设置全屏地图
    setMapFullScreen() {
      this.isMapFullScreen = !this.isMapFullScreen;
      setTimeout(() => {
        this.map.updateSize();
      }, 400);
    },

    //设置需要显示的图层
    setTargetLayer(id) {
      this.cleanAllLayer();
      this.selectedLayerId = id;
      const [targetLayerSouce] = this.$props.layerSource.filter(
        source => source?.layer === id
      );

      const center = filter.isMercatorProjection(targetLayerSouce.projection)
        ? filter.lonLat2Mercator(this.center)
        : this.center;

      const viewOption = {
        center: center,
        projection: targetLayerSouce.projection,
        minZoom: 0,
        maxZoom: 20,
        zoom: 8
      };
      console.log("source", targetLayerSouce);
      console.log("view", viewOption);
      const source = this.createWMTS(targetLayerSouce);
      if (targetLayerSouce.headers !== "") {
        source.setTileLoadFunction(this.tileLoader);
      }
      this.map.addLayer(new TileLayer({ source }));
      this.highlightParams(targetLayerSouce);
      this.map.setView(new View(viewOption));
    },

    //切换图层
    changeLayer(e) {
      this.setTargetLayer(e.target.value);
    },

    //创建wmts图层，默认设置图层名称为图层id
    createWMTS(opiton) {
      const tileGrid = new WMTSTileGrid(opiton?.tileGrid);
      const base = {
        url: opiton.url,
        layer: opiton.layer,
        projection: opiton.projection,
        format: opiton.format,
        style: opiton.style,
        matrixSet: opiton.matrixSet,
        crossOrigin: opiton.crossOrigin || "anonymous"
      };
      const smOption = Object.assign({}, base, { tileGrid });
      return new WMTS(smOption);
    },

    // 初始化地图对象
    initMapObj() {
      this.map = new Map({
        target: this.$el
      });
    }
  },
  render() {
    const { width, height } = this.$props;
    return <div style={(width, height)}></div>;
  }
};
