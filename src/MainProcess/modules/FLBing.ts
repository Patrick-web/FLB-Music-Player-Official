import fs from "fs";
import path from "path";
import https from "https";

import { win, writeTags } from "../../background";
import { paths } from './Paths';
import { deleteFile, sendMessageToRenderer } from "../utilities";
import { createParsedTrack } from "../core/createParsedTrack";

export class FLBing {
    downloadQueue: Array<any> = []
    downloadState: 'downloading' | 'empty' = 'empty'
    addToDownloadQueue(payload: any) {
        const newTrackToDownload = {
            payload,
            trackLocation: path.join(paths.flbingFolder, payload.tags.title) + '.mp3'
        }
        this.downloadQueue.push(newTrackToDownload)
        if (this.downloadState == 'empty') {
            sendMessageToRenderer('updatePendingTrackState', { id: payload.trackID, stateCode: 3 })
            console.log("Queue is empty, beginning download");
            this.downloadFirstTrackInTheQueue()
        } else {
            sendMessageToRenderer('updatePendingTrackState', { id: payload.trackID, stateCode: 4 })
            console.log("There's something downloading let me wait");
        }
    }
    downloadFirstTrackInTheQueue() {
        const trackToDownload = this.downloadQueue[0];

        this.downloadQueue.shift()

        win.webContents.send('normalMsg', `Downloading ${trackToDownload.payload.tags.title} by ${trackToDownload.payload.tags.artist}`)

        const fileStream = fs.createWriteStream(trackToDownload.trackLocation);

        console.log("Downloading...");

        this.downloadState = 'downloading'
        https.get(
            trackToDownload.payload.trackURL,
            (response) => {
                let fileSize = 0
                let percent = 0;
                let downloaded = 0;

                sendMessageToRenderer('updatePendingTrackState', { id: trackToDownload.payload.trackID, stateCode: 5 })

                response.on("readable", () => {
                    fileSize = parseInt(response.headers["content-length"]!);
                    let chunk;
                    while ((chunk = response.read(2048))) {
                        fileStream.write(chunk);
                        downloaded += 2048;
                        percent = Math.trunc((downloaded / fileSize) * 100);
                        this.sendDownloadProgress(trackToDownload.payload.trackID, percent)
                        console.log("Downloaded " + percent + '%');
                    }
                });
                response.on("end", () => {
                    fileStream.end();
                    this.writeTrackTags(trackToDownload.trackLocation, trackToDownload.payload.tags)
                    win.webContents.send('successMsg', `${trackToDownload.payload.tags.title} by ${trackToDownload.payload.tags.artist} Downloaded 🚀`)
                    win.webContents.send('bingTrackDownloaded', trackToDownload.trackID)
                    console.log("Track Downloaded 🚀");
                    if (this.downloadQueue[0]) {
                        this.downloadFirstTrackInTheQueue()
                        console.log("Moving on to the next track");
                    } else {
                        this.downloadState = 'empty'
                    }
                });
                response.on('error', () => {
                    sendMessageToRenderer('updatePendingTrackState', { id: trackToDownload.payload.trackID, stateCode: 7 })
                    console.log("Error in Downloading");
                    fileStream.end();
                    deleteFile(trackToDownload.trackLocation, true)
                    win.webContents.send('dangerMsg', `Error Downloading ${trackToDownload.payload.tags.title} by ${trackToDownload.payload.tags.artist}`)
                })
            }
        ).on('error', () => {
            sendMessageToRenderer('updatePendingTrackState', { id: trackToDownload.payload.trackID, stateCode: 7 })
            console.log("Error in Downloading");
            fileStream.end();
            deleteFile(trackToDownload.trackLocation, true)
            win.webContents.send('dangerMsg', `Error Downloading ${trackToDownload.payload.tags.title} by ${trackToDownload.payload.tags.artist}`)
        })

    }

    sendDownloadProgress(trackID: any, progress: any) {
        win.webContents.send('bingDownloadProgress', {
            id: trackID,
            progress
        })
    }
    async writeTrackTags(location: any, tags: any) {
        const success = writeTags(location, tags)
        console.log("Writing tags first");
        console.log(tags);
        console.log(location);
        console.log("Tag write is " + success);
        if (await success == true) {
            createParsedTrack(location)
                .then((track) => {
                    console.log("Sending Downloaded track");
                    win.webContents.send('downloadedTrack', track)
                }).catch((err) => {
                    console.log("Some error while parsing the downloaded track");
                });
        }
    }
}
