<template>
  <section class="container">
    <div class="container-form animate__animated animate__fadeInRight">
      <MapForm @submit="formSubmit"></MapForm>
    </div>
    <div class="container-preview">
      <Map
        :mapSource="mapSource"
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
import { LayerSource } from "./interface";

const mapStatus = reactive({
  center: [120.619585, 31.299379] as number[],
  mapSource: [] as LayerSource[],
});

const { center, mapSource } = toRefs(mapStatus);

const formSubmit = (data: any): void => {
  mapSource.value = data.mapSource;
  center.value = data.center;
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
