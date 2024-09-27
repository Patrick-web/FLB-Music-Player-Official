import { getSong } from "genius-lyrics-api";
import { ActionTree } from "vuex";
import UIController from './UIController';
import TabsManager from "./TabsManager";
import TrackSelector from "./TrackSelector";
import { sendMessageToNode } from "@/RendererProcess/utilities";
import { removeDuplicates, shuffleArray } from "@/sharedUtilities";
import { TrackType, geniusSongType, TrackLyricsType } from "@/types";
import { updateMediaInfo } from "@/RendererProcess/globalActivities/updateWindowsMediaInfo";

interface PlayingTrackPayload {
    track: TrackType;
    index: number;
}
interface PlaybackManagerStateInterface {
    playingTrackInfo: {
        track: TrackType | null;
    };
    audioState: {
        playing: boolean;
        repeat: boolean;
        shuffle: boolean;
    };
    allLyrics: TrackLyricsType[];
    playingQueue: TrackType[];
    customQueue: TrackType[];
}
const state: PlaybackManagerStateInterface = {
    playingTrackInfo: {
        track: null,
    },
    audioState: {
        playing: false,
        repeat: false,
        shuffle: false,
    },
    allLyrics: [],
    playingQueue: [],
    customQueue: []
};
const mutations = {
    setPlayingTrack: (state: PlaybackManagerStateInterface, payload: PlayingTrackPayload) => {
        if (payload?.track?.defaultTitle) {
            state.playingTrackInfo.track = payload.track;
            state.audioState.playing = true;
            if (UIController.state.UIProperties.currentMainTab != "Recents" && UIController.state.UIProperties.currentPage == 'My Music') {
                TabsManager.state.tabsData.recentlyPlayedTracks.unshift(payload.track);
                TabsManager.state.tabsData.recentlyPlayedTracks = TabsManager.state.tabsData.recentlyPlayedTracks.splice(0, 20);
                TabsManager.state.tabsData.recentlyPlayedTracks = removeDuplicates(TabsManager.state.tabsData.recentlyPlayedTracks, 'defaultTitle')
            }
            if (state.customQueue.length === 0) {
                state.customQueue.push(state.playingTrackInfo.track)
            }
            sendMessageToNode("playingTrack", payload.track);
            updateMediaInfo(payload.track)
        }
    },
    setSelectedTrackToPlayNext(state: PlaybackManagerStateInterface) {
        const indexOfPlayingTrack = state.customQueue.findIndex(track => track.fileLocation === state.playingTrackInfo.track?.fileLocation)
        state.customQueue = removeDuplicates([...state.customQueue.slice(0, indexOfPlayingTrack + 1), TrackSelector.state.selectedTracks[0], ...state.customQueue.slice(indexOfPlayingTrack + 1)], 'fileLocation')
        TrackSelector.state.selectedTracks.shift();
    },
    addSelectedTrackToCustomQueue(state: any) {
        TrackSelector.state.selectedTracks.forEach((track: TrackType) => {
            state.customQueue.push(track);
        });
        state.customQueue = removeDuplicates(state.customQueue, "fileLocation");
    },
    removeTrackFromCustomQueue(state: any, track:any) {
        state.customQueue = state.customQueue.filter((x:any)=>{return x.fileLocation!== track.fileLocation})
    },
    clearCustomQueue(state: any) {
        state.customQueue = [];
    },
    overWriteCustomQueue(state: any, payload: Array<TrackType>) {
        const copyOfPayload = [...payload];
        state.customQueue = copyOfPayload;
    },
    reorderQueue(state: any, payload: Array<TrackType>) {
        const copyOfPayload = [...payload];
        state.customQueue = copyOfPayload;
    },
    setPlayState(state: any, payload: 'play' | 'pause') {
        if (payload == 'play') {
            state.audioState.playing = true;
            document.querySelector("audio")?.play();
        } else {
            state.audioState.playing = false;
            document.querySelector("audio")?.pause();
        }
    },
};
const actions: ActionTree<PlaybackManagerStateInterface, any> = {
    toggleIsPlaying({ state }) {
        state.audioState.playing = !state.audioState.playing;
        if (state.audioState.playing) {
            document.querySelector("audio")?.play();
        } else {
            document.querySelector("audio")?.pause();
        }
    },
    toggleRepeat({ state }) {
        state.audioState.repeat = !state.audioState.repeat;
        document.querySelector("audio")!.loop = state.audioState.repeat;
    },
    toggleShuffler({ state }) {
        state.audioState.shuffle = !state.audioState.shuffle;
    },
    getLyrics({ state }) {
        const dbLyrics = localStorage.getItem('lyrics')
        if (dbLyrics) {
            const allLyrics: TrackLyricsType[] = JSON.parse(dbLyrics);
            state.allLyrics = allLyrics;
        }
        TabsManager.state.tabsData.addedTracks.forEach(track => {
            const options = {
                apiKey:
                    "OvIJKwGiXVXykOca4Yr5V4ys0wReNjxazasnInKUqGItUzgih9uQjrYK6YmSSzeS",
                title: track.defaultTitle,
                artist: track.defaultArtist,
                optimizeQuery: true,
            };

            const indexOfLyricsForTheTrack = state.allLyrics.findIndex(trackLyricsInfo => trackLyricsInfo.trackName == track.defaultTitle)
            if (indexOfLyricsForTheTrack == -1 && navigator.onLine) {
                getSong(options).then((song: geniusSongType) => {
                    if (song) {
                        let lyrics = [];
                        lyrics = song.lyrics.split(/\s\s/);
                        lyrics.filter((lyricBlock: string) => lyricBlock.trim() == '')
                        state.allLyrics.push({ trackName: track.defaultTitle, lyrics })
                        localStorage.setItem('lyrics', JSON.stringify(state.allLyrics))
                        //TODO: Replace above this click logic with the UIController method for switching to the lyrics tab 
                    }
                });
            }

        })
    },
    determineNextTrack({ state, commit }, direction) {
        const indexOfPlayingTrack = state.customQueue.findIndex(track => track.fileLocation === state.playingTrackInfo.track?.fileLocation)
        if (state.audioState.repeat) {
            const audio = document.querySelector('audio') as HTMLAudioElement
            audio.currentTime = 0;
            return
        }
        if (state.audioState.shuffle) {
            let randomIndex = Math.floor(Math.random() * state.customQueue.length)
            if (indexOfPlayingTrack == randomIndex) {
                randomIndex = Math.floor(Math.random() * state.customQueue.length)
            }
            commit('setPlayingTrack', { track: state.customQueue[randomIndex], index: randomIndex })
            return
        }
        if (direction == 'next') {
            if (indexOfPlayingTrack === state.customQueue['length'] - 1) {
                return
            }
            const nextTrack = state.customQueue[indexOfPlayingTrack + 1]
            commit('setPlayingTrack', { track: nextTrack, index: indexOfPlayingTrack + 1 })
            return
        }
        if (direction == 'prev') {
            if (indexOfPlayingTrack === 0) {
                return
            }
            const nextTrack = state.customQueue[indexOfPlayingTrack - 1]
            commit('setPlayingTrack', { track: nextTrack, index: indexOfPlayingTrack - 1 })
            return
        }
    }
}
export default {
    state,
    mutations,
    actions
};

