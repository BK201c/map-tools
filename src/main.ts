import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//createAPP
const app = createApp(App);

//custom
import "./styles/reset.css";
import "./styles/common.scss";
import "./styles/scroll.scss";
import "animate.css";
import "ol/ol.css";

//antd-UI
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { message } from "ant-design-vue";
app.provide("$message", message);

app
  .use(router)
  .use(Antd)
  .mount("#app");
