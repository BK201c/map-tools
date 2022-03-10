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
          <a-radio-group v-model:value="state.version" @change="changeVersion">
            <a-radio value="v2">v2</a-radio>
            <a-radio value="v3">v3</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="getReverseLayer">生成</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-rebuild">
      <a-col :span="24">
        <a-input-search
          v-model:value="state.replaceIP"
          placeholder="输入替换目标地址"
          enter-button="更改"
          @search="replaceTargetUrl"
        />
      </a-col>
    </a-row>
  </section>
</template>

<script lang="ts" setup>
import { watch, toRaw, reactive, watchEffect } from "vue";
import _ from "lodash";
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
  version: "v3",
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

// checkbox选中事件
const layerCheck = (key: any) => {
  if (state.checkedGroup.includes(key)) {
    _.pull(state.checkedGroup, key);
  } else {
    state.checkedGroup.push(key);
  }
  console.log(`选中${key}`, state.checkedGroup);
};

// 解析原始styles为单个图层列表
const decodeLayers = (styles: any) => {
  let layers = styles["layers"] || styles["2d"]["layers"];
  if (layers === "") layers = styles;
  state.layerGroup = layers;
  console.log("已解析", state.layerGroup);
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
const generatedStyle = (layers: object, version: string): {} => {
  const style: { [key: string]: any } = {
    v2: {
      isCompatibleEngine: true,
      projection: "",
      layers: layers,
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
        layers: layers,
      },
    },
  };
  return style[version];
};

//替换样式文件地址
const replaceTargetUrl = (
  originFullUrl: string,
  flagHost: string,
  flagMapName?: string
): string => {
  try {
    const url = new URL(originFullUrl);
    const pathList = url.pathname.split("/");
    if (pathList[1] === "threeMap") {
      // 判断是否属于kmapserver转发后的url
      return `${flagHost}/threeMap/${flagMapName || pathList[2]}${url.search}`;
    } else {
      return `${flagHost}/threeMap/${flagMapName || "local_map"}${
        url.pathname
      }${url.search}`;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//替换原始地址
const getPathByVersion = (version: string): string => {
  switch (version) {
    case "v2":
      return "@kedacom.com/kmap-server";
    case "v3":
      return "@kedacom.com/kmap-server-engine";
    default:
      return "@kedacom.com/kmap-server-engine";
  }
};

//获取转换版本后的图层
const getReverseLayer = () => {
  const layers: { [key: string]: any } = _.cloneDeep(
    _.pick(state.layerGroup, state.checkedGroup)
  );
  for (const key in layers) {
    if (Object.prototype.hasOwnProperty.call(layers, key)) {
      const element = layers[key];
      element.url = replaceTargetUrl(
        element.url,
        getPathByVersion(state.version)
      );
    }
  }
  const newStyle = generatedStyle(layers, state.version);
  $emit("rebuild", newStyle);
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
