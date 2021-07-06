<template>
  <section>
    <a-divider orientation="left">底图参数</a-divider>
    <a-form-model
      :model="queryParams"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="服务地址" :wrapperCol="{ span: 16, offset: 0 }">
        <a-input
          v-model="queryParams.url"
          placeholder="http://xxx.xxxxx.com/vec_c/wmts"
          :allowClear="true"
          :disabled="isAdvanced"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="接入方式">
        <a-radio-group
          v-model="queryParams.serviceType"
          default-value="WMTS"
          :disabled="isAdvanced"
          @change="serviceTypeChange"
        >
          <a-radio value="WMTS" name="serviceType">
            WMTS
          </a-radio>
          <a-radio value="XYZ" name="serviceType">
            XYZ
          </a-radio>
          <a-radio value="WMS" name="serviceType" :disabled="true">
            WMS
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        label="投影坐标系"
        v-if="queryParams.serviceType === 'XYZ'"
      >
        <a-radio-group
          v-model="queryParams.projection"
          default-value="EPSG:3857"
        >
          <a-radio value="EPSG:3857" name="projection">
            EPSG:3857
          </a-radio>
          <a-radio value="EPSG:4326" name="projection">
            EPSG:4326
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
          @click="openDevtools"
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
      <div class="submmit-button">
        <a-button
          type="primary"
          size="large"
          @click="preview"
          shape="round"
          block
          >预览<a-icon type="arrow-right"
        /></a-button>
      </div>
    </a-form-model>
  </section>
</template>

<script>
import { fs, ipcRenderer } from "@/core/electron";
import { filterLayerSource } from "@/utils/filter";
import { initCityList, getXmlByMapServer } from "@/api/commonAPI";
import { URL } from "url";
import upload from "@/mixins/upload.js";
export default {
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
      formLayout: "horizontal",
      queryParams: {
        url:
          "https://t3.tianditu.gov.cn/vec_c/wmts?tk=b789a2ea9a2f0fa03122984062eb1f35",
        serviceType: "WMTS",
        projection: "EPSG:3857"
      },
      center: [],
      layerSource: [],
      citys: [],
      originMetaXml: "",
      isAdvanced: false
    };
  },
  name: "c-form",
  components: {},
  computed: {},
  mixins: [upload],
  created() {
    initCityList().then(res => (this.citys = res));
  },
  mounted() {},
  watch: {},
  methods: {
    //高级模式打开谷歌开发者工具
    openDevtools(checked) {
      checked ? (this.queryParams = {}) : (this.fileList = []);
      setTimeout(() => {
        ipcRenderer.send("app-open-devtools", checked);
      }, 100);
    },

    //通过WMTS服务类元信息
    async getWMTSInfo() {
      const url = this.queryParams.url.trim();
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
        .catch(e => {
          console.log(e);
          this.$message.error(e.message);
        });
    },

    //通过XYZ构建图层
    getXYZInfo() {
      return new Promise(reslove => {
        this.layerSource = [{ ...this.queryParams }];
        reslove(true);
      });
    },

    //通过手动模式直接上传切片元数据
    async getLayerInfoByFile() {
      this.originMetaXml = "";
      return this.readLocalJson(this.fileList[0]?.path);
    },

    // 城市选择
    changeCity(value, selectedOptions) {
      if (selectedOptions?.length > 0) this.center = selectedOptions[1]?.center;
    },

    // 中心点搜索
    filter(inputValue, path) {
      return path.some(
        option =>
          option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },

    //切片方式切换
    serviceTypeChange() {
      this.originMetaXml = "";
    },

    // 读取本地json文件
    readLocalJson(path) {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const { source } = JSON.parse(data);
        this.layerSource = source;
        this.$message.success("参数已读取");
      });
    },

    // 参数验证
    nullcheck() {
      if (!this.queryParams.url && !this.fileList.length) {
        this.$message.error("地图服务地址不能为空", 2);
        return;
      }

      if (!this.center.length) {
        this.$message.error("初始位置必选", 2);
        return;
      }
    },

    // 是否为手动预览模式
    isManualMode() {
      return this.fileList.length !== 0 && this.isAdvanced;
    },

    // 预览地图
    async preview() {
      this.nullcheck();
      try {
        if (this.isManualMode()) {
          await this.getLayerInfoByFile();
        } else {
          if (this.queryParams.serviceType === "WMTS") await this.getWMTSInfo();
          if (this.queryParams.serviceType === "XYZ") await this.getXYZInfo();
        }

        const result = {
          layerSource: this.layerSource,
          originMetaXml: this.originMetaXml,
          center: this.center
        };

        this.$emit("submmit", result);
      } catch (e) {
        console.log(e, e.message);
        this.$message.error(e.message);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.submmit-button {
  width: 320px;
  position: fixed;
  left: 100px;
  top: 400px;
}
</style>
