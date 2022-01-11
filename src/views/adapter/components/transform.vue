<template>
  <section class="trans-styles-container">
    <a-row class="trans-styles-origin">
      <a-col :span="24">
        <a-space>
          <span>图层列表：</span>
          <a-checkbox
            v-model:checked="state.checkAll"
            :indeterminate="state.indeterminate"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
          <a-checkbox-group
            v-model:value="state.checkedList"
            :options="state.layerNames"
          />
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-button">
      <a-col :span="24">
        <a-space>
          <span>切换版本：</span>
          <a-radio-group v-model:value="state.styleVersion">
            <a-radio value="v2">v2</a-radio>
            <a-radio value="v3">v3</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="createStyle">生成</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-rebuild">
      <a-col :span="24">
        <a-input-search
          v-model:value="state.replaceIP"
          placeholder="输入替换目标地址"
          enter-button="更改"
          @search="onSearch"
        />
      </a-col>
    </a-row>
  </section>
</template>

<script lang="ts" setup>
import { watch, toRaw, reactive } from "vue";

const $emit = defineEmits(["change"]);
const $props = defineProps({
  iptStyle: {
    type: Object,
    default: () => {},
  },
});
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  layerGroup: [],
  layerNames: <any>[],
  replaceIP: "",
  styleVersion: "v3",
});

watch(
  () => $props.iptStyle,
  (newIptStyle) => {
    console.log("监听到文件上传", newIptStyle);
    decodeLayers(toRaw(newIptStyle));
  },
  { deep: true }
);

// 从样式文件结构styles
const decodeLayers = (styles: any) => {
  const layers = styles["layers"] || styles["2d"]["layers"] || styles;
  const tags = Object.values(layers) as [];
  state.layerGroup.push(...tags);
  state.layerNames = [...tags.map((e: any, i: number) => String(i))];
};

const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? state.layerNames : [],
    indeterminate: false,
  });
};

// 转换样式文件
const generateLayer = (version: string, layers: []): void => {
  const versionStyle = {
    v2: {
      isCompatibleEngine: true,
      projection: "",
      layers: {},
      scenes: {
        default: [],
      },
      kmapServerUrl: "",
    },
    v3: {
      configType: "three",
      "3d": {
        content: [],
      },
      "2d": {
        layers: {},
      },
    },
  };
  switch (version) {
    case "v2":
      return Object.assign({} as any, versionStyle.v2, { layers });
    case "v3":
      return Object.assign({} as any, versionStyle.v3, { "2d": { layers } });
    default:
      return Object.assign({} as any, versionStyle.v3, { "2d": { layers } });
  }
};

// ip替换
const onSearch = (searchValue: string) => {
  console.log("use value", searchValue);
  console.log("or use this.value", state.replaceIP);
};

const createStyle = (): void => {
  // generateLayer(state.styleVersion.value);
};
</script>

<style lang="scss" scoped>
.trans-styles {
  &-origin {
  }
  &-button {
    margin-top: 10px;
  }
  &-rebuild {
    margin-top: 10px;
  }
}
</style>
