import { paths } from "./b_Defaults";
import { TrackStatType, TrackType } from "../store/types";
import fs from "fs";
import {
	removeDuplicates,
	sortArrayOfObjects,
} from "../Utils/SharedUtilityFunctions";
import { win } from "../background";
export class PlaybackStats {
	playedFiles: Array<TrackType> = [];
	tracksStats: Array<TrackStatType> = [];

	constructor() {
		if (fs.existsSync(paths.playbackStatsLocation)) {
			const data = JSON.parse(
				fs.readFileSync(paths.playbackStatsLocation, "utf-8")
			);
			this.playedFiles = data.playedFiles;
			this.tracksStats = data.tracksStats;
		}
	}

	public addFile(file: TrackType) {
		console.log("Adding New File for stats");
		this.playedFiles.unshift(file);
		this.playedFiles = this.playedFiles.slice(0, 100);
		console.log(this.playedFiles.map(file => file.defaultTitle));
		sortArrayOfObjects(this.playedFiles, "fileLocation");
		this.generateMostPlayedTracks();
	}

	private generateMostPlayedTracks() {
		console.log("Generating Most Played Tracks");
		this.playedFiles.forEach((playedFile) => {
			const arrOfTrackPaths: Array<string> = this.playedFiles.map(
				(file) => file.defaultTitle
			);
			let arrayAsString = arrOfTrackPaths.join();
			let duplicates = arrayAsString.match(
				new RegExp(playedFile.defaultTitle, "g")
			);
			const trackStatObj: TrackStatType = {
				track: playedFile,
				numberOfPlays: 0,
			};
			if (!duplicates) {
				trackStatObj.numberOfPlays = 1
			} else {
				trackStatObj.numberOfPlays = duplicates.length
			}
			this.tracksStats.push(trackStatObj);
		});
		// sortArrayOfObjects(this.tracksStats, "numberOfPlays");
		win.webContents.send('mostPlayedTracks', this.mostPlayedTracks)
	}
	public saveChanges() {
		const stats = {
			playedFiles: this.playedFiles.filter((file) => file != undefined),
			tracksStats: this.tracksStats.filter((file) => file != undefined),
		};
		fs.writeFile(paths.playbackStatsLocation, JSON.stringify(stats), (err) => {
			if (err) console.log(err);
		});
	}

	public get recentlyPlayedTracks(): Array<TrackType> {
		let tracks = [...this.playedFiles];
		tracks = removeDuplicates(tracks, "fileLocation");
		tracks.slice(0, 19);
		return tracks;
	}

	public get mostPlayedTracks(): Array<TrackType> {
		return removeDuplicates(
			this.tracksStats.map((trackStatObj) => trackStatObj.track),
			"fileLocation"
		).slice(0, 20);
	}
	public get mostPlayedArtists(): string {
		return removeDuplicates(
			this.tracksStats.slice(0, 50).map((track) => track.track.artist),
			"defaultArtist"
		);
	}
}
