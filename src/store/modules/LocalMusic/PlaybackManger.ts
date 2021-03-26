import { removeDuplicates, sendMessageToNode } from "@/Utils/SharedUtilityFunctions";
import { getSong } from "genius-lyrics-api";
import { ActionTree } from "vuex";
import { geniusSongType, TrackType } from "../../types";
import UIController from './UIController';
import TabsManager from "./TabsManager";
import TrackSelector from "./TrackSelector";

interface PlayingTrackPayload {
    track: any;
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
    },
    setSelectedTrackToPlayNext(state: any) {
        state.customQueue.unshift(state.selectedTracks[0]);
        state.selectedTracks.shift();
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
    toggleShuffler(state: any) {
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
        //1. Check if there are tracks in the custom queue and if so play the first one
        if (state.customQueue.length) {
            commit('setPlayingTrack', { track: state.customQueue[0], index: 0 })
        }
        //2. Check if tracks from any of the groups(Artist,Album or Playlist) are rendered
        else if (TrackSelector.state.selectedGroup?.tracks.length) {
            //if they are rendered get the index of the playing track
            const indexOfPlayingTrack = TrackSelector.state.selectedGroup?.tracks.findIndex((track) => track.defaultTitle == playingTrackInfo.track.defaultTitle)
            console.log(TrackSelector.state.selectedGroup?.tracks[indexOfPlayingTrack].defaultTitle);
            console.log(TrackSelector.state.selectedGroup?.tracks[indexOfPlayingTrack + 1].defaultTitle);
            //if the command is to playNext and there exists a track after the currently playing one, play it
            if (direction == 'next' && TrackSelector.state.selectedGroup?.tracks[indexOfPlayingTrack + 1]) {
                console.log("Playing next track from group");
                commit('setPlayingTrack', { track: TrackSelector.state.selectedGroup?.tracks[indexOfPlayingTrack + 1], index: [indexOfPlayingTrack + 1] })
                return
            }
            //when command is playPrevious
            else if (direction == 'prev' && TrackSelector.state.selectedGroup?.tracks[indexOfPlayingTrack - 1]) {
                commit('setPlayingTrack', { track: TrackSelector.state.selectedGroup?.tracks[indexOfPlayingTrack - 1], index: [indexOfPlayingTrack + 1] })
                return
            }
        }
        //If the playing track is not found in both checks then it has to be in the tracks or recents tab
        //Get the index of the playing track if the current tab is recents 
        if (UIController.state.UIProperties.currentMainTab == 'Recents') {
            const indexOfPlayingTrack = TabsManager.state.tabsData.recentlyPlayedTracks.findIndex((track) => track.defaultTitle == playingTrackInfo.track.defaultTitle)
            //if the command is to playNext and there exists a track after the currently playing one, play it
            if (direction == 'next' && TabsManager.state.tabsData.recentlyPlayedTracks[indexOfPlayingTrack + 1]) {
                console.log("Playing next  from recents");
                commit('setPlayingTrack', { track: TabsManager.state.tabsData.recentlyPlayedTracks[indexOfPlayingTrack + 1], index: [indexOfPlayingTrack + 1] })
            }
            //when command is playPrevious
            else if (direction == 'prev' && TabsManager.state.tabsData.recentlyPlayedTracks[indexOfPlayingTrack - 1]) {
                console.log("Playing prev  from recents");
                commit('setPlayingTrack', { track: TabsManager.state.tabsData.recentlyPlayedTracks[indexOfPlayingTrack - 1], index: [indexOfPlayingTrack + 1] })
            }
        }
        //When current tab is tracks
        else if (UIController.state.UIProperties.currentMainTab == 'Tracks') {
            const indexOfPlayingTrack = TabsManager.state.tabsData.addedTracks.findIndex((track) => track.defaultTitle == playingTrackInfo.track.defaultTitle)
            //if the command is to playNext and there exists a track after the currently playing one, play it
            if (direction == 'next' && TabsManager.state.tabsData.addedTracks[indexOfPlayingTrack + 1]) {
                console.log("Playing next  from tracks");
                commit('setPlayingTrack', { track: TabsManager.state.tabsData.addedTracks[indexOfPlayingTrack + 1], index: [indexOfPlayingTrack + 1] })
            }
            //when command is playPrevious
            else if (direction == 'prev' && TabsManager.state.tabsData.addedTracks[indexOfPlayingTrack - 1]) {
                console.log("Playing prev  from tracks");
                commit('setPlayingTrack', { track: TabsManager.state.tabsData.addedTracks[indexOfPlayingTrack - 1], index: [indexOfPlayingTrack + 1] })
            }
        }

    }
}
export default {
    state,
    mutations,
    actions
};

