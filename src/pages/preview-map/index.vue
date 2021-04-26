<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">服务参数</a-divider>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="服务">
          <a-textarea
            v-model="form.url"
            placeholder="Autosize height with minimum and maximum number of lines"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-model-item>
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
        <a-form-model-item label="手动导入">
          <a-radio-group v-model="form.isArcGisService" :default-value="true">
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-if="form.isArcGisService">
          <a-upload
            :file-list="fileList"
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :headers="headers"
            accept=".json"
            @change="handleChange"
          >
            <a-button>
              上传
            </a-button>
          </a-upload>
        </div>
        <div v-if="!form.isArcGisService">
          <a-form-model-item label="layerName">
            <a-input v-model="form.layerName" placeholder="图层名称" />
          </a-form-model-item>
          <a-form-model-item label="matrixSet">
            <a-input v-model="form.matrixSet" placeholder="矩形设定" />
          </a-form-model-item>
          <a-form-model-item label="style">
            <a-input v-model="form.style" placeholder="图层样式" />
          </a-form-model-item>
          <a-form-model-item label="origin">
            <a-input
              v-model="form.origin"
              placeholder="切片原点(x,y)以英文逗号分割"
            />
          </a-form-model-item>
          <a-form-model-item label="maxResolution">
            <a-input v-model="form.maxResolution" placeholder="0级对应分辨率">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="projection">
            <a-radio-group v-model="form.crs" default-value="EPSG:3857">
              <a-radio :value="3857">
                EPSG:3857
              </a-radio>
              <a-radio :value="4326">
                EPSG:4326
              </a-radio>
              <a-radio :value="4490">
                EPSG:4490
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="center">
            <a-input v-model="form.center" placeholder="中心点 lng,lat" />
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
          <a-button type="primary" @click="previewMap">地图预览</a-button>
          <a-button type="primary" @click="previewParams">参数预览</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="preview-box">
      <div class="preview-map" v-show="isMapShow">
        <div id="previewMap" ref="previewMap"></div>
      </div>
      <div class="preview-params" v-show="isParamsShow">
        <pre><code class="language-json">{{mapParams}}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import tileGridExt from "@/utils/tilegrid-ext.js";
import projExt from "@/utils/proj-ext.js";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import WMTS from "ol/source/WMTS";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-json";
export default {
  name: "previewMap",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      form: {
        url:
          "http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer",
        token: "",
        center: "-11158582,4813697",
        crs: 3857,
        minZoom: 0,
        maxZoom: 20,
        sliceType: "WMTS",
        origin: "-2.0037508342787E7,2.0037508342787E7",
        isArcGisService: true,
        maxResolution: 156543.03392800014,
        layerName: "Layers",
        matrixSet: "default028mm",
        style: "default"
      },
      map: new Map(),
      fileList: [],
      mapParams: "",
      headers: {
        authorization: "authorization-text"
      },
      isMapShow: false,
      isParamsShow: false
    };
  },
  mounted() {
    Prism.highlightAll();
  },
  components: {},
  methods: {
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
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
          tileGrid: new WMTSTileGrid({
            origin: option?.origin,
            resolutions: option?.resolutions,
            matrixIds: option?.matrixIds
          }),
          projection: projExt[option?.crs],
          style: option.style || "default",
          matrixSet: option.matrixSet || "default028mm",
          layer: option.layerName || "Layers"
        };
        console.log(option, smOption);
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
        projection: projExt[option?.crs],
        tileGrid: new WMTSTileGrid({
          origin: option?.origin,
          resolutions: option?.resolutions,
          matrixIds: option?.matrixIds
        }),
        style: "default",
        matrixSet: option.matrixSet || "default028mm",
        layer: option.layerName || "Layers"
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
              crs: tileInfo.spatialReference?.latestWkid
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
      console.log(metaData);
      const layer =
        this.form.sliceType === "WMTS"
          ? await this.createWMTS(metaData)
          : this.createWMS(metaData);
      const viewOption = {
        center: this.form.center.split(","),
        zoom: 5,
        projection: projExt[this.form.crs],
        maxZoom: this.form.maxZoom,
        minZoom: this.form.minZoom
      };
      this.isMapShow = true;
      this.$nextTick(() => {
        this.map.setTarget(this.$refs.previewMap);
        this.map.setView(new View(viewOption));
        this.map.addLayer(layer);
      });
    },

    async previewParams() {
      this.mapParams = await this.getMetaByServer(this.form.url.trim());
      this.isParamsShow = true;
      console.log(this.form);
    }
  }
};
</script>
<style lang="scss">
.container {
  display: flex;
}
.form-box {
  width: 600px;
}
.preview-box {
  flex-grow: 1;
  #previewMap {
    width: 100%;
    min-width: 200px;
    min-height: 100px;
    height: 250px;
    border: 1px solid #d5d5d5;
  }
  .preview-params {
    width: 100%;
    min-width: 200px;
    max-width: calc(80vw - 600px);
    max-height: 400px;
    overflow-y: scroll;
  }
}
</style>
