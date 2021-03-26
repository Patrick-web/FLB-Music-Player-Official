import fs from "fs";
import { paths } from "./b_Defaults";
import { TrackType, PlaylistType } from "../store/types";

export class FilesTracker {
	processedFiles: Array<TrackType> = [];

	constructor() {
		console.log(fs.existsSync(paths.filesTrackerLocation));
		if (fs.existsSync(paths.filesTrackerLocation)) {
			const data = JSON.parse(
				fs.readFileSync(paths.filesTrackerLocation, "utf-8")
			);
			this.processedFiles = data;
		}
	}
	addFile(track: TrackType) {
		this.processedFiles.unshift(track);
	}
	updateFile(track: TrackType) {
		const index = this.processedFiles.findIndex(
			(track) => track.fileLocation == track.fileLocation
		);
		this.processedFiles[index] = track;
		this.saveChanges();
	}
	deleteFile(track: TrackType) {
		const index = this.processedFiles.findIndex(
			(file) => file.fileLocation == track.fileLocation
		);
		this.processedFiles.splice(index, 1);
		this.saveChanges();
	}
	clearData() {
		this.processedFiles = [];
	}
	saveChanges() {
		fs.writeFile(
			paths.filesTrackerLocation,
			JSON.stringify(this.processedFiles),
			(err) => {
				if (err) console.log(err);
			}
		);
	}

	public get getTracks(): Array<TrackType> {
		return this.processedFiles;
	}
}

export class PlaylistsTracker {
	playlists: Array<PlaylistType> = [{ name: "Favourites", tracks: [] }];

	constructor() {
		if (fs.existsSync(paths.playlistsLocation)) {
			const data = JSON.parse(
				fs.readFileSync(paths.playlistsLocation, "utf-8")
			);
			this.playlists = data;
		}
	}
	updatePlaylists(playlists: Array<PlaylistType>) {
		this.playlists = playlists;
		this.saveChanges();
	}
	saveChanges() {
		fs.writeFile(
			paths.playlistsLocation,
			JSON.stringify(this.playlists),
			(err) => {
				if (err) console.log(err);
			}
		);
	}

	public get getPlaylists(): Array<PlaylistType> {
		return this.playlists;
	}
}
