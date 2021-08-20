import Vue from "vue";
import App from "./App.vue";

import VueRouter from "vue-router";
Vue.use(VueRouter);

import router from "./router";
import store from "./store";
import "ol/ol.css";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./styles/scroll.scss";
import "./styles/reset.css";
import "./styles/common.scss";
import "animate.css";
import "prismjs/themes/prism.css";

import "github-markdown-css/github-markdown.css";
import * as hljs from "highlight.js";
Vue.directive("highlight", function(el) {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach(block => {
    hljs.highlightBlock(block);
  });
});

Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
