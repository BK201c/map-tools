import store from "./store";
import { ipcRenderer } from "electron";

// 获取程序当前所在目录
ipcRenderer.on("app-update-zipPath", (event, arg) => {
  console.log(event, arg);
  store.commit("app/SET_ZIP_PATH", arg);
});
