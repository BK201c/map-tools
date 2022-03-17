<template>
  <div class="map-container" id="mapContainer" ref="mapDom">
    <div class="map-switch">
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
    <div class="map-stats" v-if="isMapFullScreen">
      <ul>
        <li class="items">
          层级：<span>{{ zoom }}</span>
        </li>
        <li class="items">
          中心点：<span>{{ coordnates }}</span>
        </li>
      </ul>
    </div>
    <div class="btn-full-map map-btn" @click="setMapFullScreen">
      <a-icon type="fullscreen" v-if="!isMapFullScreen" />
      <a-icon type="fullscreen-exit" v-if="isMapFullScreen" />
    </div>
  </div>
</template>
<script>
import {
  Map,
  View,
  TileLayer,
  WMTSTileGrid,
  WMTS,
  XYZ,
  TileGrid
} from "@/core/ol";
import { isMercatorProjection } from "@/utils/validation";
import { lonLat2Mercator } from "@/utils/filter";
import { transformExtent } from "ol/proj";
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
      },
      zoom: 8,
      coordnates: [],
      isMapFullScreen: false
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
      this.$emit("layerChange", source);
    },

    //清空全部地图
    cleanAllLayer() {
      this.map?.getLayers()?.forEach(l => this.map.removeLayer(l));
    },

    //设置全屏地图
    setMapFullScreen() {
      this.isMapFullScreen = !this.isMapFullScreen;
      this.$emit("sizeChange", this.isMapFullScreen);
      if (this.isMapFullScreen) {
        this.map.on("moveend", this.onMapMoveend);
      } else {
        this.map.off("moveend", this.onMapMoveend);
      }
      setTimeout(() => {
        this.map.updateSize();
      }, 400);
    },

    //设置需要显示的图层
    setTargetLayer(source) {
      this.cleanAllLayer();
      const layer = this.createLayer(source);
      const view = this.createView(source.projection);
      this.selectedLayerId = source.layer;
      console.log("settedSource", source, view);
      this.map.setView(view);
      this.map.addLayer(layer);
    },

    // 创建图层
    createLayer(originSource) {
      let source;
      const type = originSource.serviceType.toUpperCase();
      if (type === "WMTS") source = this.createWMTS(originSource);
      if (type === "XYZ") source = this.createXYZ(originSource);
      return new TileLayer({ source });
    },

    //创建视图
    createView(projection) {
      const center = isMercatorProjection(projection)
        ? lonLat2Mercator(this.center)
        : this.center;

      const chinaExtent = [
        73.32783475401652,
        19.4243521114706,
        135.16017906160056,
        53.83501005646246
      ];
      console.log(projection, center);
      const viewOption = {
        center: center,
        projection: projection,
        minZoom: 0,
        maxZoom: 20,
        zoom: 8,

        //限制显示范围为国内
        extent: isMercatorProjection(projection)
          ? transformExtent(chinaExtent, "EPSG:4326", "EPSG:3857")
          : chinaExtent
      };
      return new View(viewOption);
    },

    //创建wmts图层，默认设置图层名称为图层id
    createWMTS(option) {
      const base = { ...option };
      const tileGrid = option?.tileGrid && new WMTSTileGrid(option?.tileGrid);
      const smOption = Object.assign({}, base, { tileGrid });
      return new WMTS(smOption);
    },

    // 创建XYZ图层
    createXYZ(option) {
      const base = { ...option };
      const tileGrid = option?.tileGrid && new TileGrid(option?.tileGrid);
      const smOption = Object.assign({}, base, { tileGrid });
      return new XYZ(smOption);
    },

    // 初始化地图对象
    initMapObj() {
      this.map = new Map({
        target: this.$refs.mapDom
      });
      this.setTargetLayer(this.layerSource[0]);
    },

    //监控函数
    onMapMoveend() {
      this.zoom = this.map
        .getView()
        .getZoom()
        .toFixed();
      this.coordnates = [
        ...this.map
          .getView()
          .getCenter()
          .map(e => e.toFixed(8))
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/preview.scss";
.btn-full-map {
  position: fixed;
  left: 0.5em;
  bottom: 0.5em;
  z-index: 99;
}
</style>
