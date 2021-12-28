<template>
  <section class="adapter-container">
    <a-row>
      <a-col :span="10">
        <Uploader :isDraggable="true" @uploaded="uploaded"></Uploader>
      </a-col>
      <a-col :span="14">
        <Higlight :code="code"></Higlight>
      </a-col>
    </a-row>
  </section>
</template>

<script lang="ts" setup>
import Uploader from "@/components/uploader/index.vue";
import Higlight from "@/components/higlight/index.vue";
import { ref } from "vue";
const code = ref("");

const uploaded = (value: any): void => {
  code.value = value;
};
</script>

<style lang="scss" scoped></style>
