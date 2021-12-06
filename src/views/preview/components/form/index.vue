<template>
  <section>
    <a-divider orientation="left">接口参数</a-divider>
    <a-form
      :model="form"
      :label-col="formConfig.labelCol"
      :wrapper-col="formConfig.wrapperCol"
    >
      <a-form-item label="服务地址" :wrapperCol="{ span: 16, offset: 0 }">
        <a-input
          v-model:value="form.url"
          placeholder="http://xxx.xxxxx.com/vec_c/wmts"
          :allowClear="true"
          :disabled="form.isManualMode"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="接入方式">
        <a-radio-group v-model:value="form.serviceType">
          <a-radio
            value="WMTS"
            name="serviceType"
            :disabled="form.isManualMode"
          >
            WMTS
          </a-radio>
          <a-radio value="XYZ" name="serviceType" :disabled="form.isManualMode">
            XYZ
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="投影坐标系" v-if="form.serviceType === 'XYZ'">
        <a-radio-group v-model:value="form.projection">
          <a-radio value="EPSG:4326" name="projection">
            EPSG:4326
          </a-radio>
          <a-radio value="EPSG:3857" name="projection">
            EPSG:3857
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="初始位置">
        <CitySelector @change="cityChange"></CitySelector>
      </a-form-item>
      <a-form-item label="专业模式">
        <a-switch
          :checked="form.isDevToolOpened"
          checked-children="开"
          un-checked-children="关"
          @click="openTheDevtools"
        />
      </a-form-item>
      <div class="advanced-items" v-if="form.isDevToolOpened">
        <a-form-item label="调试参数">
          <Uploader @uploaded="fileUploaded"></Uploader>
        </a-form-item>
      </div>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button
          type="primary"
          size="large"
          @click="formSubmit"
          shape="round"
          block
        >
          预览</a-button
        >
      </a-form-item>
    </a-form>
  </section>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import CitySelector from "./components/citySelector/index.vue";
import Uploader from "./components/uploader/index.vue";
import { LayerSource } from "../../interface";
import { formConfig } from "../styles";
import { getLayerSourceByServer } from "@/api/common";

// 表单内容
const form = reactive({
  url:
    "https://t3.tianditu.gov.cn/vec_c/wmts?tk=b789a2ea9a2f0fa03122984062eb1f35",
  layer: "defaultLayer",
  serviceType: "WMTS",
  projection: "EPSG:4326",
  center: [120.619585, 31.299379],
  isDevToolOpened: false,
  isManualMode: false,
});
const $emit = defineEmits(["formSubmit"]);

const sendSource = reactive({
  center: form.center,
  mapSource: [] as LayerSource[],
});

// 更换中心点坐标
const cityChange = (center: any): void => {
  center.values = center;
  console.log("Center point has been changed!", center);
};

// 提交表单
const formSubmit = (): void => {
  getLayerSourceByServer(form.url).then((source) => {
    sendSource.mapSource = source as LayerSource[];
    $emit("formSubmit", sendSource);
    console.log("Form submmitted", sendSource);
  });
};

// 打开开发者模式
const openTheDevtools = (): void => {
  form.isDevToolOpened = !form.isDevToolOpened;
};

//手动添加图层
const fileUploaded = (layers: LayerSource[]): void => {
  console.log("Layer has been added manually", layers);
  sendSource.mapSource = layers;
};
</script>

<style lang="scss" scoped></style>
