<template>
  <section class="adapter-container">
    <a-row>
      <a-col :span="10">
        <Uploader :isDraggable="true" @uploaded="uploaded"></Uploader>
        <a-col :span="24">
          <Transform @change="change" :originStyles="code"></Transform>
        </a-col>
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
import Transform from "./components/transform.vue";
import { ref } from "vue";
const code = ref({ layer: "test" });

const uploaded = (value: any): void => {
  code.value = value;
  console.log("捕获到upload");
};

const change = (): void => {};
</script>

<style lang="scss" scoped></style>
