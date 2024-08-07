import { WindowContextAPI } from "@shared/types";
import { contextBridge, ipcRenderer } from "electron";

if (!process.contextIsolated) {
  throw new Error("contextIsolation must be enabled in the BrowserWindow");
}

try {
  const options: WindowContextAPI = {
    locale: navigator.language,
    windowActions: {
      close() {
        ipcRenderer.invoke("closeWindow");
      },
      minimize() {
        ipcRenderer.invoke("minimizeWindow");
      },
      maximize() {
        ipcRenderer.invoke("maximizeWindow");
      },
    },
  };

  contextBridge.exposeInMainWorld("context", options);

  contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
      on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      },
      send: (channel, data) => {
        ipcRenderer.send(channel, data);
      },
      removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
      },
    },
  });
} catch (error) {
  console.error(error);
}
