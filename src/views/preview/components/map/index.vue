<template>
  <section>
    <div id="MapLayoutContainer" class="map-container">
      <div class="map-switch">
        <h2>图层</h2>
        <a-radio-group :value="activedLayerId" @change="layerChange">
          <a-radio
            :value="source.layer"
            v-for="source of mapSource"
            :style="radioStyle"
            :key="source.layer"
            >{{ source.layer }}</a-radio
          >
        </a-radio-group>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { LayerSource } from "../../interface";
import { radioStyle } from "../styles";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import WMTS from "ol/source/WMTS";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";
import ProjExt from "@/utils/projExt";

//数据接收项
const $props = defineProps<{
  mapSource: LayerSource[];
  center: number[];
}>();

const activedLayerId = ref("default");

//初始化地图实例
let mapInstance: any;
onMounted(() => {
  mapInstance = init()
  console.log(`Map is initialized`);
})

//初始化地图实例
const init = (domElement = "MapLayoutContainer") => {
  return new Map({
    target: domElement
  });
}

// 图层切换
const $emit = defineEmits(["layerChange"]);

const layerChange = (e: any): void => {
  const layerId = e?.target?.value;
  const [source] = $props.mapSource.filter(
    (source: LayerSource) => source.layer === layerId
  );
  $emit("layerChange", source);
  setTargetLayer(source)
};


// 清空图层
const cleanAllLayer = (): void => {
  mapInstance?.getLayers()?.forEach((l: any) => mapInstance.removeLayer(l))
};

// 创建图层
const createLayer = (originSource: LayerSource) => {
  let source;
  const type = originSource.serviceType.toUpperCase();
  if (type === "WMTS") source = createWMTS(originSource);
  if (type === "XYZ") source = createXYZ(originSource);
  return new TileLayer({ source });
};

//创建视图
const createView = (projection: string) => {
  const center = ProjExt.isMercatorProjection(projection)
    ? ProjExt.lonLat2Mercator($props.center)
    : $props.center;

  const viewOption = {
    center: center,
    projection: projection,
    minZoom: 0,
    maxZoom: 20,
    zoom: 8
  };
  return new View(viewOption);
};


//设置需要显示的图层
const setTargetLayer = (source: LayerSource): void => {
  cleanAllLayer();
  const layer = createLayer(source);
  const view = createView(source.projection);
  activedLayerId.value = source.layer;
  mapInstance.setView(view);
  mapInstance.addLayer(layer);
  console.log("Setted source", source, view);
};

//创建WMTS图层，默认设置图层名称为图层id
const createWMTS = (option: any) => {
  const base = { ...option };
  const tileGrid = option?.tileGrid && new WMTSTileGrid(option?.tileGrid);
  const smOption = Object.assign({}, base, { tileGrid });
  return new WMTS(smOption);
};

// 创建XYZ图层
const createXYZ = (option: any) => {
  const base = { ...option };
  const tileGrid = option?.tileGrid && new TileGrid(option?.tileGrid);
  const smOption = Object.assign({}, base, { tileGrid });
  return new XYZ(smOption);
};
</script>

<style lang="scss" scoped></style>
