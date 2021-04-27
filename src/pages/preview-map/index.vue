<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">服务参数</a-divider>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="服务地址">
          <a-textarea
            v-model="form.url"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-model-item>
        <a-form-model-item label="切片方式">
          <a-radio-group v-model="form.sliceType" default-value="WMTS">
            <a-radio value="WMTS" name="sliceType">
              WMTS
            </a-radio>
            <a-radio value="REST" name="sliceType">
              REST
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="手动输入">
          <a-radio-group v-model="form.isArcGisService" :default-value="false">
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-if="form.isArcGisService">
          <a-form-model-item label="layerName">
            <a-input v-model="form.sourceParams.layer" placeholder="图层名称" />
          </a-form-model-item>
          <a-form-model-item label="matrixSet">
            <a-input
              v-model="form.sourceParams.matrixSet"
              placeholder="矩形设定"
            />
          </a-form-model-item>
          <a-form-model-item label="style">
            <a-input v-model="form.sourceParams.style" placeholder="图层样式" />
          </a-form-model-item>
          <a-form-model-item label="origin">
            <a-input
              v-model="tileGrid.origin"
              placeholder="切片原点(x,y)以英文逗号分割"
            />
          </a-form-model-item>
          <a-form-model-item label="maxResolution">
            <a-input v-model="form.maxResolution" placeholder="0级对应分辨率">
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="projection">
            <a-radio-group
              v-model="form.sourceParams.projection"
              default-value="EPSG:4326"
            >
              <a-radio :value="4326">
                EPSG:4326
              </a-radio>
              <a-radio :value="3857">
                EPSG:3857
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="center">
            <a-input v-model="form.view.center" placeholder="中心点 lng,lat" />
          </a-form-model-item>
          <a-form-model-item label="层级范围">
            <a-input-number
              v-model="form.view.minZoom"
              placeholder="最小层级"
              :min="0"
              :max="20"
            />
            <span>&nbsp; - &nbsp;</span>
            <a-input-number
              v-model="form.view.maxZoom"
              placeholder="最大层级"
              :min="0"
              :max="30"
            />
          </a-form-model-item>
        </div>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" @click="previewMap">预览地图</a-button>
          <a-button
            type="primary"
            style="margin-left: 10px"
            @click="previewParams"
            >预览参数</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="preview-box">
      <div class="preview-map" v-show="isMapShow">
        <div id="previewMap" ref="previewMap"></div>
      </div>
      <div class="preview-params" v-show="isParamsShow">
        <pre><code class="language-json">{{tileGridParams}}</code></pre>
      </div>
    </div>
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
      tileGridParams: {
        origin: "",
        resolutions: [],
        matrixIds: []
      },
      form: {
        url:
          "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer",
        token: "",
        sliceType: "WMTS",
        isArcGisService: false,
        maxResolution: "",
        sourceParams: {
          projection: "",
          layer: "",
          style: "",
          matrixSet: ""
        },
        view: {
          minZoom: "",
          maxZoom: "",
          center: ""
        }
      },
      map: new Map(),
      isMapShow: false,
      isParamsShow: false
    };
  },
  mounted() {},
  components: {},
  methods: {
    //切换参数填写方式
    changeInput() {
      this.form.isArcGisService = !this.form.isArcGisService;
    },

    // 初始化地图实例
    initMockMap() {
      // const sourceParams = {
      //   origin: [-2.0037508342787e7, 2.0037508342787e7],
      //   projection: "EPSG:3857",
      //   layer: "",
      //   style: "default",
      //   matrixSet: "default028mm",
      //   resolutions: []
      // };
      // const view = {
      //   minZoom: 0,
      //   maxZoom: 20,
      //   center: [-11158582, 4813697]
      // };
    },

    // 表单验证
    isValidatePass(form) {
      const bbox = form.bbox.split(",");
      if (bbox.length !== 2 || bbox.length !== 4) {
        this.$message.error("请输入正确的点位格式", 2);
      }
    },

    //创建wmts图层
    createWMTS(sourceParams, tileGrid) {
      return new Promise(reslove => {
        const smOption = {
          sourceParams,
          tileGrid: new WMTSTileGrid(tileGrid)
        };
        reslove(
          new TileLayer({
            source: new WMTS(smOption)
          })
        );
      });
    },

    // 通过mapserver获取切片信息
    getGridByServer(url) {
      return new Promise(reslove => {
        axios.get(url, { params: { f: "json" } }).then(res => {
          const { tileInfo } = res.data;
          const tileGrid = tileGridExt.getResolutionByJson(tileInfo);
          console.log(tileGrid);
          reslove(tileGrid);
        });
      });
    },

    getGridByFrom() {
      return new Promise(reslove => {
        const { resolutions, matrixIds } = tileGridExt.getResolutionByCalc(
          this.form.view.maxZoom,
          this.form.maxResolution
        );
        const origin = this.tileGrid.origin.split(",");
        reslove({ resolutions, matrixIds, origin });
      });
    },

    async previewMap() {
      const defaultParams = {
        layer: "layers",
        style: "deafult",
        matrixSet: "default028mm"
      };
      const defaultView = {
        minZoom: 0,
        maxZoom: 20,
        center: [120.34234, 31.11424],
        projection: "EPSG:4326"
      };
      const tileGrid = this.form.isArcGisService
        ? await this.getGridByServer(this.form.url.trim())
        : this.getGridByFrom();

      const layer =
        this.form.sliceType === "WMTS"
          ? await this.createWMTS(
              Object.assign(defaultParams, this.sourceParams),
              tileGrid
            )
          : this.createWMS(
              Object.assign(defaultParams, this.sourceParams),
              tileGrid
            );
      const viewOption = Object.assign(
        {},
        this.sourceParams.projection,
        this.view,
        defaultView
      );
      this.isMapShow = true;
      this.$nextTick(() => {
        this.map.setTarget(this.$refs.previewMap);
        this.map.setView(new View(viewOption));
        this.map.addLayer(layer);
      });
    },

    async previewParams() {
      console.log(this.form);
      await this.getGridByServer(this.form.url.trim()).then(res => {
        this.tileGridParams = res;
      });
      this.$nextTick(() => {
        this.isParamsShow = true;
        Prism.highlightAll();
      });
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
  padding: 0 15px;
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
