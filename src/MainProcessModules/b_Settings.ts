import fs from "fs";
import { paths } from "./b_Defaults";
import { SettingsType } from "../store/types";

export class Settings {
	settings: SettingsType = {
		includeVideo: false,
		desktopNotifications: true,
		defaultTab: "Home",
		theme: "fancy",
		accentColor: "accent_blue",
		volume: 1,
		foldersToScan: [paths.musicFolder],
	};
	constructor() {
		if (fs.existsSync(paths.settingsLocation)) {
			const data = JSON.parse(fs.readFileSync(paths.settingsLocation, "utf-8"));
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
		fs.writeFile(
			paths.settingsLocation,
			JSON.stringify(this.settings),
			(err: any) => {
				if (err) console.log(err);
			}
		);
	}

	public get getSettings(): SettingsType {
		return this.settings;
	}
}
