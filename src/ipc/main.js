import { ipcMain, app, path } from "@/core/electron";
import { mainWindow } from "@/window";

const isDevelopment = process.env.NODE_ENV !== "production";

ipcMain.handle("app-update-zipPath", async () => {
  const appPath = app.getAppPath();
  return isDevelopment ? appPath : path.dirname(appPath);
});

ipcMain.on("app-open-devtools", (event, args) => {
  !mainWindow.webContents.isDevToolsOpened() && args
    ? mainWindow.webContents.openDevTools()
    : mainWindow.webContents.closeDevTools();
});
