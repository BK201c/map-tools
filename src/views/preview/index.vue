<template>
  <section class="container">
    <div class="form-box animate__animated animate__fadeInRight">
      <MapForm @submmit="formSubmit"></MapForm>
    </div>
    <!-- <Map
      :source="extraParams"
      :center="center"
      @layerChange="layerChange"
      width="200px"
      height="300px"
    ></Map> -->
  </section>
</template>

<script lang="ts" setup>
// import Map from "./components/map/index.vue";
import MapForm from "./components/form/index.vue";
import { reactive, toRefs } from "@vue/reactivity";
import { Form, LayerSource } from "./components/form/interface";
const status = reactive({
  center: <any>[],
  extraParams: <any>[],
});

const { center, extraParams } = toRefs(status);

const formSubmit = (form: Form) => {
  center.value = form.center;
};

// 图层切换事件
const layerChange = (source: LayerSource) => {
  console.log(source);
};
</script>

<style lang="scss" scoped></style>
