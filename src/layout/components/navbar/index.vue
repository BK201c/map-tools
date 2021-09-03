<template>
  <section class="navbar">
    <div class="navbar-menu">
      <a-menu
        theme="light"
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
      >
        <a-menu-item v-for="nav in navList" :key="nav.path">{{
          nav.meta.title
        }}</a-menu-item>
      </a-menu>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { navList } from "@/router/modules/crm";
import { ref } from "vue";
const selectedKeys = ref<string[]>([navList[0].path]);
</script>

<style lang="scss" scoped>
@import "@/styles/_var.scss";
.navbar {
  width: 100%;
  display: flex;
}
</style>
