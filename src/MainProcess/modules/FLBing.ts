import fs from "fs";
import path from "path";
import https from "https";
import crypto from "crypto";

import { writeTags } from "../../background";
import { TagChangesType } from '@/types';
import { paths } from './Paths';

export class FLBing {
    trackID = '';
    url = '';
    saveLocation = '';
    tags: TagChangesType = {
        title: '',
        album: '',
        artist: '',
        APIC: '',
        imageUrl: '',
    };
    start(payload: any) {
        this.trackID = payload.id
        // this.url = payload.link
        this.url = "https://e-cdns-proxy-0.dzcdn.net/mobile/1/765031febfcf2f565da002cc8aa54feb5b117898a768a96b8b67da219a1065609b1f6b0b4cee99bda5e41a869dc68649bf320c977f6cb9ea37d75dce4b89c1096d66a70d2001ef56e4b03e4fb5cd2709"
        this.saveLocation = path.join(paths.flbingFolder, payload.tags.title) + '.mp3'
        this.tags = payload.tags
        console.table(payload);
        this.downloadTrack()
            .then((res) => {
                console.log("Track downloaded 🚀");
                console.log(res);
                this.writeTrackTags()
            }).catch((err) => {
                console.log("Error in downloading track");
                console.log(err);
            });
    }
    downloadTrack() {
        return new Promise<string>((resolve) => {
            const fileStream = fs.createWriteStream(this.saveLocation);
            https.get(this.url, (response: any) => {
                let i = 0;
                let percent = 0;
                response.on("readable", () => {
                    const bfKey = getBlowfishKey(this.trackID.toString());

                    let chunk;
                    while ((chunk = response.read(2048))) {
                        if (
                            (100 * 2048 * i) / response.headers["content-length"] >=
                            percent + 1
                        ) {
                            percent++;
                        }
                        if (i % 3 > 0 || chunk.length < 2048) {
                            fileStream.write(chunk);
                        } else {
                            const bfDecrypt = crypto.createDecipheriv(
                                "bf-cbc",
                                bfKey,
                                "\x00\x01\x02\x03\x04\x05\x06\x07"
                            );
                            bfDecrypt.setAutoPadding(false);

                            let chunkDec = bfDecrypt.update(
                                chunk.toString("hex"),
                                "hex",
                                "hex"
                            );
                            chunkDec += bfDecrypt.final("hex");
                            fileStream.write(chunkDec, "hex");
                        }
                        i++;
                        console.log("Chunk written");
                    }
                });
                response.on("end", () => {
                    fileStream.end();
                    console.log("Track Downloaded 🚀");
                    resolve(`Track saved to ${this.saveLocation}`);
                });
            });
        });
    }


    writeTrackTags() {
        writeTags(this.saveLocation, this.tags)
    }
}

function getBlowfishKey(trackID: string) {
    const SECRET = "g4el58wc0zvf9na1";
    const idMd5 = crypto.createHash("md5").update(trackID, "ascii").digest("hex");
    let bfKey = "";

    for (let i = 0; i < 16; i++) {
        bfKey += String.fromCharCode(
            idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ SECRET.charCodeAt(i)
        );
    }
    console.log("bfKey 👇");
    console.log(bfKey);
    return bfKey;
}