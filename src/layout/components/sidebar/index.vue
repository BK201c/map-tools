<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    theme="dark"
    mode="inline"
    @click="handleClick"
  >
    <a-menu-item
      :key="menu.path"
      v-for="menu of crmRouter"
      @titleClick="titleClick"
    >
      <template #icon>
        <AntIcon :icon="menu.meta.icon" />
      </template>
      <template #title>{{ menu.meta.title }}</template>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from "vue";
import { crmRouter } from "@/router/modules/crm";
import router from "@/router";
import AntIcon from "@/components/icon";
const state = reactive({
  selectedKeys: ["1"],
  openKeys: ["sub1"],
});
const { selectedKeys, openKeys } = toRefs(state);

const handleClick = (e: any): void => {
  const path = e.keyPath.join("/");
  console.log("click", e, path);
  router.push({ path: path });
};

const titleClick = (e: Event): void => {
  console.log("titleClick", e);
};
</script>

<style lang="scss" scoped></style>
