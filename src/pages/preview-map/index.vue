<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">服务参数</a-divider>
      <a-form-model
        :model="mapParams"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="Host" :wrapperCol="{ span: 16, offset: 0 }">
          <a-input v-model="mapParams.url" placeholder="底图服务地址">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="切片方式">
          <a-radio-group v-model="mapParams.serviceType" default-value="WMTS">
            <a-radio value="WMTS" name="serviceType">
              WMTS
            </a-radio>
            <a-radio value="WMS" name="serviceType" :disabled="true">
              WMS
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="初始位置">
          <a-cascader
            :field-names="{
              label: 'name',
              value: 'adcode',
              children: 'children'
            }"
            :options="citys"
            :show-search="{ filter }"
            placeholder="搜索或选择中心点"
            @change="onChange"
          />
        </a-form-model-item>
        <a-form-model-item label="附加参数">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            accept=".json"
          >
            <a-button> <a-icon type="upload" /> 选择上传 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button
            type="primary"
            size="large"
            @click="preview"
            width="120px"
            shape="round"
            >预览<a-icon type="arrow-right"
          /></a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="preview-box">
      <div class="preview-map">
        <div id="mapContainer" ref="mapContainer"></div>
      </div>
      <div class="preview-params" v-show="isMapParamsShow">
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
      mapParams: {
        url: "",
        serviceType: "WMTS"
      },
      map: "",
      fileList: [],
      center: [],
      isMapShow: true,
      isMapParamsShow: false,
      dictorySelected: "",
      citys: []
    };
  },
  created() {
    this.initCitys();
  },
  mounted() {
    this.initMapObj();
  },
  components: {},
  methods: {
    inputChange(e) {
      console.log(e, this.mapParams);
    },

    // 初始化城市选择
    initCitys() {
      axios.get("./location.json").then(res => {
        this.citys = res.data;
      });
    },

    // 城市选择
    onChange(value, selectedOptions) {
      this.center = selectedOptions[1].center;
      console.log(value, selectedOptions);
    },

    // 中心点搜索
    filter(inputValue, path) {
      return path.some(
        option =>
          option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },

    // 移除上传文件
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.mapParams = {
        serviceType: "WMTS"
      };
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
        const params = Object.assign({}, this.mapParams, JSON.parse(data));
        this.mapParams = params;
        console.log(this.mapParams);
      });
    },

    //创建wmts图层
    createWMTS(opiton) {
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
        reslove(new TileLayer({ source }));
      });
    },

    // 初始化地图对象
    initMapObj() {
      this.map = new Map({
        target: this.$refs.mapContainer
      });
    },

    // 参数验证
    checkParams() {
      console.log(this.mapParams);
      if (!this.mapParams.url) this.$message.error("服务地址不能为空", 2);

      if (!this.center.length) this.$message.error("中心点必选", 2);

      return !!this.mapParams.url && !!this.center.length;
    },

    // 预览地图
    async preview() {
      if (!this.checkParams()) return;
      try {
        const layer =
          this.mapParams.serviceType === "WMTS"
            ? await this.createWMTS(this.mapParams)
            : this.createWMS(this.mapParams);
        const viewOption = {
          center: this.center,
          projection: this.mapParams.projection,
          minZoom: 0,
          maxZoom: 20,
          zoom: 8
        };
        this.map.setView(new View(viewOption));
        this.map.addLayer(layer);
        this.isMapParamsShow = true;
        Prism.highlightAll();
      } catch (error) {
        console.log(error);
        this.$message.error("附加参数错误，请选择其它文件", 2);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/scroll.scss";
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
  $width: 550px;
  #mapContainer {
    width: $width;
    min-width: 200px;
    min-height: 100px;
    height: 300px;
    border: 1px solid #d5d5d5;
  }
  .preview-params {
    width: $width;
    min-width: 200px;
    max-height: 300px;
    pre {
      height: 300px;
      overflow-y: scroll;
    }
  }
}
</style>
