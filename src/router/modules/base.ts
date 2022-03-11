import { MenuItem } from "../interface/menu";

//侧边栏导航
export const baseRouter: Array<MenuItem> = [
  {
    meta: {
      title: "适配文件",
      icon: "HomeOutlined",
    },
    path: "/adapter",
    name: "adapter",
    component: () => import("@/views/adapter/index.vue"),
  },
  // {
  //   meta: {
  //     title: "预览地图",
  //     icon: "FileSearchOutlined",
  //   },
  //   path: "/preview",
  //   name: "preview",
  //   component: () => import("@/views/preview/index.vue"),
  // },
  // {
  //   meta: {
  //     title: "使用说明",
  //     icon: "ProjectOutlined",
  //   },
  //   path: "/guide",
  //   name: "guide",
  //   component: () => import("@/views/guide/index.vue"),
  // },
  {
    meta: {
      title: "关于",
      icon: "SettingOutlined",
    },
    path: "/about",
    name: "about",
    component: () => import("@/views/about/index.vue"),
  },
];
