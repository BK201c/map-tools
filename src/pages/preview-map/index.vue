<template>
  <div class="container">
    <div class="preview-box">
      <div id="previewMap"></div>
    </div>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="服务地址">
        <a-input v-model="form.url" />
      </a-form-model-item>
      <!-- <a-form-model-item label="Token">
        <a-input v-model="form.token" />
      </a-form-model-item> -->
      <a-form-model-item label="切片方式">
        <a-radio-group v-model="form.sliceType" default-value="WMTS">
          <a-radio value="WMTS" name="sliceType">
            WMTS
          </a-radio>
          <a-radio value="WMS" name="sliceType">
            WMS
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="ArcGis服务类型">
        <a-radio-group v-model="form.isArcGisService" :default-value="true">
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <div v-if="!form.isArcGisService">
        <a-form-model-item label="切片原点(origin)">
          <a-input v-model="form.origin" placeholder="x,y" />
        </a-form-model-item>
        <a-form-model-item label="最大分辨率">
          <a-input
            v-model="form.maxResolution"
            placeholder="0.7031250000000002"
          />
        </a-form-model-item>
        <a-form-model-item label="坐标系">
          <a-radio-group v-model="form.crs" default-value="EPSG:3857">
            <a-radio value="EPSG:3857">
              EPSG:3857
            </a-radio>
            <a-radio value="EPSG:4326">
              EPSG:4326
            </a-radio>
            <a-radio value="EPSG:4490">
              EPSG:4490
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="中心点">
          <a-input v-model="form.center" placeholder="lng,lat" />
        </a-form-model-item>
        <a-form-model-item label="层级范围">
          <a-input-number
            v-model="form.minZoom"
            placeholder="最小层级"
            :min="0"
            :max="20"
          />
          <span>&nbsp; - &nbsp;</span>
          <a-input-number
            v-model="form.maxZoom"
            placeholder="最大层级"
            :min="0"
            :max="30"
          />
        </a-form-model-item>
      </div>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" @click="previewMap">预览</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import tileGridExt from "@/utils/tilegrid-ext.js";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import WMTS from "ol/source/WMTS";
import axios from "axios";
export default {
  name: "previewMap",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      form: {
        url:
          "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer",
        token: "",
        center: "-11158582,4813697",
        crs: "EPSG:3857",
        minZoom: 0,
        maxZoom: 20,
        sliceType: "WMTS",
        origin: "-2.0037508342787E7,2.0037508342787E7",
        isArcGisService: true,
        maxResolution: 156543.03392800014
      },
      map: null
    };
  },
  mounted() {
    this.initMapObj();
  },
  methods: {
    // 表单验证
    isValidatePass(form) {
      const bbox = form.bbox.split(",");
      if (bbox.length !== 2 || bbox.length !== 4) {
        this.$message.error("请输入正确的点位格式", 2);
      }
    },

    //创建wmts图层
    createWMTS(option) {
      return new Promise(reslove => {
        const smOption = {
          url: `${option?.url}/WMTS/`,
          format: "image/png",
          projection: option?.crs,
          tileGrid: new WMTSTileGrid({
            origin: option?.origin,
            resolutions: option?.resolutions,
            matrixIds: option?.matrixIds
          }),
          style: "default",
          matrixSet: "default028mm",
          layer: "0"
        };
        console.log(smOption);
        reslove(
          new TileLayer({
            source: new WMTS(smOption)
          })
        );
      });
    },

    // 创建WMS切片图层
    createWMS(option) {
      const smOption = {
        url: `${option?.url}/WMTS/`,
        format: "image/png",
        projection: option?.crs,
        tileGrid: new WMTSTileGrid({
          origin: option?.origin,
          resolutions: option?.resolutions,
          matrixIds: option?.matrixIds
        }),
        style: "default",
        matrixSet: "default028mm",
        layer: "0"
      };
      console.log(smOption);
      return new TileLayer({
        source: new WMTS(smOption)
      });
    },

    // 初始化地图实例
    initMapObj() {
      this.map = new Map({
        target: "previewMap"
      });
    },

    //通过手动填写form获取切片信息
    getMetaByFrom(form) {
      const { resolutions, matrixIds } = tileGridExt.getResolutionByCalc(
        form.maxZoom,
        form.maxResolution
      );
      const url = form?.url;
      const crs = form?.crs;
      const origin = [...form.origin.split(",").map(p => Number(p))];
      return { resolutions, matrixIds, origin, url, crs };
    },

    // 通过mapserver获取切片信息
    getMetaByServer(url) {
      return new Promise(reslove => {
        axios.get(url, { params: { f: "json" } }).then(res => {
          const { tileInfo } = res.data;
          const obj = Object.assign(
            {},
            tileGridExt.getResolutionByJson(tileInfo),
            {
              url,
              crs: `EPSG:${tileInfo.spatialReference?.latestWkid}`
            }
          );
          reslove(obj);
        });
      });
    },

    async previewMap() {
      const metaData = this.form.isArcGisService
        ? await this.getMetaByServer(this.form.url.trim())
        : this.getMetaByFrom(this.form);
      const layer =
        this.form.sliceType === "WMTS"
          ? await this.createWMTS(metaData)
          : this.createWMS(metaData);
      const viewOption = {
        center: this.form.center.split(","),
        zoom: 5,
        maxZoom: this.form.maxZoom,
        minZoom: this.form.minZoom
      };
      console.log(layer);
      this.map.setView(new View(viewOption));
      this.map.addLayer(layer);
      console.log(this.map);
    }
  }
};
</script>
<style lang="scss">
.preview-box {
  width: 100%;
  padding: 15px 50px;
  #previewMap {
    width: 100%;
    min-width: 200px;
    min-height: 100px;
    height: 250px;
    border: 1px solid #d5d5d5;
  }
}
</style>
