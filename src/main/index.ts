import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, shell } from "electron";
import path, { join } from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: "crypton",
    icon: path.join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 개발자 도구 열기

  mainWindow.webContents.openDevTools(); // 개발자 도구를 엽니다.

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.webContents.send("file-opened", process.argv);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  handleWindowEvents();

  createWindow();
  console.log("앱 실행");

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("ready", () => {
  app.on("open-file", (event, path) => {
    event.preventDefault();
    console.log(`열리는 파일: ${path}`);

    if (mainWindow) {
      mainWindow.webContents.send("file-opened", path);
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function handleWindowEvents(): void {
  ipcMain.handle("closeWindow", () => app.quit());
  ipcMain.handle("minimizeWindow", () => mainWindow?.minimize());
  ipcMain.handle("maximizeWindow", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
}
