<template>
  <div id="app">
    <a-config-provider :locale="zh_CN">
      <Layout />
    </a-config-provider>
  </div>
</template>

<script>
import Layout from "@/layout";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  name: "App",
  components: {
    Layout
  },
  data() {
    return {
      zh_CN
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
