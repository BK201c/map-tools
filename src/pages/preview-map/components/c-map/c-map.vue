<template>
  <div class="map-container" id="mapContainer" ref="mapDom">
    <div class="map-tools">
      <h2>图层</h2>
      <a-radio-group :value="selectedLayerId" @change="changeLayer">
        <a-radio
          :value="source.layer"
          v-for="source of layerSource"
          :style="radioStyle"
          :key="source.layer"
        >
          {{ source.layer }}
        </a-radio>
      </a-radio-group>
    </div>
  </div>
</template>
<script>
import { Map, View, TileLayer, WMTSTileGrid, WMTS } from "@/core/ol";
import { isMercatorProjection } from "@/utils/validation";
import { lonLat2Mercator } from "@/utils/filter";
export default {
  name: "c-map",
  props: {
    center: {
      type: Array,
      default: () => [120, 31]
    },
    layerSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: {},
      selectedLayerId: "",
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      }
    };
  },
  watch: {
    layerSource: {
      handler: function(newValue) {
        this.setTargetLayer(newValue[0]);
      },
      immediate: false
    }
  },
  computed: {},
  components: {},
  created() {},
  mounted() {
    this.initMapObj();
  },
  methods: {
    // 切换图层
    changeLayer(e) {
      const layerId = e.target.value;
      const [source] = this.$props.layerSource.filter(
        source => source.layer === layerId
      );
      this.setTargetLayer(source);
      this.$emit("change", source);
    },

    //支持瓦片鉴权验证
    tileLoader(tile, src) {
      const client = new XMLHttpRequest();
      client.open("GET", src);
      client.responseType = "arraybuffer";
      // const headers = this.source[0]?.headers;
      // if (headers !== "") {
      //   for (const key in headers) {
      //     client.setRequestHeader(key, headers[key]);
      //   }
      // }

      client.onload = () => {
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
      this.map?.getLayers()?.forEach(l => this.map.removeLayer(l));
    },

    //设置全屏地图
    setMapFullScreen() {
      this.isMapFullScreen = !this.isMapFullScreen;
      setTimeout(() => {
        this.map.updateSize();
      }, 400);
    },

    //设置需要显示的图层
    setTargetLayer(source) {
      this.cleanAllLayer();
      const layer = new TileLayer({ source: this.createWmts(source) });
      const view = this.createView(source.projection);
      this.selectedLayerId = source.layer;
      console.log("settedSource", source, view);
      this.map.addLayer(layer);
      this.map.setView(view);
    },

    //创建视图
    createView(projection) {
      const center = isMercatorProjection(projection)
        ? lonLat2Mercator(this.center)
        : this.center;

      const viewOption = {
        center: center,
        projection: projection,
        minZoom: 0,
        maxZoom: 20,
        zoom: 8
      };
      return new View(viewOption);
    },

    //创建wmts图层，默认设置图层名称为图层id
    createWmts(opiton) {
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
      // const base = { ...opiton };
      // if (opiton.headers !== "") {
      //   base.tileLoadFunction = this.tileLoader;
      // }
      const smOption = Object.assign({}, base, { tileGrid });
      return new WMTS(smOption);
    },

    // 初始化地图对象
    initMapObj() {
      this.map = new Map({
        target: this.$refs.mapDom
      });
      this.setTargetLayer(this.layerSource[0]);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/preview.scss";
</style>
