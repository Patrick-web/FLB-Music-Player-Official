"use strict";

import {
	app,
	protocol,
	BrowserWindow,
	Notification,
	ipcMain,
	dialog,
	screen,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import fs from "fs";
import path from "path";
import { autoUpdater } from "electron-updater";
import {
	TrackType,
	FolderType,
	FolderInfoType,
	TagChangesType,
	processedFolderType,
	PlaylistType,
	TrackerDataType,
	tabType,
	SettingsType,
} from "./store/types";
import { Tags } from "node-id3";
import NodeID3 from "node-id3";
const musicParser = require("music-metadata");
const ffbinaries = require("ffbinaries");
const APPDATAFOLDER = app.getPath("userData");
const MUSICFOLDER = path.join(require("os").homedir(), "Music");
const TrackerLocation = path.join(APPDATAFOLDER, "Tracker.json");
const SettingsLocation = path.join(APPDATAFOLDER, "Settings.json");
let ffmpegPath = path.join(APPDATAFOLDER, "ffmpeg");
let ffProbePath = path.join(APPDATAFOLDER, "ffprobe");
import { DownloaderHelper } from "node-downloader-helper";
import { removeDuplicates, searchArtistPicture } from "./Utils/frontEndUtils";

// const logo = path.join(__static, "icon.png");

let appIsFocused = true;

console.log(APPDATAFOLDER);

const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
]);
//Gloabally accessible window object
var win: BrowserWindow;
async function createWindow() {
	const primaryDisplay = screen.getPrimaryDisplay();
	const { width, height } = primaryDisplay.workAreaSize;
	// Create the browser window.
	win = new BrowserWindow({
		width: width,
		height: height,
		frame: false,
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
		// autoUpdater.checkForUpdatesAndNotify()
	}

	win.on("blur", () => {
		appIsFocused = false;
		win.webContents.send("turnOffVisuals", "Window is not focused");
	});
	win.on("focus", () => {
		appIsFocused = true;
		win.webContents.send("turnOnVisuals", "Window is focused again");
	});
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
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

class Tracker {
	processedFiles: Array<TrackType> = [];
	recentlyPlayed: Array<TrackType> = [];
	playlists: Array<PlaylistType> = [{ name: "Favourites", tracks: [] }];
	constructor() {
		if (fs.existsSync(TrackerLocation)) {
			const data = JSON.parse(fs.readFileSync(TrackerLocation, "utf-8"));
			this.processedFiles = data.processedFiles;
			this.playlists = data.playlists;
			this.recentlyPlayed = data.recentlyPlayed;
			this.checkDeletedFiles();
		}
	}
	addToProcessedFile(track: TrackType) {
		this.processedFiles.unshift(track);
	}
	updateTrackInfo(payload: TrackType) {
		const tindex1 = this.processedFiles.findIndex(
			(track) => track.fileLocation == payload.fileLocation
		);
		const tindex2 = this.recentlyPlayed.findIndex(
			(track) => track.fileLocation == payload.fileLocation
		);
		this.processedFiles[tindex1] = payload;
		this.recentlyPlayed[tindex2] = payload;
		this.updateJSONfile();
	}
	addToRecentlyPlayed(track: TrackType) {
		track.isCurrentlyPlaying = false;
		this.recentlyPlayed.unshift(track);
		if (this.recentlyPlayed.length > 20) {
			this.recentlyPlayed.pop();
		}
		this.recentlyPlayed = removeDuplicates(this.recentlyPlayed, "fileLocation");
		this.updateJSONfile();
	}
	updatePlaylists(playlists: Array<PlaylistType>) {
		this.playlists = playlists;
		this.updateJSONfile();
	}
	checkDeletedFiles() {
		const deletedFiles: Array<string> = [];
		this.processedFiles.forEach((track, index) => {
			if (!fs.existsSync(track.fileLocation)) {
				deletedFiles.push(track.fileLocation);
				this.processedFiles.splice(index, 1);
			}
		});
		this.playlists.forEach((playlist) => {
			playlist.tracks.forEach((track, index) => {
				deletedFiles.includes(track.fileLocation);
				playlist.tracks.splice(index, 1);
			});
		});
		console.log("Deleted Files =>");
		console.log(deletedFiles);
	}
	reset() {
		this.processedFiles = [];
	}
	runBackGroundTasks() {
		const artists = new Set(
			this.processedFiles.map((file) => file.artist).filter((artist) => artist)
		);
		const artistData: object[] = [];
		artists.forEach((artist) => {
			searchArtistPicture(artist).then((res) => {
				if (res) {
					artistData.push(res);
				}
			});
		});
		console.log(artistData);
	}
	updateJSONfile() {
		this.processedFiles = removeDuplicates(this.processedFiles, "fileLocation");
		const data = {
			processedFiles: this.processedFiles,
			recentlyPlayed: this.recentlyPlayed,
			playlists: this.playlists,
		};
		fs.writeFile(TrackerLocation, JSON.stringify(data), (err) => {
			if (err) console.log(err);
		});
	}

	public get trackerData(): TrackerDataType {
		return {
			processedFiles: this.processedFiles,
			recentlyPlayed: this.recentlyPlayed,
			playlists: this.playlists,
		};
	}
}

class Settings {
	settings: SettingsType = {
		includeVideo: false,
		desktopNotifications: true,
		defaultTab: "Tracks",
		theme: "fancy",
		accentColor: "accent_blue",
		volume: 1,
		foldersToScan: [MUSICFOLDER],
	};
	constructor() {
		if (fs.existsSync(SettingsLocation)) {
			const data = JSON.parse(fs.readFileSync(SettingsLocation, "utf-8"));
			this.settings = data;
		}
	}
	updateSettings(payload: SettingsType) {
		this.settings = payload;
		this.saveSettings();
	}
	addFolderToScan(folderPath: string) {
		this.settings.foldersToScan.push(folderPath);
		this.saveSettings();
	}
	removeFromScannedFolders(folderPath: string) {
		this.settings.foldersToScan.forEach((folder, index) => {
			if (
				folder.replace(/(.*)[\/\\]/, "") == folderPath.replace(/(.*)[\/\\]/, "")
			) {
				this.settings.foldersToScan.splice(index, 1);
				return;
			}
		});
		this.saveSettings();
	}
	saveSettings() {
		fs.writeFile(SettingsLocation, JSON.stringify(this.settings), (err) => {
			if (err) console.log(err);
		});
	}

	public get getSettings(): SettingsType {
		return this.settings;
	}
}

const tracker = new Tracker();
const settings = new Settings();

ipcMain.on("initializeSettings", () => {
	win.webContents.send("userSettings", settings.getSettings);
});
ipcMain.on("getFirstTracks", async () => {
	refreshTracks();
});
ipcMain.on("initializeAppData", () => {
	console.log("Initializing...");
	const trackerData = tracker.trackerData;
	console.log(trackerData.processedFiles.length);
	if (trackerData.processedFiles.length > 0) {
		win.webContents.send("processedFiles", trackerData.processedFiles);
		win.webContents.send("userPlaylists", trackerData.playlists);
		win.webContents.send("recentlyPlayed", trackerData.recentlyPlayed);
		refreshTracks();
	}
});

ipcMain.on("resetApp", () => {
	tracker.reset();
	deleteFile(TrackerLocation);
	deleteFile(SettingsLocation);
	win.reload();
});

ipcMain.on("updatePlaylists", (e, payload) => {
	tracker.updatePlaylists(payload);
});

ipcMain.on("addScanFolder", () => {
	dialog.showOpenDialog(win, { properties: ["openDirectory"] }).then((data) => {
		if (!data.canceled) {
			settings.addFolderToScan(data.filePaths[0]);
			win.webContents.send("userSettings", settings.getSettings);
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
	console.log("refreshing");
	refreshTracks();
});

ipcMain.on("playingTrack", async (e, track: TrackType) => {
	tracker.addToRecentlyPlayed(track);
	if (!appIsFocused && settings.getSettings.desktopNotifications) {
		sendNativeNotification(
			track.title || track.extractedTitle || "",
			track.artist || track.extractedArtist
		);
	}
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
					const pathInfo = path.parse(pathToFile);
					await createParsedTrack(
						pathToFile,
						pathToFile.replace(/(.*)[\/\\]/, ""),
						{ name: pathInfo.name, path: pathInfo.dir }
					);
					tracker.updateJSONfile();
				}
			});
			setTimeout(() => {
				win.webContents.send("playNow");
			}, 1000);
		}
	}
});
ipcMain.on("updateSettings", async (e, payload: SettingsType) => {
	console.log(payload);
	settings.updateSettings(payload);
});

ipcMain.on("updateTags", async (e, payload) => {
	win.webContents.send("removeSelectedTracks", "");
	const isSuccess = await writeTags(
		payload.track.fileLocation,
		payload.tagChanges
	);
	if (isSuccess) {
		createParsedTrack(
			payload.track.fileLocation,
			payload.track.fileName,
			payload.track.folderInfo
		);
		console.log("Track Tags Updated");
		tracker.updateTrackInfo(payload);
	}
});

ipcMain.on("deleteFiles", async (e, payload: Array<TrackType>) => {
	win.webContents.send("removeSelectedTracks", "");
	payload.forEach((track) => {
		deleteFile(track.fileLocation);
	});
	console.log("Delete Done");
});

ipcMain.on("minimize", () => win.minimize());
ipcMain.on("maximize", () => {
	if (win.isMaximized()) {
		win.unmaximize();
		win.setSize(win.getBounds().width - 50, win.getBounds().height, true);
	} else {
		win.maximize();
	}
});
ipcMain.on("closeWindow", () => {
	tracker.updateJSONfile();
	settings.saveSettings();
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
function createParsedTrack(
	fileLocation: string,
	fileName: string,
	folderInfo: FolderInfoType
) {
	return new Promise<TrackType>((resolve, reject) => {
		const track: TrackType = {
			r_fileLocation: "",
			fileLocation: "",
			albumArt: "",
			album: "",
			title: "",
			artist: "",
			extractedTitle: "",
			defaultTitle: "",
			extractedArtist: "",
			defaultArtist: "",
			fileName: "",
			formattedLength: "",
			duration: "",
			dateAdded: 0,
			folderInfo: {
				name: "",
				path: "",
			},
			isCurrentlyPlaying: false,
		};
		track.fileLocation = fileLocation;
		track.r_fileLocation = "file://" + fileLocation;
		track.fileName = removeMIME(fileName);
		track.folderInfo = folderInfo;
		if (fileName.match(/\.mp4|\.mkv/)) {
			console.log(fileName);
			track.title = null;
			track.extractedTitle = null;
			track.artist = null;
			track.extractedArtist = "";
			track.album = "unknown";
			track.defaultTitle = track.fileName;
			track.defaultArtist = "";
			fs.stat(track.fileLocation, (err, stats) => {
				track.dateAdded = stats.ctimeMs;
			});
			tracker.addToProcessedFile(track);
			win.webContents.send("newTrack", track);
			resolve(track);
		} else {
			NodeID3.read(fileLocation, async (err: any, tags: any) => {
				if (tags && tags.image && tags.image.imageBuffer) {
					track.albumArt = `data:${
						tags.image.mime
					};base64,${tags.image.imageBuffer.toString("base64")}`;
				}
				track.title = tags.title;
				track.extractedTitle = extractTitleAndArtist(track.fileName).title;
				track.artist = tags.artist;
				track.extractedArtist = extractTitleAndArtist(track.fileName).artist;
				track.album = tags.album || "unknown";
				track.defaultTitle =
					track.title || track.extractedTitle || track.fileName;
				track.defaultArtist = track.artist || track.extractedArtist;
				fs.stat(track.fileLocation, (err, stats) => {
					track.dateAdded = stats.ctimeMs;
				});
				await musicParser
					.parseFile(fileLocation)
					.then((data: any) => {
						track.duration = data.format.duration;
						track.formattedLength = convertSecondsToTime(data.format.duration);
					})
					.catch(() => console.error("Music Parser Error"));
				console.log("sending track");
				win.webContents.send("newTrack", track);
				tracker.addToProcessedFile(track);
				resolve(track);
			});
		}
	});
}

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
			//  console.log("Parseing " + folderPath);
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
	// });
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
			const parsed = tracker.processedFiles.some(
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
	await createParsedTrack(
		data[index].filePath,
		data[index].fileName,
		data[index].folder
	);
	console.log("Done parsing " + data[index].fileName);
	if (index !== data.length - 1) {
		processTracks(data, index + 1);
		win.webContents.send("parsingProgress", `${index + 2}/${data.length}`);
	} else {
		tracker.updateJSONfile();
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
	if (tagChanges.imageUrl && tagChanges.imageUrl.includes("https:")) {
		tagChanges.imageUrl = await downloadFile(tagChanges.imageUrl);
	}
	let isSuccessFull = NodeID3.update(tagChanges, path);
	return isSuccessFull;
}

async function downloadFile(url: string) {
	return new Promise<string>((resolve, reject) => {
		const dl = new DownloaderHelper(url, APPDATAFOLDER);
		dl.start();
		win.webContents.send("successMsg", "Downloading...");
		dl.on("end", () => {
			win.webContents.send("successMsg", "Download Succesfull...");
			resolve(dl.getDownloadPath());
		});
		dl.on("error", () => reject("Error in downloding the cover"));
	});
}
function deleteFile(path: string) {
	fs.unlink(path.replace("file://", ""), (err) => {
		if (err) return win.webContents.send("errorMsg", "Error in Deleting File");
		win.webContents.send("successMsg", `${path} deleted`);
	});
	win.webContents.send("deleteComplete");
}
function sendNativeNotification(title: string, text: string) {
	const options = {
		title,
		subtitle: text,
		body: text,
		silent: true,
	};
	const notification = new Notification(options);
	notification.show();
	notification.on("click", () => {
		win.focus();
		win.maximize();
	});
}
function convertSecondsToTime(sec: number) {
	if (sec) {
		let sec_num = parseInt(JSON.stringify(sec), 10); // don't forget the second param
		let hours: string | number = Math.floor(sec_num / 3600);
		let minutes: string | number = Math.floor((sec_num - hours * 3600) / 60);
		let seconds: string | number = sec_num - hours * 3600 - minutes * 60;

		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return hours + ":" + minutes + ":" + seconds;
	}
	return "_ _ : _ _";
}

function extractTitleAndArtist(trackName: string): any {
	const split = trackName.split("-");
	let artist;
	let title;
	if (trackName.includes("_-")) {
		artist = split[0];
		title = split[1];
	} else if (trackName.includes("-")) {
		artist = split[1];
		title = split[0];
	} else {
		return { artist: "unknown", title: null };
	}
	artist = artist.replace(/_/g, " ").trim();
	title = title
		.replace(/_/g, " ")
		.replace(/\(.*\).*/gi, "")
		.replace(/\[.*\].*/gi, "")
		.replace(/\)/, "")
		.trim();
	return { artist, title };
}

function removeMIME(str: string) {
	return str.replace(/(\.mp3)|(\.m4a)|(\.ogg)|(\.wav)/gi, "");
}
