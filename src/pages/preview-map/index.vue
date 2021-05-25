<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">底图参数</a-divider>
      <a-form-model
        :model="baseForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="服务地址">
          <a-textarea
            v-model="baseForm.url"
            placeholder=""
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-model-item>
        <a-form-model-item label="切片方式">
          <a-radio-group v-model="baseForm.sliceType" default-value="WMTS">
            <a-radio value="WMTS" name="sliceType">
              WMTS
            </a-radio>
            <a-radio value="WMS" name="sliceType">
              WMS
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="初始中心点">
          <a-input v-model="baseForm.center" />
        </a-form-model-item>
        <a-form-model-item label="附加参数">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button> <a-icon type="upload" /> 选择上传 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" @click="preview">预览地图</a-button>
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
      <div class="preview-map">
        <div id="mapContainer" ref="mapContainer"></div>
      </div>
      <div class="preview-params" v-if="isMapParamsShow">
        <pre><code class="language-json">{{mapParams}}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import WMTS from "ol/source/WMTS";
// import axios from "axios";
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
      baseForm: {
        url:
          "https://t3.tianditu.gov.cn/vec_c/wmts?tk=b789a2ea9a2f0fa03122984062eb1f35",
        token: "",
        sliceType: "WMTS",
        center: "121,31"
      },
      mapParams: "",
      map: "",
      fileList: [],
      isMapShow: true,
      isMapParamsShow: false,
      dictorySelected: "",
      isLoading: false,
      tableData: []
    };
  },
  created() {},
  mounted() {
    this.initMapObj();
  },
  components: {},
  methods: {
    // 移除上传文件
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },

    // 获取上传文件路径
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      console.log(this.fileList, file);
      this.readLocalJson(file?.path);
      return false;
    },

    // 读取本地json文件
    readLocalJson(path) {
      const fs = require("fs");
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        this.mapParams = JSON.parse(data);
        console.log(this.mapParams);
      });
    },

    //创建wmts图层
    createWMTS(opiton) {
      console.log(opiton);
      return new Promise(reslove => {
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
        const source = new WMTS(smOption);
        console.log(smOption);
        reslove(new TileLayer({ source }));
      });
    },

    // 初始化地图对象
    initMapObj() {
      this.map = new Map({
        target: this.$refs.mapContainer
      });
    },

    // 转换字符串为经纬度
    formatStr2Arr(str) {
      return [
        ...str
          .trim()
          .split(",")
          .map(p => Number(p))
      ];
    },

    async preview() {
      const layer =
        this.baseForm.sliceType === "WMTS"
          ? await this.createWMTS(this.mapParams)
          : this.createWMS(this.mapParams);
      const viewOption = {
        center: this.formatStr2Arr(this.baseForm.center),
        minZoom: this.mapParams?.tileGrid.matrixIds[0] || 0,
        maxZoom: this.mapParams?.tileGrid.matrixIds.length || 20,
        zoom: 5
      };
      this.map.setView(new View(viewOption));
      this.map.addLayer(layer);
    },

    async previewParams() {
      this.$nextTick(() => {
        this.isMapParamsShow = true;
        Prism.highlightAll();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
}
.form-box {
  width: 600px;
  .drag-position {
    display: flex;
    justify-content: center;
    height: 160px;
    border: 2px dashed #000;
    border-radius: 5px;
    min-width: 200px;
    &:hover {
      cursor: pointer;
    }
  }
}
.preview-box {
  flex-grow: 1;
  padding: 0 15px;
  #mapContainer {
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
