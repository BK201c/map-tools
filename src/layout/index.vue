<template>
  <section class="main-container">
    <section class="sidebar-layout">
      <the-menu></the-menu>
    </section>
    <section class="content">
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
.main-container {
  display: flex;
  height: 100vh;
  justify-content: space-around;
  .content {
    flex-grow: 1;
    padding: 0 15px;
  }
}
</style>
