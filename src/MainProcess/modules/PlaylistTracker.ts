import { PlaylistType } from "@/types";
import fs from "fs";
import { paths } from "./Paths";

export class PlaylistsTracker {
    playlists: Array<PlaylistType> = [{ name: "Favorites", tracks: [] }];

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
