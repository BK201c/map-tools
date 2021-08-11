import VueRouter from "vue-router";

import createLayer from "@/pages/create-layer/";
import previewMap from "@/pages/preview-map/";
import about from "@/pages/about/";
const routes = [
  { path: "/", redirect: "/preview-map" },
  { path: "/preview-map", name: "previewMap", component: previewMap },
  { path: "/create-layer", name: "createLayer", component: createLayer },
  { path: "/about", name: "about", component: about }
];

const router = new VueRouter({
  routes
});

export default router;
