<template>
  <section>
    <a-divider orientation="left">接口参数</a-divider>
    <a-form
      :model="formLayer"
      :label-col="formConfig.labelCol"
      :wrapper-col="formConfig.wrapperCol"
    >
      <a-form-item label="服务地址" :wrapperCol="{ span: 16, offset: 0 }">
        <a-input
          v-model:value="formLayer.url"
          placeholder="http://xxx.xxxxx.com/vec_c/wmts"
          :allowClear="true"
          :disabled="isManualMode"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="接入方式">
        <a-radio-group v-model:value="formLayer.serviceType">
          <a-radio value="WMTS" name="serviceType" :disabled="isManualMode">
            WMTS
          </a-radio>
          <a-radio value="XYZ" name="serviceType" :disabled="isManualMode">
            XYZ
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="投影坐标系" v-if="formLayer.serviceType === 'XYZ'">
        <a-radio-group v-model:value="formLayer.projection">
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
          :checked="isDevToolOpened"
          checked-children="开"
          un-checked-children="关"
          @click="openTheDevtools"
        />
      </a-form-item>
      <div class="advanced-items" v-if="isDevToolOpened">
        <a-form-item label="调试参数">
          <Uploader @uploaded="fileUploaded"></Uploader>
        </a-form-item>
      </div>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button
          type="primary"
          size="large"
          @click="submit"
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
import { reactive, toRefs, ref, toRaw, UnwrapRef } from "vue";
import CitySelector from "./components/citySelector/index.vue";
import Uploader from "./components/uploader/index.vue";
import { LayerSource } from "../interface";
import { formConfig } from "../styles";
import { getLayerSourceByServer } from "@/api/common";

const $emit = defineEmits(["submit"]);

// 表单内容
const formLayer: UnwrapRef<LayerSource> = reactive({
  url:
    "https://t3.tianditu.gov.cn/vec_c/wmts?tk=b789a2ea9a2f0fa03122984062eb1f35",
  layer: "defaultLayer",
  serviceType: "WMTS",
  projection: "EPSG:4326",
});

//表单状态切换
const { isDevToolOpened, isManualMode, center } = toRefs(
  reactive({
    center: [120.619585, 31.299379],
    isDevToolOpened: false,
    isManualMode: false,
  })
);

//地图预览source
const source = ref<LayerSource[]>([formLayer]);

// 更换中心点坐标
const cityChange = (center: any): void => {
  center.values = center;
  console.log("已切换初始中心点坐标", center);
};

// 提交表单
const submit = (): void => {
  const sendSource = toRaw({ source: source.value, center: center.value });
  $emit("submit", sendSource);
  console.log("表单数据", sendSource);
};

// 打开开发者模式
const openTheDevtools = (): void => {
  isDevToolOpened.value = !isDevToolOpened.value;
};

//手动添加图层
const fileUploaded = (layers: LayerSource[]): void => {
  console.log("已手动添加图层", layers);
  source.value = layers;
};
</script>

<style lang="scss" scoped></style>
