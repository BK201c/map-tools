import { createRouter, createWebHashHistory } from "vue-router";
import { crmRouter } from "./modules/crm";
import { MenuItem } from "./interface/menu";

const constantRouterMap: Array<MenuItem> = [
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    children: crmRouter,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap,
});

export default router;
