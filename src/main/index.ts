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
      contextIsolation: true
    }
  });

  // 개발자 도구 열기
  if (is.dev) {
    mainWindow.webContents.openDevTools(); // 개발자 도구를 엽니다.
  }

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
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
  console.log("App is ready");

  const pathToOpen = process.argv[1];
  console.log(process.argv);
  if (pathToOpen) {
    console.log(`열리는 파일: ${pathToOpen}`);
    mainWindow?.webContents.send("file-opened", path);
  }

  // macOS에서 애플리케이션이 재사용될 때의 이벤트 처리
  app.on("open-file", (event, path) => {
    event.preventDefault();
    // 파일을 처리하는 로직
    console.log(`열리는 파일: ${path}`);
    // 필요한 경우, 파일 내용을 읽고 처리하는 로직을 추가
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  handleWindowEvents();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
