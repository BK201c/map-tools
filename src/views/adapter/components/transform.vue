<template>
  <section class="trans-styles-container">
    <a-row class="trans-styles-origin">
      <a-col :span="24">
        <a-space>
          <span>图层列表：</span>
          <!-- <a-checkbox
            v-model:checked="state.checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox> -->
          <a-checkbox
            v-for="(value, key) in state.layerGroup"
            @change="layerCheck(key)"
            >{{ key }}</a-checkbox
          >
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-button">
      <a-col :span="24">
        <a-space>
          <span>切换版本：</span>
          <a-radio-group
            v-model:value="state.styleVersion"
            @change="changeVersion"
          >
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
          @search="replaceUrl"
        />
      </a-col>
    </a-row>
  </section>
</template>

<script lang="ts" setup>
import { watch, toRaw, reactive, watchEffect, version } from "vue";

const $emit = defineEmits(["rebuild", "changeVersion"]);
const $props = defineProps({
  iptStyle: {
    type: [Object, String],
  },
});
const state = reactive({
  checkAll: false,
  layerGroup: {},
  checkedGroup: <any>[],
  replaceIP: "",
  styleVersion: "v3",
});

watch(
  () => $props.iptStyle,
  (newIptStyle) => {
    decodeLayers(toRaw(newIptStyle));
  },
  { deep: true }
);

watchEffect(() => {
  // state.checkedGroup = [...state.checkedList.map((e) => state.layerGroup[e])];
});
const layerCheck = (key: any) => {
  console.log(key);
};

// 解析原始styles为单个图层列表
const decodeLayers = (styles: any) => {
  let layers = styles["layers"] || styles["2d"]["layers"];
  // if (styles["layers"] !== "") {
  //   layers = styles["layers"];
  // } else if (styles["2d"]["layers"] !== "") {
  //   layers = styles["2d"]["layers"];
  // } else if (styles instanceof Array && styles !== []) {
  //   layers = styles;
  // }
  console.log(layers);

  debugger;
  state.layerGroup = layers;
  // state.checkList = Object.keys(layers);
  console.log(state.layerGroup, state.checkList);
};

const changeVersion = (e: Event) => {
  $emit("changeVersion", e);
};

const onCheckAllChange = (e: any) => {
  // Object.assign(state, {
  //   checkedList: e.target.checked ? state.checkNameList : [],
  //   indeterminate: false,
  // });
};

// 转换样式文件
const generateLayer = (version: string, layerGroup: any[]): {} => {
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
  let layers: { [key: string]: any } = {};
  layerGroup.map((e, i) => {
    layers[`layer${i}`] = e;
  });
  switch (version) {
    case "v2":
      return Object.assign({} as any, versionStyle.v2, {
        projection: layerGroup[0].projection,
        layers,
      });
    case "v3":
      return Object.assign({} as any, versionStyle.v3, { "2d": { layers } });
    default:
      return Object.assign({} as any, versionStyle.v3, { "2d": { layers } });
  }
};

//生成样式文件
const createStyle = (): void => {
  const targetStyle = generateLayer(state.styleVersion, state.checkedGroup);
  console.log(`已生成${state.styleVersion}样式`, targetStyle);
  $emit("rebuild", targetStyle);
};

//替换样式文件地址
const replaceTargetUrl = (
  originFullUrl: string,
  flagHost: string,
  flagMapName?: string
): string => {
  const url = new URL(originFullUrl);
  return `${url.pathname}${url.search}`;
};

//替换原始地址
const getPathByVersion = (version: string): string => {
  switch (version) {
    case "v2":
      return "@kedacom.com/kmap-server/threeMap/local_map";
    case "v3":
      return "@kedacom.com/kmap-server-engine/threeMap/local_map";
    default:
      return "@kedacom.com/kmap-server-engine/threeMap/local_map";
  }
};

//
const replaceUrl = (): void => {
  state.checkedGroup.forEach((layer: any) => {
    // layer.url = replaceUrlByVersion(state.replaceIP, layer.url);
  });
  setTimeout(() => createStyle(), 0);
};
</script>

<style lang="scss" scoped>
.trans-styles {
  &-button {
    margin-top: 10px;
  }
  &-rebuild {
    margin-top: 10px;
  }
}
</style>
