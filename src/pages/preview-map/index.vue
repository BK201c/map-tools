<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">服务参数</a-divider>
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
        <a-form-model-item label="附加参数">
          <div class="drag-position" id="dragBox" @click="readLocalJson">
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
          </div>
        </a-form-model-item>
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
          "https://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer",
        token: "",
        sliceType: "WMTS",
        center: ""
      },
      mapParams: "",
      map: new Map(),
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
    initMapObj() {
      this.map = new Map({
        target: this.$refs.previewMap
      });
    },

    readLocalJson() {
      const { dialog } = require("electron").remote;
      dialog
        .showOpenDialog({
          title: "请选择您喜欢的文件",
          buttonLabel: "走你",
          filters: [
            { name: "Custom File Type", extensions: ["js", "html", "json"] }
          ]
        })
        .then(result => {
          console.log(result.canceled);
          console.log(result.filePaths);
        })
        .catch(err => {
          console.log(err);
        });
    },

    listingFile(filepath) {
      this.isLoading = true;
      const fs = require("fs");

      fs.readFile(filepath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data);
      });
    },

    //创建wmts图层
    createWMTS(opiton) {
      return new Promise(reslove => {
        const { layer, style, matrixSet, projection } = opiton;
        const { tileGrid } = opiton;
        const smOption = {
          layer,
          style,
          matrixSet,
          projection,
          tileGrid: new WMTSTileGrid(tileGrid)
        };
        console.log(smOption);
        reslove(
          new TileLayer({
            source: new WMTS(smOption)
          })
        );
      });
    },
    getMeatByFile() {
      return new Promise(reslove => {
        reslove("111");
      });
    },
    async previewMap() {
      this.mapParams = await this.getMeatByFile();
      const layer =
        this.baseForm.sliceType === "WMTS"
          ? await this.createWMTS(this.mapParams)
          : this.createWMS(this.mapParams);
      const viewOption = {
        center: this.baseForm.center.trim().split(","),
        minZoom: this.mapParams?.tileGrid.matrixIds[0] || 0,
        maxZoom: this.mapParams?.tileGrid.matrixIds.length || 20,
        projection: this.mapParams?.projection,
        zoom: 5
      };
      this.$nextTick(() => {
        this.map.setView(new View(viewOption));
        this.map.addLayer(layer);
      });
    },

    async previewParams() {
      await this.getGridByServer(this.form.url.trim()).then(res => {
        this.mapParams = res;
      });
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
