import fs from "fs";
import path from "path";
import NodeID3 from "node-id3";
import { paths } from "../modules/Paths";
import { extractTitleAndArtist, removeMIME, writeImageBuffer } from "../utilities";
import { TrackType } from "@/types";
import { win, fileTracker } from "../../background";

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

            fileTracker.addFile(track);
            resolve(track);
        });
    });
}