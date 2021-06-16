<template>
  <div class="container">
    <div class="form-box">
      <a-divider orientation="left">底图参数</a-divider>
      <a-form-model
        :model="mapParams"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="URL" :wrapperCol="{ span: 16, offset: 0 }">
          <a-input v-model="mapParams.url" placeholder="栅格服务地址">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="切片方式">
          <a-radio-group v-model="mapParams.serviceType" default-value="wmts">
            <a-radio value="wmts" name="serviceType">
              WMTS
            </a-radio>
            <a-radio value="wms" name="serviceType" :disabled="true">
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
        <a-form-model-item label="专业模式">
          <a-switch
            v-model="isAdvanced"
            checked-children="开"
            un-checked-children="关"
          />
        </a-form-model-item>
        <div class="advanced-items" v-if="isAdvanced">
          <a-form-model-item label="调试参数">
            <a-upload
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
              accept=".json"
            >
              <a-button> <a-icon type="upload" /> 上传 </a-button>
            </a-upload>
          </a-form-model-item>
        </div>
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
    <div class="preview-box" v-show="isMapParamsShow">
      <div class="preview-map animate__animated animate__fadeInTopRight">
        <div id="mapContainer" ref="mapContainer"></div>
      </div>
      <div class="preview-params animate__animated animate__fadeInBottomRight">
        <div class="btn-group">
          <a-tooltip style="margin-left:10px">
            <template slot="title">
              一键复制
            </template>
            <a-button
              type="primary"
              icon="copy"
              size="small"
              :ghost="true"
              @click="copyParams"
            >
            </a-button>
          </a-tooltip>
          <a-tooltip style="margin-left:10px">
            <template slot="title">
              下载参数
            </template>
            <a-button
              type="primary"
              icon="download"
              size="small"
              :ghost="true"
              @click="downloadParams('json')"
            >
            </a-button>
          </a-tooltip>
          <a-tooltip style="margin-left:10px">
            <template slot="title">
              下载元数据
            </template>
            <a-button
              type="primary"
              icon="file-excel"
              size="small"
              :ghost="true"
              @click="downloadParams('xml')"
            >
            </a-button>
          </a-tooltip>
        </div>
        <div class="pre-box">
          <pre><code class="language-json">{{paramsBox}}</code></pre>
        </div>
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
import fs from "fs";
import formater from "@/utils/formater";
import { clipboard } from "electron";
import { mapGetters } from "vuex";
import * as filter from "@/utils/filter";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
export default {
  name: "previewMap",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      mapParams: {
        url:
          "https://t3.tianditu.gov.cn/vec_c/wmts?tk=b789a2ea9a2f0fa03122984062eb1f35",
        serviceType: "wmts"
      },
      map: "",
      fileList: [],
      center: [],
      isMapShow: true,
      isMapParamsShow: false,
      dictorySelected: "",
      citys: [],
      paramsBox: "",
      originMetaXml: "",
      isAdvanced: false
    };
  },
  created() {
    this.initCitys();
  },
  mounted() {
    this.initMapObj();
  },
  components: {},
  computed: {
    ...mapGetters(["zipPath"])
  },
  methods: {
    // 一键复制参数
    copyParams() {
      clipboard.writeText(JSON.stringify(this.mapParams));
      setTimeout(() => {
        const text = clipboard.readText();
        if (text !== "" && text !== null) {
          this.$message.success("已复制到剪贴板");
        }
      }, 300);
    },

    //通过服务器获取xml文件，同时解析元数据信息
    async getLayerInfoByServer() {
      let url = this.mapParams.url;
      let params = {
        SERVICE: "WMTS",
        REQUEST: "GetCapabilities",
        VERSION: "1.0.0"
      };
      return axios
        .get(url, {
          params
        })
        .then(async res => {
          this.originMetaXml = res.data;
          const parser = new WMTSCapabilities();
          const { Contents } = parser.read(res.data);
          const layerMeta = await filter.filterLayerInfo(Contents.Layer[0]);
          const [TileMatrixSet] = Contents.TileMatrixSet.filter(
            e => e.Identifier === layerMeta.matrixSet
          );
          const tileGrid = await filter.filterTileGridInfo(TileMatrixSet);
          this.mapParams = Object.assign(
            {},
            {
              ...layerMeta,
              url,
              serviceType: this.mapParams.serviceType,
              projection: tileGrid.projection,
              tileGrid: {
                resolutions: tileGrid.resolutions,
                matrixIds: tileGrid.matrixIds,
                origin: tileGrid.origin
              }
            }
          );
          console.log(this.mapParams);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //保存显示地图的参数文件
    downloadParams(type) {
      let content;
      const dataPx = formater.date(new Date(), "yyyy年MM月dd日_hh时mm分ss秒");
      if (type === "json") {
        content = JSON.stringify(this.mapParams);
      } else if (type === "xml") {
        content = this.originMetaXml;
      }
      const paths = this.zipPath || "C:/";
      console.log(this.zipPath, paths);
      const fullPath = `${paths}/downloads/adapt_params_${dataPx}.${type}`;
      fs.writeFile(fullPath, content, err => {
        if (err) {
          console.error(err);
          this.$message.success(err);
          return;
        }
        //文件写入成功。
        this.$message.success("文件已保存在程序解压目录");
      });
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
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const params = Object.assign({}, this.mapParams, JSON.parse(data));
        this.mapParams = params;
        this.$message.success("参数已读取");
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
      this.map = new Map();
    },

    // 参数验证
    checkParams() {
      console.log(this.mapParams);
      if (!this.mapParams.url) this.$message.error("地图服务地址不能为空", 2);

      if (!this.center.length) this.$message.error("中心点必选", 2);

      return !!this.mapParams.url && !!this.center.length;
    },

    // 预览地图
    async preview() {
      if (!this.checkParams()) return;
      try {
        await this.getLayerInfoByServer();
        const layer =
          this.mapParams.serviceType === "wmts"
            ? await this.createWMTS(this.mapParams)
            : this.createWMS(this.mapParams);
        const center = filter.isMercatorProjection(this.mapParams.projection)
          ? filter.lonLat2Mercator(this.center)
          : this.center;
        const viewOption = {
          center: center,
          projection: this.mapParams.projection,
          minZoom: 0,
          maxZoom: 20,
          zoom: 8
        };
        console.log(viewOption);
        this.isMapParamsShow = true;
        this.paramsBox = this.mapParams;
        this.$nextTick(() => {
          this.map.setTarget(this.$refs.mapContainer);
          this.map.setView(new View(viewOption));
          this.map.addLayer(layer);
          Prism.highlightAll();
        });
      } catch (error) {
        console.log(error);
        this.$message.error("参数错误,请确认后重试");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/_var.scss";
@import "~@/styles/scroll.scss";
.container {
  display: flex;
  padding: 0 10px;
}
.form-box {
  width: $formWidth - 20px;
  box-sizing: border-box;
}
.preview-box {
  flex-grow: 1;
  margin-top: 25px;
  padding-left: 10px;
  width: $preWidth;
  box-sizing: border-box;
  #mapContainer {
    width: $preWidth;
    height: 300px;
    border: 1px solid #d5d5d5;
  }
  .preview-params {
    position: relative;
    width: $preWidth;
    pre {
      width: $preWidth;
      padding-top: 45px;
      height: 350px;
      overflow-y: scroll;
    }
    .btn-group {
      position: absolute;
      top: 10px;
      right: 25px;
      z-index: 10;
    }
  }
}
</style>
