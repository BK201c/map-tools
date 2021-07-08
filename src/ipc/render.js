import { ipcRenderer } from "@/core/electron";

const openDevTools = boolen => ipcRenderer.send("app-open-devtools", boolen);

export { openDevTools };
