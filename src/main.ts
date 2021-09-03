import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//custom
import "./styles/reset.css";
import "./styles/common.scss";
import "./styles/scroll.scss";
import "animate.css";
import "prismjs/themes/prism.css";
import "ol/ol.css";

//antd-UI
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

//createAPP
const app = createApp(App);
app
  .use(router)
  .use(Antd)
  .mount("#app");
