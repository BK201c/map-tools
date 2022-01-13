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
            :options="state.checkNameList"
          />
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
import { watch, toRaw, reactive, ref } from "vue";

const $emit = defineEmits(["rebuild", "changeVersion"]);
const $props = defineProps({
  iptStyle: {
    type: [Object, String],
  },
});
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  layerGroup: [],
  checkNameList: <any>[],
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

// 解析原始styles为单个图层列表
const decodeLayers = (styles: any) => {
  const layers = styles["layers"] || styles["2d"]["layers"] || styles;
  const tags = Object.values(layers) as [];
  state.layerGroup = tags;
  state.checkNameList = [...tags.map((e: any, i: number) => String(i))];
};

const changeVersion = (e: Event) => {
  $emit("changeVersion", e);
};

const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? state.checkNameList : [],
    indeterminate: false,
  });
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
  const checkdLayer = [...state.checkedList.map((e) => state.layerGroup[e])];
  const targetStyle = generateLayer(state.styleVersion, checkdLayer);
  console.log(`已生成${state.styleVersion}样式`, targetStyle);
  $emit("rebuild", targetStyle);
};

//替换样式文件地址
const replaceUrlByVersion = (
  version: string,
  ip: string,
  url: string
): void => {
  // const kmapServer = {
  //   v2: {
  //     ip: "@kedacom.com",
  //     path: "/kmap-server/threeMap",
  //     map: "local_map",
  //   },
  //   v3: {
  //     ip: "@kedacom.com",
  //     path: "/kmap-server-engine/threeMap",
  //     map: "local_map",
  //   },
  // };
  // const targetPath: string = `${ip || kmapServer[version].ip}${
  //   kmapServer[version].path
  // }${kmapServer[version].map}`;
  // const reg =
  //   "((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)";
  // return url.replace(reg, targetPath);
};

const replaceUrl = (): void => {
  state.layerGroup.forEach(
    (layer: any) =>
      (layer.url = replaceUrlByVersion(
        state.styleVersion,
        state.replaceIP,
        layer.url
      ))
  );
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
