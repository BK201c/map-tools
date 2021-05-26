import VueRouter from "vue-router";

import createLayer from "@/pages/create-layer/";
import previewMap from "@/pages/preview-map/";
import about from "@/pages/about/";
const routes = [
  { path: "/", redirect: "/create-layer" },
  { path: "/preview-map", name: "previewMap", component: previewMap },
  { path: "/create-layer", name: "createLayer", component: createLayer },
  { path: "/about", name: "about", component: about }
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
});

export default router;
