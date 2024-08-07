import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
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
    mainWindow?.webContents.send("file-opened", path);

    // 추후 권한 체크 로직 추가 예정
    if (true) {
      // 애플리케이션이 백그라운드로 실행 중일 때 에러 메시지 띄우기
      dialog.showErrorBox("파일 열기 오류", "파일을 열람할 권한이 없습니다.");
      return;
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
