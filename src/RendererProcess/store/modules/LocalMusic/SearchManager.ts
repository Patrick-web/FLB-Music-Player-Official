import { TrackType, ArtistType, AlbumType } from "@/types";
import TabsManager from "./TabsManager";

interface SearchManagerStateInterface {
    searchResults: {
        tracks: TrackType[];
        artists: ArtistType[];
        albums: AlbumType[];
    };
}

const state: SearchManagerStateInterface = {
    searchResults: {
        tracks: [],
        artists: [],
        albums: [],
    }
};
const mutations = {
    search(state: SearchManagerStateInterface, query: string) {
        if (query) {
            state.searchResults.tracks = TabsManager.state.tabsData.addedTracks
                .filter(
                    (track: TrackType) =>
                        track.defaultTitle
                            ?.toLowerCase()
                            ?.includes(query.toLocaleLowerCase()) ||
                        track.fileName
                            ?.toLowerCase()
                            ?.includes(query.toLocaleLowerCase()) ||
                        track.artist
                            ?.toLowerCase()
                            ?.includes(query.toLocaleLowerCase()) ||
                        track.extractedArtist
                            ?.toLowerCase()
                            ?.includes(query.toLocaleLowerCase())
                )
                .slice(0, 8);
            state.searchResults.artists = TabsManager.state.tabsData.artists
                .filter((artist: ArtistType) =>
                    artist.name.toLowerCase()?.startsWith(query.toLocaleLowerCase())
                )
                .slice(0, 5);
            state.searchResults.albums = TabsManager.state.tabsData.albums
                .filter((album: AlbumType) =>
                    album.name.toLowerCase()?.includes(query.toLocaleLowerCase())
                )
                .slice(0, 5);
        }
    },
};

export default {
    state,
    mutations,
};
