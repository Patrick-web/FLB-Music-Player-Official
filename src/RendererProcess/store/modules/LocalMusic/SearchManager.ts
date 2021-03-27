import { TrackType, ArtistType } from "@/types";
import TabsManager from "./TabsManager";

const state = {
    searchResults: {
        tracks: [],
        artists: []
    }
};
const mutations = {
    search(state: any, query: string) {
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
                    artist.name.toLowerCase()?.includes(query.toLocaleLowerCase())
                )
                .slice(0, 5);
        }
    },
};

export default {
    state,
    mutations,
};
