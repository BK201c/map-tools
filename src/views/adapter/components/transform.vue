<template>
  <section class="trans-styles-container">
    <a-row class="trans-styles-items">
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
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-space>
          <span>切换版本：</span>
          <a-radio-group v-model:value="state.version" @change="changeVersion">
            <a-radio value="v2">v2</a-radio>
            <a-radio value="v3">v3</a-radio>
          </a-radio-group>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="trans-styles-items">
      <a-col :span="24">
        <a-button type="primary" @click="getReverseLayer" ghost>生成</a-button>
      </a-col>
    </a-row>
    <!-- <a-row class="trans-styles-rebuild">
      <a-col :span="5">
        <a-select style="width:100%" v-model:value="state.targetLayer">
          <a-select-option
            v-for="(value, key) in state.layerGroup"
            :value="key"
            >{{ key }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="9">
        <a-input v-model:value="state.targetHost" placeholder="host" />
      </a-col>
      <a-col :span="5">
        <a-input v-model:value="state.targetMapName" placeholder="mapName" />
      </a-col>
      <a-col :span="5">
        <a-button type="primary" ghost>替换</a-button>
      </a-col>
    </a-row> -->
  </section>
</template>

<script lang="ts" setup>
import { watch, toRaw, reactive, watchEffect } from "vue";
import _ from "lodash";
import { message } from "ant-design-vue";
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
  targetLayer: "",
  targetHost: "",
  targetMapName: "",
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
  try {
    let layers;
    if (styles.hasOwnProperty("layers")) layers = styles["layers"];
    if (styles.hasOwnProperty("2d")) layers = styles["2d"]["layers"];
    if (styles instanceof Array && styles.length > 0) layers = { ...styles };
    console.log(toRaw(layers));

    state.layerGroup = layers;
    console.log("已解析", state.layerGroup);
    message.success("检测到样式文件，已解析");
  } catch (error) {
    console.log("样式文件解析失败", error);
    message.error("数据格式错误，解析失败！");
  }
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
      projection: Object.values(layers)[0].projection,
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
    if (pathList[2] === "threeMap") {
      // 判断是否属于kmapserver转发后的url
      return `${flagHost}/threeMap/${flagMapName ||
        pathList[3]}/${pathList.slice(-1).join("/")}${url.search}`;
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
  const fileName = `${state.version}_[ ${state.checkedGroup.join("&")} ]`;
  $emit("rebuild", { newStyle, fileName });
};
</script>

<style lang="scss" scoped>
.trans-styles {
  &-items {
    margin-top: 10px;
  }
}
</style>
