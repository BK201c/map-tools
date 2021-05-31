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
import "animate.css";
Vue.use(Antd);

Vue.config.productionTip = false;
import "./permission";

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
