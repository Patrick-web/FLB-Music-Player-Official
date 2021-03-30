"use strict";

import {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    dialog,
    screen,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import fs from "fs";
import path from "path";
import { autoUpdater } from "electron-updater";

import NodeID3 from "node-id3";
import { paths } from "./MainProcess/modules/Paths";
import { PlaylistsTracker } from "./MainProcess/modules/PlaylistTracker";
import { FilesTracker } from "./MainProcess/modules/FilesTracker";
import { PlaybackStats } from "./MainProcess/modules/PlaybackStats";
import { Settings } from "./MainProcess/modules/Settings";
import { createParsedTrack } from "./MainProcess/core/createParsedTrack";
import { deleteFile, sendNativeNotification, downloadFile, isValidFileType } from "./MainProcess/utilities";
import { TrackType, SettingsType, FolderType, FolderInfoType, TagChangesType } from "@/types";


let appIsFocused = true;
export const fileTracker = new FilesTracker();
const playlistsTracker = new PlaylistsTracker();
const playbackStats = new PlaybackStats();
const settings = new Settings();

console.log(paths.appFolder);

const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);
//Globally accessible window object

export var win: BrowserWindow;
async function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    // Create the browser window.
    win = new BrowserWindow({
        width: width - 100,
        height: height - 100,
        frame: false,
        transparent: true,
        webPreferences: {
            // Required for Spectron testing
            webSecurity: false,
            enableRemoteModule: true,
            webviewTag: true,
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env
                .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
        },
    });

    win.maximize();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }

    win.on("blur", () => {
        appIsFocused = false;
    });
    win.on("focus", () => {
        appIsFocused = true;
    });
    win.on('close', () => {
        saveAppData()
    })

    autoUpdater.checkForUpdatesAndNotify();
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        saveAppData()
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    createWindow();
    protocol.registerFileProtocol("file", (request, callback) => {
        const pathname = decodeURI(request.url.replace("file:///", ""));
        callback(pathname);
    });
    //Register shortcuts
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
ipcMain.on("initializeSettings", () => {
    win.webContents.send("userSettings", settings.getSettings);
});
ipcMain.on("getFirstTracks", async () => {
    refreshTracks();
});
ipcMain.on("initializeApp", async () => {
    if (process.argv[1] && isValidFileType(process.argv[1])) {
        await createParsedTrack(
            process.argv[1],
        );
        win.webContents.send("playFirstTrack");
    }
    const processedFiles = fileTracker.getTracks;
    const playlists = playlistsTracker.getPlaylists;
    const recentlyPlayedTracks = playbackStats.recentlyPlayedTracks;
    console.log("Processed Tracks " + processedFiles.length);
    if (processedFiles.length > 0) {
        win.webContents.send("processedFiles", processedFiles);
        win.webContents.send("userPlaylists", playlists);
        win.webContents.send("recentlyPlayed", recentlyPlayedTracks);
        win.webContents.send("mostPlayedTracks", playbackStats.mostPlayedTracks);
        refreshTracks();
    }
});

ipcMain.on("resetApp", () => {
    deleteFile(paths.filesTrackerLocation, true);
    deleteFile(paths.playbackStatsLocation, true);
    deleteFile(paths.playlistsLocation, true);
    deleteFile(paths.settingsLocation, true);
    win.webContents.send('dangerMsg', "Resetting FLB")
    setTimeout(() => {
        app.relaunch()
        app.quit()
    }, 1000);
});

ipcMain.on("updatePlaylists", (e, payload) => {
    playlistsTracker.updatePlaylists(payload);
});

ipcMain.on("addScanFolder", () => {
    dialog.showOpenDialog(win, { properties: ["openDirectory"] }).then((data) => {
        if (!data.canceled) {
            settings.addFolderToScan(data.filePaths[0]);
            win.webContents.send("userSettings", settings.getSettings);
            if (fileTracker.getTracks.length) {
                refreshTracks()
                win.webContents.send('normalMsg', 'Refreshing...')
            }
        }
    });
});

ipcMain.on("removeFromScannedFolders", (e, payload) => {
    payload = payload.replace(/\\/g, "\\\\");
    console.log(payload);
    settings.removeFromScannedFolders(payload);
    win.webContents.send("userSettings", settings.getSettings);
});
ipcMain.on("refresh", () => {
    refreshTracks();
});

ipcMain.on("playingTrack", async (e, track: TrackType) => {
    playbackStats.addFile(track);
    if (!appIsFocused && settings.getSettings.desktopNotifications) {
        sendNativeNotification(
            track.defaultTitle,
            track.defaultArtist,
            track.albumArt
        );
    }
    // win.webContents.send("mostPlayedArtists", playbackStats.mostPlayedTracks);
});

ipcMain.on("processDroppedFiles", (e, filePaths) => {
    console.log("Dropped " + filePaths);
    if (Array.isArray(filePaths) && filePaths[0]) {
        win.webContents.send("normalMsg", "Processing Dropped Files");
        if (fs.lstatSync(filePaths[0]).isDirectory()) {
            parseFolder(filePaths[0], [], []);
        } else {
            filePaths.forEach(async (pathToFile) => {
                if (pathToFile.match(/\.mp3|\.webm|\.m4a|\.ogg/gi)) {
                    await createParsedTrack(pathToFile);
                    fileTracker.saveChanges();
                }
            });
            setTimeout(() => {
                win.webContents.send("playNow");
            }, 1000);
        }
    }
});
ipcMain.on("updateSettings", async (e, payload: SettingsType) => {
    settings.updateSettings(payload);
});

ipcMain.on("updateTags", async (e, payload) => {
    win.webContents.send("removeSelectedTracks", "");
    const isSuccess = await writeTags(
        payload.track.fileLocation,
        payload.tagChanges
    );
    if (isSuccess) {
        createParsedTrack(payload.track.fileLocation); console.log("Track Tags Updated");
        fileTracker.updateFile(payload);
    }
});
ipcMain.on("requestVersion", () =>
    win.webContents.send("appVersion", app.getVersion())
);
ipcMain.on("deleteFiles", async (e, payload: Array<TrackType>) => {
    win.webContents.send("removeSelectedTracks", "");
    payload.forEach((track) => {
        deleteFile(track.fileLocation, false);
    });
    console.log("Delete Done");
});

ipcMain.on("minimize", () => win.minimize());
ipcMain.on("maximize", () => {
    if (win.isMaximized()) {
        win.unmaximize();
        win.center();
    } else {
        win.maximize();
    }
});
ipcMain.on("closeWindow", () => {
    saveAppData()
    win.close();
});

ipcMain.on("importCoverArt", async () => {
    let file = dialog.showOpenDialog({
        title: "Select Picture",
        filters: [
            {
                name: "Picture (.jpg, .png, .jpeg)",
                extensions: ["jpg", "png", "jpeg"],
            },
        ],
        properties: ["openFile"],
    });
    if (file) {
        for (let possibleCover of (await file).filePaths) {
            if (possibleCover.match(/\.jpeg|\.jpg|\.png/gi)) {
                win.webContents.send("importedCoverArt", "file://" + possibleCover);
            }
        }
    } else {
        return;
    }
});

async function parseFolder(
    folderPath: string,
    subFolders: Array<string>,
    foldersFinalData: Array<FolderType>
) {
    return new Promise<any>((resolve) => {
        (function recursiveReader(
            folderPath: string,
            subFolders: Array<string>,
            foldersFinalData: Array<FolderType>
        ) {
            subFolders.shift();
            const folderObject_notParsed: FolderType = {
                name: folderPath.replace(/(.*)[\/\\]/, "").split(".")[0],
                path: folderPath,
                tracks: [],
            };
            fs.readdir(folderPath, async (err, files: Array<string>) => {
                let newSubFolders = files.filter((file) =>
                    fs.lstatSync(path.join(folderPath, file)).isDirectory()
                );
                newSubFolders = newSubFolders.map((item) =>
                    path.join(folderPath, item)
                );
                subFolders = [...subFolders, ...newSubFolders];
                const audioFiles = files.filter((file) =>
                    file.match(/\.mp3|\.webm|\.m4a|\.ogg|\.wav/gi)
                );
                const videoFiles = files.filter((file) => file.match(/\.mp4|\.mkv/gi));
                folderObject_notParsed.tracks = audioFiles;
                if (settings.getSettings.includeVideo) {
                    folderObject_notParsed.tracks = [
                        ...folderObject_notParsed.tracks,
                        ...videoFiles,
                    ];
                }
                foldersFinalData = [...foldersFinalData, folderObject_notParsed];
                if (subFolders[0]) {
                    recursiveReader(subFolders[0], subFolders, foldersFinalData);
                } else {
                    resolve(foldersFinalData);
                    console.log("Am Done Reading all the folders");
                }
            });
        })(folderPath, subFolders, foldersFinalData);
    });
}

interface dataParamObj {
    fileName: string;
    filePath: string;
    folder: FolderInfoType;
}
async function prepareTracksForProcessing(foldersFinalData: Array<FolderType>) {
    const data: Array<dataParamObj> = [];
    foldersFinalData.forEach((folder) => {
        folder.tracks.forEach((fileName) => {
            const filePath = path.join(folder.path, fileName);
            const parsed = fileTracker.getTracks.some(
                (file) => file.fileLocation == filePath
            );
            if (!parsed) {
                data.push({ fileName, filePath, folder });
            }
        });
    });
    if (data.length !== 0) {
        processTracks(data, 0);
    }
}
async function processTracks(data: Array<dataParamObj>, index: number) {
    console.log("Beginning to parse " + data[index].fileName);
    await createParsedTrack(data[index].filePath);
    console.log("Done parsing " + data[index].fileName);
    if (index !== data.length - 1) {
        processTracks(data, index + 1);
        win.webContents.send("parsingProgress", [index + 2, data.length]);
    } else {
        fileTracker.saveChanges();
        win.webContents.send("parsingDone", data.length);
        return;
    }
}

function refreshTracks() {
    const folders = settings.getSettings.foldersToScan;
    console.log(folders);
    let superFolder: FolderType[] = [];
    handleAllFolders(folders, folders.length, 0);
    function handleAllFolders(folders: string[], length: number, index: number) {
        parseFolder(folders[index], [], []).then((data) => {
            superFolder = [...superFolder, ...data];
            index += 1;
            if (index <= length - 1) {
                handleAllFolders(folders, length, index);
            } else {
                prepareTracksForProcessing(superFolder);
            }
        });
    }
}

async function writeTags(path: string, tagChanges: TagChangesType) {
    if (tagChanges.APIC && tagChanges.APIC.includes("https:")) {
        tagChanges.APIC = await downloadFile(tagChanges.APIC);
    }
    tagChanges.APIC.replace("file:///", "");
    tagChanges.APIC = decodeURI(tagChanges.APIC);
    let isSuccessFull = NodeID3.update(tagChanges, path);
    if (isSuccessFull) {
        win.webContents.send("normalMsg", "Tags Successfully changed");
    } else {
        win.webContents.send("errorMsg", "An Error occurred while changing tags");
    }
    return isSuccessFull;
}

function saveAppData() {
    fileTracker.saveChanges();
    settings.saveSettings();
    playbackStats.saveChanges();
}