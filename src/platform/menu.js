import { remote } from "electron";
const Menu = remote.Menu;
const template = [
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        label: "Toggle Full Screen",
        accelerator: (function() {
          if (process.platform == "darwin") return "Ctrl+Command+F";
          else return "F11";
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: "Toggle Developer Tools",
        accelerator: (function() {
          if (process.platform == "darwin") return "Alt+Command+I";
          else return "Ctrl+Shift+I";
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) focusedWindow.toggleDevTools();
        }
      }
    ]
  },
  {
    label: "Window",
    role: "window",
    submenu: [
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize"
      },
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        role: "close"
      }
    ]
  },
  {
    label: "帮助",
    role: "help",
    submenu: [
      {
        label: "文档",
        click: function() {
          require("electron").shell.openExternal(
            "https://github.com/BK201c/map-tools"
          );
        }
      },
      {
        label: "关于",
        click: function() {
          require("electron").shell.openExternal(
            "https://github.com/BK201c/map-tools"
          );
        }
      }
    ]
  }
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

export default Menu;
