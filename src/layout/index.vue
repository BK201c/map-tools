<template>
  <section class="main-container">
    <section class="layout-sidebar">
      <the-menu></the-menu>
    </section>
    <section class="layout-content">
      <router-view></router-view>
    </section>
  </section>
</template>

<script>
import menu from "@/layout/menu/menu";
import store from "@/store";
import { ipcRenderer } from "electron";
export default {
  data() {
    return {};
  },
  name: "",
  components: { "the-menu": menu },
  computed: {},
  created() {
    // 获取程序当前所在目录
    ipcRenderer.on("app-update-zipPath", (event, arg) => {
      console.log(event, arg);
      store.commit("app/SET_ZIP_PATH", arg);
    });
  },
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
@import "~@/styles/_var.scss";
.main-container {
  display: flex;
  height: 100vh;
  width: $mainWidth;
  overflow: hidden;
  .layout {
    &-sidebar {
      width: $sidebarWidth;
    }
    &-content {
      width: $contentWidth;
      flex-grow: 1;
      padding-left: 10px;
    }
  }
}
</style>
