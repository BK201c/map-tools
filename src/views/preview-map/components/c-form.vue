<template>
  <section>
    <a-divider orientation="left">接口参数</a-divider>
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
          :disabled="isManualMode"
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="接入方式">
        <a-radio-group v-model="queryParams.serviceType" default-value="WMTS">
          <a-radio value="WMTS" name="serviceType" :disabled="isManualMode">
            WMTS
          </a-radio>
          <a-radio value="XYZ" name="serviceType" :disabled="isManualMode">
            XYZ
          </a-radio>
          <!-- <a-radio value="WMS" name="serviceType" :disabled="true">
            WMS
          </a-radio> -->
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
          v-model="position"
          placeholder="搜索或选择中心点"
          @change="changeCity"
        />
      </a-form-model-item>
      <a-form-model-item label="专业模式">
        <a-switch
          v-model="isAdvanced"
          checked-children="开"
          un-checked-children="关"
          @click="openTheDevtools"
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
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button
          type="primary"
          size="large"
          @click="preview"
          shape="round"
          block
          >预览<a-icon type="arrow-right"
        /></a-button>
      </a-form-model-item>
    </a-form-model>
  </section>
</template>

<script>
import { fs } from "@/core/electron";
import { openDevTools } from "@/ipc/render";
import { filterLayerSource } from "@/utils/filter";
import { getXmlByMapServer } from "@/api/commonAPI";
import { URL } from "url";
import { upload, citySelector } from "@/mixins";
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
      position: [320000, 320500],
      isAdvanced: false
    };
  },
  name: "c-form",
  components: {},
  computed: {
    // 是否为手动预览模式
    isManualMode() {
      return this.fileList.length > 0 && this.isAdvanced;
    }
  },
  mixins: [upload, citySelector],
  created() {},
  mounted() {},
  watch: {},
  methods: {
    //高级模式打开谷歌开发者工具
    openTheDevtools(checked) {
      setTimeout(() => {
        openDevTools(checked);
      }, 300);
    },

    //通过WMTS服务类元信息
    async getWMTSInfo() {
      const url = this.queryParams.url.trim();
      const query = {
        SERVICE: "WMTS",
        REQUEST: "GetCapabilities",
        VERSION: "1.0.0"
      };
      return getXmlByMapServer(url, query)
        .then(async xml => {
          let layerSource = filterLayerSource(xml);
          const myURL = new URL(url);
          if (myURL.search !== "")
            layerSource.forEach(source => (source.url = url));
          return { layerSource, xml };
        })
        .catch(e => {
          console.log(e);
          this.$message.error(e.message);
        });
    },

    //通过XYZ构建图层
    getXYZInfo() {
      return new Promise(reslove => {
        reslove({ layerSource: [{ ...this.queryParams }], xml: "" });
      });
    },

    //通过手动模式直接上传切片元数据
    async getLayerInfoByFile() {
      return await this.readLocalJson(this.fileList[0]?.path);
    },

    // 读取本地json文件
    readLocalJson(path) {
      return new Promise((reslove, reject) => {
        fs.readFile(path, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          const { layerSource } = JSON.parse(data);
          this.$message.success("参数已导入");
          reslove({ layerSource, xml: "" });
        });
      });
    },

    // 参数验证
    nullcheck() {
      if (!this.queryParams.url && !this.fileList.length)
        throw { message: "URL错误：地图服务地址不能为空!" };

      if (!this.center.length) throw { message: "参数错误：初始位置必选" };
    },

    //设置图层数据源
    async setLayerSource() {
      if (this.isManualMode) {
        return await this.getLayerInfoByFile();
      } else {
        return this.queryParams.serviceType === "WMTS"
          ? await this.getWMTSInfo()
          : await this.getXYZInfo();
      }
    },

    // 预览地图
    preview() {
      try {
        this.nullcheck();
        this.setLayerSource().then(({ layerSource, xml }) => {
          this.$emit("submmit", { layerSource, xml, center: this.center });
        });
      } catch (e) {
        console.log(e);
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
