import { sendMessageToNode } from "@/RendererProcess/utilities";
import { removeDuplicates } from "@/sharedUtilities";
import { TrackType, ArtistType, AlbumType, PlaylistType, FolderParsedType, FolderInfoType } from "@/types";
import { ActionTree } from "vuex";
import TrackSelector from "./TrackSelector";

interface TabsManagerStateInterface {
    tabsData: {
        addedTracks: Array<TrackType>;
        recentlyPlayedTracks: Array<TrackType>;
        artists: Array<ArtistType>;
        albums: Array<AlbumType>;
        playlists: Array<PlaylistType>;
        folders: Array<FolderParsedType>;
    };
}
interface ArtistInfoInterface {
    name: string; picture: any; otherTracks: any;
}
const state: TabsManagerStateInterface = {
    tabsData: {
        addedTracks: [],
        recentlyPlayedTracks: [],
        artists: [],
        albums: [],
        playlists: [
            {
                name: "Favorites",
                tracks: [],
            },
        ],
        folders: [],
    },
};
const mutations = {
    addTrack(state: any, payload: TrackType) {
        const trackAlreadyAdded = state.tabsData.addedTracks.some(
            (track: TrackType) => track.fileLocation == payload.fileLocation
        );
        if (!trackAlreadyAdded) {
            state.tabsData.addedTracks.push(payload);
        }
    },
    restoreTracks(state: any, payload: Array<TrackType>) {
        state.tabsData.addedTracks = payload;
    },
    restoreRecentlyPlayed(state: any, payload: Array<TrackType>) {
        state.tabsData.recentlyPlayedTracks = payload;
    },
    restorePlaylists(state: any, payload: Array<PlaylistType>) {
        state.tabsData.playlists = payload;
    },
    createPlaylist(state: any, payload: string) {
        const newPlaylist: PlaylistType = {
            name: payload,
            tracks: [],
        };
        state.tabsData.playlists.push(newPlaylist);
        sendMessageToNode("updatePlaylists", state.tabsData.playlists);
    },
    renameCurrentPlaylist(state: any, payload: string) {
        state.tabsData.playlists.forEach((playlist: PlaylistType) => {
            if (playlist.name === state.selectedGroup?.name) {
                playlist.name = payload;
                state.selectedGroup.name = payload;
            }
        });
        sendMessageToNode("updatePlaylists", state.tabsData.playlists);
    },
    deletePlaylist(state: any, payload: string) {
        state.tabsData.playlists.forEach((playlist: PlaylistType, index: number) => {
            if (playlist.name === payload) {
                state.tabsData.playlists.splice(index, 1);
            }
        });
        sendMessageToNode("updatePlaylists", state.tabsData.playlists);
    },
    addSelectedTracksToPlaylist(state: any, payload: string) {
        state.tabsData.playlists.forEach((playlist: PlaylistType, index: number) => {
            if (playlist.name === payload) {
                TrackSelector.state.selectedTracks.forEach((track: TrackType) => {
                    state.tabsData.playlists[index].tracks.push(track);
                    state.tabsData.playlists[index].tracks = removeDuplicates(
                        state.tabsData.playlists[index].tracks,
                        "fileLocation"
                    );
                });
            }
        });
        sendMessageToNode("updatePlaylists", state.tabsData.playlists);
    },
    deleteSelectedTrackFromPlaylist(state: any, payload?: TrackType) {
        if (payload) {
            state.tabsData.playlists[0].tracks.forEach((track: TrackType, tindex: number) => {
                if (payload.fileLocation === track.fileLocation) {
                    state.tabsData.playlists[0].tracks.splice(tindex, 1);
                }
            });
            sendMessageToNode("updatePlaylists", state.tabsData.playlists);
            return
        }
        state.tabsData.playlists.forEach((playlist: PlaylistType, pindex: number) => {
            if (playlist.name === state.selectedGroup?.name) {
                playlist.tracks.forEach((track: TrackType, tindex: number) => {
                    TrackSelector.state.selectedTracks.forEach((selectedTrack: TrackType) => {
                        if (selectedTrack.fileLocation === track.fileLocation) {
                            state.tabsData.playlists[pindex].tracks.splice(tindex, 1);
                        }
                    });
                });
            }
        });
        sendMessageToNode("updatePlaylists", state.tabsData.playlists);
    },
    deleteSelectedTrackFromFavorites(state: any) {
        console.log(TrackSelector.state.selectedTracks[0]);
        state.tabsData.playlists[0].tracks.forEach((track: TrackType, index: number) => {
            if (TrackSelector.state.selectedTracks[0].fileLocation === track.fileLocation) {
                state.tabsData.playlists[0].tracks.splice(index, 1);
            }
        });
    },
}
const actions: ActionTree<any, any> = {
    generateArtistsData: ({ state, dispatch }) => {
        //clear the current data
        state.tabsData.artists = [];

        //Begin generation algorithm
        //Get a list of artistNames
        const artistNames: Set<string> = new Set(
            state.tabsData.addedTracks
                .map((track: TrackType) => track.artist || track.extractedArtist)
                .filter((artist: string) => artist)
        );
        //Loop through each artist to generate artistInfo objects
        artistNames.forEach((artist) => {
            const artistInfo: ArtistType = {
                name: artist,
                picture: null,
                tracks: [],
                albums: [],
            };

            const tracksFromCurrentArtist = state.tabsData.addedTracks.filter(
                (track: TrackType) => track.artist === artist || track.extractedArtist === artist
            );
            artistInfo.tracks = tracksFromCurrentArtist;

            const albumsFromCurrentArtist: string[] = tracksFromCurrentArtist
                .map((track: TrackType) => track.album)
                .filter((album: string) => album);

            albumsFromCurrentArtist.forEach((album) => {
                const newAlbum: AlbumType = {
                    name: album,
                    artist: artist,
                    tracks: tracksFromCurrentArtist.filter((track: TrackType) => track.album === album),
                };
                artistInfo.albums.push(newAlbum);
            });
            state.tabsData.artists.unshift(artistInfo);
        });
        dispatch('fetchArtistsInfo')
    },
    generateAlbumsData: ({ state }) => {
        state.tabsData.albums = [];

        const albumNames: Set<string> = new Set(
            state.tabsData.addedTracks
                .map((track: TrackType) => track.album)
                .filter((album: string) => album)
        );

        albumNames.forEach((album) => {
            const albumInfo: AlbumType = {
                name: album,
                artist: "",
                tracks: [],
            };
            const tracks: TrackType[] = state.tabsData.addedTracks.filter(
                (track: TrackType) => track.album === album
            );
            albumInfo.tracks = tracks;
            albumInfo.artist = tracks[0].artist || tracks[0].extractedArtist;
            state.tabsData.albums.unshift(albumInfo);
        });
    },
    generateFoldersData: ({ state }) => {
        state.tabsData.folders = [];
        let folders: Array<FolderInfoType> = state.tabsData.addedTracks.map(
            (track: TrackType) => track.folderInfo
        );
        folders = removeDuplicates(folders, "path");
        folders.forEach((folder) => {
            const folderInfo: FolderParsedType = {
                name: folder.name,
                path: folder.path,
                tracks: [],
            };
            const tracks = state.tabsData.addedTracks.filter(
                (track: TrackType) => track.folderInfo.path === folder.path
            );
            folderInfo.tracks = tracks;
            state.tabsData.folders.unshift(folderInfo);
        });
    },
    findAndGoToArtist({ state, commit }, payload: string) {
        state.tabsData.artists.forEach((artist: ArtistType) => {
            if (payload === artist.name) {
                commit("selectGroup", artist);
            }
        });
    },
    fetchArtistsInfo({ state, commit }) {
        const artistsData: ArtistInfoInterface[] = []
        const artists = state.tabsData.artists.map((artist: ArtistType) => artist.name)
        console.log(artists);
        artists.forEach((artist: string) => {
            fetch(
                `https://apiflbdeezer.herokuapp.com/search/?category=artists&query=${artist}`,
                { method: 'GET' }
            )
                .then((response) => response.text())
                .then((result) => {
                    const res = JSON.parse(result).results.slice(0, 1)[0];
                    if (res && res.name != "X UNDEFINED") {
                        if (res.name == artist) {
                            const artistInfo = {
                                name: artist,
                                picture: res.picture,
                                otherTracks: res.tracklist
                            }
                            artistsData.push(artistInfo)
                            localStorage.setItem('artistData', JSON.stringify(artistsData))

                        }
                    }
                })
                .catch((error) => console.log("error", error));
        });
    }
};

export default {
    state,
    actions,
    mutations,
};
