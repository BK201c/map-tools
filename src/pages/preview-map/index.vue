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
        <a-form-model-item
          label="服务地址"
          :wrapperCol="{ span: 16, offset: 0 }"
        >
          <a-input
            v-model="mapParams.url"
            placeholder="http://xxx.xxxxx.com/vec_c/wmts"
          >
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
            :default-value="[320000, 320500]"
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
        <c-map
          :layerSource="layerSource"
          :center="center"
          @change="source => (this.previewParams = source)"
          width="200px"
          height="300px"
        ></c-map>
      </div>
      <c-prism
        class="preview-params animate__animated animate__fadeInBottomRight"
        :code="previewParams"
      ></c-prism>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, fs } from "@/core/electron";
import { mapGetters } from "vuex";
import { filterLayerSource } from "@/utils/filter";
import { initCityList, getXmlByMapServer } from "@/api/commonAPI";
import { URL } from "url";
import upload from "@/mixins/upload.js";
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
      center: [],
      layerSource: [],
      isMapParamsShow: false,
      citys: [],
      originMetaXml: "",
      isAdvanced: false,
      isMapFullScreen: false,
      previewParams: null
    };
  },
  created() {
    initCityList().then(res => (this.citys = res));
  },
  mounted() {},
  components: {
    "c-map": () => import("./components/c-map/c-map"),
    "c-prism": () => import("./components/c-prism/c-prism")
  },
  mixins: [upload],
  computed: {
    ...mapGetters(["zipPath"])
  },
  methods: {
    //高级模式打开谷歌开发者工具
    openDevtools(checked) {
      if (this.mapParams.url === "0096")
        setTimeout(() => {
          ipcRenderer.send("app-open-devtools", checked);
        }, 200);
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
          this.layerSource = filterLayerSource(xml);
          if (myURL.search !== "")
            this.layerSource.forEach(source => (source.url = url));
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //通过手动模式直接上传切片元数据
    async getLayerInfoByFile() {
      this.readLocalJson(this.fileList[0]?.path);
      this.layerSource = [this.mapParams];
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

    // 参数验证
    checkParams() {
      if (!this.mapParams.url) this.$message.error("地图服务地址不能为空", 2);

      if (!this.center.length) this.$message.error("初始位置必选", 2);

      return !!this.mapParams.url && !!this.center.length;
    },

    // 预览地图
    async preview() {
      // if (!this.checkParams()) return;
      try {
        this.isMapParamsShow = true;
        this.fileList.length === 0
          ? await this.getLayerInfoByServer()
          : await this.getLayerInfoByFile();
        this.previewParams = this.layerSource[0];
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
