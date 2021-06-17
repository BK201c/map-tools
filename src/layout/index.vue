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
// import store from "@/store";
// import { ipcRenderer } from "electron";
export default {
  data() {
    return {};
  },
  name: "",
  components: { "the-menu": menu },
  computed: {},
  created() {},
  mounted() {
    // setTimeout(() => {
    //   ipcRenderer.invoke("app-update-zipPath").then(result => {
    //     store.commit("app/SET_ZIP_PATH", result);
    //   });
    // }, 500);
  },
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
@import "~@/styles/_var.scss";
$blank: 10px;
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
    }
  }
}
</style>
