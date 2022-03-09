import { createRouter, createWebHashHistory } from "vue-router";
import { baseRouter } from "./modules/base";
import { MenuItem } from "./interface/menu";

const constantRouterMap: Array<MenuItem> = [
  {
    path: "/",
    meta: {
      title: "root",
    },
    component: () => import("@/layout/index.vue"),
    children: baseRouter,
    redirect: "/adapter",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap as any,
});

export default router;
