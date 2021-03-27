import { TrackType } from "@/types";
import fs from "fs";
import { paths } from "./Paths";

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
