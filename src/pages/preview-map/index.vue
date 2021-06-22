<template>
  <div class="container">
    <div
      class="form-box animate__animated animate__fadeInRight"
      v-show="!isMapFullScreen"
    >
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
            @change="changeCity"
          />
        </a-form-model-item>
        <a-form-model-item label="专业模式">
          <a-switch
            v-model="isAdvanced"
            checked-children="开"
            un-checked-children="关"
            @change="openDevtools"
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
              <a-button> <a-icon type="upload" /> 导入 </a-button>
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
    <div class="preview-box" v-if="isMapParamsShow">
      <div class="preview-map animate__animated animate__fadeInTopRight">
        <div
          id="mapContainer"
          class="map-container"
          :class="{ 'map-full': isMapFullScreen }"
          ref="mapContainer"
        ></div>
        <div class="btn-group">
          <a-icon
            class="map-btn"
            :type="isMapFullScreen ? 'fullscreen-exit' : 'fullscreen'"
            @click="setMapFullScreen"
          />
        </div>
        <div class="map-tools">
          <h2>图层</h2>
          <a-radio-group @change="changeLayer" v-model="selectedLayerId">
            <a-radio
              v-for="layer in layerSource"
              :key="layer.layer"
              :style="radioStyle"
              :value="layer.layer"
            >
              {{ layer.layer }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div
        class="preview-params animate__animated animate__fadeInBottomRight"
        v-show="!isMapFullScreen"
      >
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
          <pre
            style="height:350px;padding-top: 40px;"
            class="language-json"
          ><code style="height:350px">{{previewParams}}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Map, View, TileLayer, WMTSTileGrid, WMTS } from "@/core/ol";
import { ipcRenderer, fs, clipboard } from "@/core/electron";
import formater from "@/utils/formater";
import { mapGetters } from "vuex";
import * as filter from "@/utils/filter";
import { initCityList, getXmlByMapServer } from "@/api/commonAPI";
import { URL } from "url";
export default {
  name: "previewMap",
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      mapParams: {
        url: "http://10.67.14.50:8080/PGIS%20copy.xml",
        serviceType: "wmts"
      },
      map: {},
      fileList: [],
      center: [],
      layerSource: [],
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      isMapParamsShow: false,
      dictorySelected: "",
      citys: [],
      originMetaXml: "",
      isAdvanced: false,
      isMapFullScreen: false,
      previewParams: null,
      selectedLayerId: ""
    };
  },
  created() {
    initCityList().then(res => (this.citys = res));
  },
  mounted() {
    this.initMapObj();
  },
  components: {},
  computed: {
    ...mapGetters(["zipPath"])
  },
  methods: {
    //设置全屏地图
    setMapFullScreen() {
      this.isMapFullScreen = !this.isMapFullScreen;
      setTimeout(() => {
        this.map.updateSize();
      }, 400);
    },

    //高级模式打开谷歌开发者工具
    openDevtools(checked) {
      if (this.mapParams.url === "0096")
        setTimeout(() => {
          ipcRenderer.send("app-open-devtools", checked);
        }, 200);
    },

    // 一键复制参数
    copyParams() {
      clipboard.writeText(JSON.stringify(this.previewParams));
      setTimeout(() => {
        const text = clipboard.readText();
        if (text !== "" && text !== null) {
          this.$message.success("已复制到剪贴板");
        }
      }, 300);
    },

    //支持瓦片鉴权验证
    tileLoader(tile, src) {
      const headers = this.mapParams?.headers;
      const client = new XMLHttpRequest();

      client.open("GET", src);
      client.responseType = "arraybuffer";
      if (headers !== "") {
        for (const key in headers) {
          client.setRequestHeader(key, headers[key]);
        }
      }

      client.onload = function() {
        const arrayBufferView = new Uint8Array(this.response);
        const blob = new Blob([arrayBufferView], { type: "image/png" });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        tile.getImage().src = imageUrl;
      };

      client.send();
    },

    //通过服务器获取xml文件，同时解析元数据信息
    async getLayerInfoByServer() {
      const url = this.mapParams.url.trim();
      const myURL = new URL(url);
      const query = {
        SERVICE: "WMTS",
        REQUEST: "GetCapabilities",
        VERSION: "1.0.0"
      };
      return getXmlByMapServer(url, query)
        .then(async xml => {
          this.originMetaXml = xml;
          this.layerSource = filter.filterLayerSource(xml);
          if (myURL.search !== "")
            this.layerSource.forEach(source => (source.url = url));
          console.log(this.layerSource);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //通过手动模式直接上传切片元数据
    async getLayerInfoByFile() {
      this.layerSource[0] = this.mapParams;
    },

    //保存显示地图的参数文件
    downloadParams(type) {
      let content;
      const dataPx = formater.date(new Date(), "yyyy-MM-dd_hh.mm.ss");
      if (type === "json") {
        content = JSON.stringify(this.previewParams);
      } else if (type === "xml") {
        content = this.originMetaXml;
      }
      const paths = this.zipPath;
      const fileName = `adapt_${this.previewParams.layer}_${dataPx}.${type}`;
      const fullPath = `${paths}/${fileName}`;
      fs.writeFile(fullPath, content, err => {
        if (err) {
          console.error(err);
          this.$message.success(err);
          return;
        }
        //文件写入成功。
        this.$message.success(`${fileName} 已保存至程序的resources目录`);
      });
    },

    //设置需要显示的图层
    setTargetLayer(id) {
      this.cleanAllLayer();
      this.selectedLayerId = id;
      const [targetLayerSouce] = this.layerSource.filter(
        source => source?.layer === id
      );

      const center = filter.isMercatorProjection(targetLayerSouce.projection)
        ? filter.lonLat2Mercator(this.center)
        : this.center;

      const viewOption = {
        center: center,
        projection: targetLayerSouce.projection,
        minZoom: 0,
        maxZoom: 20,
        zoom: 8
      };
      console.log("source", targetLayerSouce);
      console.log("view", viewOption);
      const source = this.createWMTS(targetLayerSouce);
      if (targetLayerSouce.headers !== "") {
        source.setTileLoadFunction(this.tileLoader);
      }
      this.map.addLayer(new TileLayer({ source }));
      this.highlightParams(targetLayerSouce);
      this.map.setView(new View(viewOption));
    },

    // 显示参数
    highlightParams(params) {
      this.previewParams = params;
    },

    //切换图层
    changeLayer(e) {
      this.setTargetLayer(e.target.value);
    },

    // 城市选择
    changeCity(value, selectedOptions) {
      this.center = selectedOptions[1]?.center;
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

    //限制上传数量
    handleChange(info) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-2);
      this.fileList = fileList;
    },

    // 获取上传文件路径
    beforeUpload(file) {
      this.fileList = [file];
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

    //创建wmts图层，默认设置图层名称为图层id
    createWMTS(opiton) {
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
      return new WMTS(smOption);
    },

    // 初始化地图对象
    initMapObj() {
      this.map = new Map();
    },

    cleanAllLayer() {
      this.map.getLayers()?.forEach(l => this.map.removeLayer(l));
    },

    // 参数验证
    checkParams() {
      if (!this.mapParams.url) this.$message.error("地图服务地址不能为空", 2);

      if (!this.center.length) this.$message.error("中心点必选", 2);

      return !!this.mapParams.url && !!this.center.length;
    },

    // 预览地图
    async preview() {
      if (!this.checkParams()) return;
      try {
        this.isMapParamsShow = true;
        this.previewParams = null;
        this.fileList.length === 0
          ? await this.getLayerInfoByServer()
          : await this.getLayerInfoByFile();
        this.map.setTarget(this.$refs.mapContainer);
        this.setTargetLayer(this.layerSource[0]?.layer);
      } catch (error) {
        console.log(error);
        this.$message.error("参数错误,请确认后重试");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/preview.scss";
</style>
