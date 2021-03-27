import { app } from "electron";
import fs from 'fs'
import path from "path";
const APP_DATA_FOLDER = app.getPath("userData");
const ALBUM_ART_FOLDER = path.join(APP_DATA_FOLDER, 'Album Art')
if (!fs.existsSync(ALBUM_ART_FOLDER)) {
	fs.mkdirSync(ALBUM_ART_FOLDER)
}
export const paths = {
	appFolder: APP_DATA_FOLDER,
	albumArtFolder: ALBUM_ART_FOLDER,
	musicFolder: path.join(require("os").homedir(), "Music"),
	filesTrackerLocation: path.join(APP_DATA_FOLDER, "processedFiles.json"),
	playlistsLocation: path.join(APP_DATA_FOLDER, "Playlists.json"),
	playbackStatsLocation: path.join(APP_DATA_FOLDER, "PlaybackStats.json"),
	settingsLocation: path.join(APP_DATA_FOLDER, "Settings.json"),
};
