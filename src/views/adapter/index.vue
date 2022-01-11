<template>
  <section class="adapter-container">
    <a-row>
      <a-col :span="10">
        <a-row>
          <a-col :span="24">
            <Uploader @uploaded="uploaded"></Uploader>
          </a-col>
        </a-row>
        <a-row class="adapter-container-tags">
          <a-col :span="24">
            <Transform @change="change" :iptStyle="code"></Transform>
          </a-col>
        </a-row>
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
const code = ref({});

const uploaded = (value: any): void => {
  code.value = value;
  console.log("捕获到upload");
};

const change = (): void => {};
</script>

<style lang="scss" scoped>
.adapter-container {
  &-tags {
    margin-top: 50px;
  }
}
</style>
