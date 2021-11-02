import { createRouter, createWebHashHistory } from "vue-router";
import { crmRouter } from "./modules/crm";
import { MenuItem } from "./interface/menu";

const constantRouterMap: Array<MenuItem> = [
  {
    path: "/",
    meta: {
      title: "root",
    },
    component: () => import("@/layout/index.vue"),
    children: crmRouter,
    redirect: "/preview",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap as any,
});

export default router;
