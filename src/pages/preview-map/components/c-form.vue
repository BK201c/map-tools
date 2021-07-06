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
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="切片方式">
        <a-radio-group v-model="queryParams.serviceType" default-value="WMTS">
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
  </section>
</template>

<script>
import { ipcRenderer, fs } from "@/core/electron";
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
        serviceType: "WMTS"
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
      setTimeout(() => {
        ipcRenderer.send("app-open-devtools", checked);
      }, 200);
    },

    //通过服务器获取xml文件，同时解析元数据信息
    async getLayerInfoByServer() {
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
        .catch(function(error) {
          console.log(error);
        });
    },

    //通过手动模式直接上传切片元数据
    async getLayerInfoByFile() {
      this.readLocalJson(this.fileList[0]?.path);
      this.layerSource = [this.queryParams];
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
        const params = Object.assign({}, this.queryParams, JSON.parse(data));
        this.queryParams = params;
        this.$message.success("参数已读取");
      });
    },

    // 参数验证
    checkParams() {
      if (!this.queryParams.url) this.$message.error("地图服务地址不能为空", 2);

      if (!this.center.length) this.$message.error("初始位置必选", 2);

      return !!this.queryParams.url && !!this.center.length;
    },

    // 预览地图
    async preview() {
      // if (!this.checkParams()) return;
      try {
        this.fileList.length === 0
          ? await this.getLayerInfoByServer()
          : await this.getLayerInfoByFile();

        const result = {
          layerSource: this.layerSource,
          originMetaXml: this.originMetaXml,
          center: this.center
        };

        this.$emit("submmit", result);
      } catch (error) {
        console.log(error);
        this.$message.error("参数错误,启用调试模式");
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>
