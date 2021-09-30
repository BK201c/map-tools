<template>
  <section class="container">
    <div class="container-form animate__animated animate__fadeInRight">
      <MapForm @submit="formSubmit"></MapForm>
    </div>
    <div class="container-preview">
      <Map
        :sourceGroup="sourceGroup"
        :center="center"
        @layerChange="layerChange"
        width="200px"
        height="300px"
      ></Map>
    </div>
  </section>
</template>

<script lang="ts" setup>
import Map from "./components/map/index.vue";
import MapForm from "./components/form/index.vue";
import { reactive, toRefs } from "@vue/reactivity";
import { LayerSource } from "./components/interface";

const mapStatus = reactive({
  center: [120.619585, 31.299379] as number[],
  sourceGroup: [] as LayerSource[],
});

const { center, sourceGroup } = toRefs(mapStatus);

const formSubmit = (form: any): void => {
  center.value = form.center;
  sourceGroup.value = form.source;
};

// 图层切换事件
const layerChange = (source: LayerSource) => {
  console.log(source);
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  &-form {
    flex-grow: 1;
  }
  &-preview {
    flex-grow: 2;
  }
}
</style>
