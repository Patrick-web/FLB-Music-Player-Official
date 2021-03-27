import { ipcRenderer } from "electron";

export function sendMessageToNode(message: string, payload: any) {
    ipcRenderer.send(message, payload);
}