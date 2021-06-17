import { BrowserWindow } from "@/core/electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

let mainWindow = null;

const windowConfig = {
  width: 1450,
  height: 750,
  webPreferences: {
    // Use pluginOptions.nodeIntegration, leave this alone
    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
    nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    webSecurity: false
  }
};

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow(windowConfig);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }
}

export { createWindow, mainWindow };
