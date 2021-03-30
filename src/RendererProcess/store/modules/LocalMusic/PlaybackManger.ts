import { getSong } from "genius-lyrics-api";
import { ActionTree } from "vuex";
import UIController from './UIController';
import TabsManager from "./TabsManager";
import TrackSelector from "./TrackSelector";
import { sendMessageToNode } from "@/RendererProcess/utilities";
import { removeDuplicates, shuffleArray } from "@/sharedUtilities";
import { TrackType, geniusSongType } from "@/types";

interface PlayingTrackPayload {
    track: TrackType;
    index: number;
}
const state = {
    playingTrackInfo: {
        track: null,
        lyrics: null
    },
    audioState: {
        playing: false,
        repeat: false,
        shuffle: false,
    },
    playingQueue: [],
    customQueue: []
};
const mutations = {
    setPlayingTrack: (state: any, payload: PlayingTrackPayload) => {
        if (payload.track.defaultTitle) {
            state.playingTrackInfo.track = payload.track;
            state.playingTrackIndex = payload.index;
            state.audioState.playing = true;
            if (UIController.state.UIProperties.currentMainTab != "Recents") {
                TabsManager.state.tabsData.recentlyPlayedTracks.unshift(payload.track);
                TabsManager.state.tabsData.recentlyPlayedTracks = TabsManager.state.tabsData.recentlyPlayedTracks.splice(0, 20);
                console.log(TabsManager.state.tabsData.recentlyPlayedTracks);
                TabsManager.state.tabsData.recentlyPlayedTracks = removeDuplicates(TabsManager.state.tabsData.recentlyPlayedTracks, 'defaultTitle')
            }
            sendMessageToNode("playingTrack", payload.track);
        }
    },
    setSelectedTrackToPlayNext(state: any) {
        state.customQueue.unshift(TrackSelector.state.selectedTracks[0]);
        TrackSelector.state.selectedTracks.shift();
    },
    addSelectedTrackToCustomQueue(state: any) {
        TrackSelector.state.selectedTracks.forEach((track: TrackType) => {
            state.customQueue.push(track);
        });
        state.customQueue = removeDuplicates(state.customQueue, "fileLocation");
    },
    removeTrackFromCustomQueue(state: any, index: number) {
        state.customQueue.splice(index, 1);
    },
    clearCustomQueue(state: any) {
        state.customQueue = [];
    },
    overWriteCustomQueue(state: any, value: Array<TrackType>) {
        state.customQueue = value;
    },
};
const actions: ActionTree<any, any> = {
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
    getLyrics({ state }, track: TrackType) {
        state.playingTrackLyrics = null;
        const options = {
            apiKey:
                "OvIJKwGiXVXykOca4Yr5V4ys0wReNjxazasnInKUqGItUzgih9uQjrYK6YmSSzeS",
            title: track.defaultTitle,
            artist: track.defaultArtist,
            optimizeQuery: true,
        };

        getSong(options).then((song: geniusSongType) => {
            if (song) {
                state.playingTrackInfo.lyrics = song.lyrics.split(/\s\s/);
                state.playingTrackInfo.lyrics.filter((lyricBlock: string) => lyricBlock.trim() == '')
                console.log(state.playingTrackLyrics);
                const lyricsTabIcon: HTMLElement = document.getElementsByClassName(
                    "lyricsTabIcon"
                )[0] as HTMLElement;
                lyricsTabIcon.click();
            }
        });
    },
    determineNextTrack({ state, commit }, direction) {
        const playingTrackInfo = state.playingTrackInfo;
        let targetArray: TrackType[] = [];
        let playingFromCustomQueue = false
        if (state.customQueue.length) {
            targetArray = state.customQueue
            playingFromCustomQueue = true
        }
        else if (TrackSelector.state.selectedGroup?.tracks.length) {
            targetArray = TrackSelector.state.selectedGroup?.tracks;
        }
        else if (UIController.state.UIProperties.currentMainTab == 'Recents') {
            targetArray = TabsManager.state.tabsData.recentlyPlayedTracks
        }
        else if (UIController.state.UIProperties.currentMainTab == 'Tracks') {
            targetArray = TabsManager.state.tabsData.addedTracks;
        }
        const indexOfPlayingTrack = targetArray.findIndex((track) => track.defaultTitle == playingTrackInfo.track.defaultTitle)

        if (state.audioState.shuffle) {
            commit('setPlayingTrack', { track: shuffleArray(targetArray)[0], index: 0 })
        } else {
            if (direction == 'next') {
                commit('setPlayingTrack', { track: targetArray[indexOfPlayingTrack + 1], index: [indexOfPlayingTrack + 1] })
                if (playingFromCustomQueue) commit('removeTrackFromCustomQueue', [indexOfPlayingTrack + 1])
            }
            //when command is playPrevious
            else if (direction == 'prev') {
                commit('setPlayingTrack', { track: targetArray[indexOfPlayingTrack - 1], index: [indexOfPlayingTrack - 1] })
                if (playingFromCustomQueue) commit('removeTrackFromCustomQueue', [indexOfPlayingTrack - 1])
            }
        }

    }
}
export default {
    state,
    mutations,
    actions
};

