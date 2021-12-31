<template>
  <section>
    <a-row class="origin-sources">
      <a-tag
        v-for="layer in tagLayers"
        draggable="true"
        ondragstart="drag(event)"
        >{{ layer.layer }}</a-tag
      >
    </a-row>
    <a-row class="build-layer-area">
      <div class="layerGroup">
        <li
          class="layer-room"
          v-for="(group, index) in layerGroup"
          ondrop="drop(event)"
          ondragover="allowDrop(event)"
        >
          <span>图层{{ index + 1 }}</span>
        </li>
        <li class="layer-room addNew">
          <span>点击添加一个新图层</span>
        </li>
      </div>
    </a-row>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, toRaw } from "vue";

const $emit = defineEmits(["change"]);
const $props = defineProps({
  originStyles: {
    type: Object,
    default: () => {},
  },
});

const tagLayers = ref([$props.originStyles]);
const layerGroup = ref([]);

watch(
  () => $props.originStyles,
  (newProp) => {
    console.log("监听到文件上传", newProp);
    decodeLayers(toRaw(newProp));
  },
  { deep: true }
);

// 从样式文件结构styles
const decodeLayers = (styles: any) => {
  const layers = styles["layers"] || styles["2d"]["layers"] || styles;
  const tags = Object.values(layers) as [];
  tagLayers.value.push(...tags);
};

const log = (e: MouseEvent) => {
  console.log(e);
};
</script>

<style lang="scss" scoped>
.layer-room {
  height: 150px;
  width: 140px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 1px 0px 9px 0px #ebe6e2;
}
</style>
