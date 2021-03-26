import fs from "fs";
import path from "path";
import { paths } from "@/MainProcessModules/b_Defaults";
import { TrackType } from "@/store/types";
import NodeID3 from "node-id3";
import { removeMIME, extractTitleAndArtist } from "./SharedUtilityFunctions";
import { fileTracker, win } from "@/background";
import { DownloaderHelper } from "node-downloader-helper";
import { Notification } from "electron";

export function createParsedTrack(
	fileLocation: string
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
				name: path.parse(path.parse(fileLocation).dir).base,
				path: path.parse(fileLocation).dir
			}
		};
		path.parse(fileLocation);
		track.fileLocation = fileLocation;
		track.r_fileLocation = "file://" + fileLocation;
		track.fileName = path.parse(fileLocation).name;
		NodeID3.read(fileLocation, async (err: any, tags: any) => {
			if (tags && tags.image && tags.image.imageBuffer) {
				tags.image.mime = tags.image.mime.replace(/image\//g, '')
				console.log(tags.image.mime);
				const albumArtPath = path.join(
					paths.albumArtFolder,
					`${removeMIME(track.fileName)}.${tags.image.mime}`
				);
				writeImageBuffer(tags.image.imageBuffer, albumArtPath)
				track.albumArt = albumArtPath
				// track.albumArt = `data:${tags.image.mime
				// 	};base64,${tags.image.imageBuffer.toString("base64")}`;
				//code to write image
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

			win.webContents.send("newTrack", track);
			fileTracker.addFile(track);
			resolve(track);
		});
	});
}
function writeImageBuffer(imageBuffer: string, savePath: string) {
	fs.writeFileSync(savePath, imageBuffer)
	console.log("Writing album art to " + savePath);
}
export async function downloadFile(url: string) {
	return new Promise<string>((resolve, reject) => {
		const dl = new DownloaderHelper(url, paths.appFolder);
		dl.start();
		win.webContents.send("normalMsg", "Downloading...");
		dl.on("end", () => {
			win.webContents.send("normalMsg", "Download Successful...");
			resolve(dl.getDownloadPath());
		});
		dl.on("error", () => reject("Error in downloading the cover"));
	});
}
export function deleteFile(path: string) {
	fs.unlink(path.replace("file://", ""), (err) => {
		if (err) return win.webContents.send("errorMsg", "Error in Deleting File");
		win.webContents.send("normalMsg", `${path} deleted`);
	});
	win.webContents.send("deleteComplete");
}

export function sendNativeNotification(
	title: string,
	text: string,
	image: string
) {
	const options = {
		title,
		subtitle: text,
		body: text,
		silent: true,
		icon: image,
	};
	const notification = new Notification(options);
	notification.show();
	notification.on("click", () => {
		win.focus();
		win.maximize();
	});
}
