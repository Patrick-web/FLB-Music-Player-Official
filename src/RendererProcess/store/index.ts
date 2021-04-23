import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import NotificationManager from "./modules/LocalMusic/NotificationManager";
import PlaybackManger from "./modules/LocalMusic/PlaybackManger";
import SearchManager from "./modules/LocalMusic/SearchManager";
import SettingsManager from "./modules/LocalMusic/SettingsManager";
import StatsManager from "./modules/LocalMusic/StatsManager";
import TabsManager from "./modules/LocalMusic/TabsManager";
import TrackSelector from "./modules/LocalMusic/TrackSelector";
import UIController from "./modules/LocalMusic/UIController";
import BingDownloadManager from "./modules/FLBing/BingDownloadManager";

import { TrackType } from "@/types";
import { sortArrayOfObjects } from "@/sharedUtilities";


Vue.use(Vuex);

const store: StoreOptions<any> = {
	state: {
		renderedTracks: [],
	},
	mutations: {

	},
	actions: {
		sortTracks({ commit, state }, payload: string) {
			sortArrayOfObjects(TabsManager.state.tabsData.addedTracks, payload);
		},
		toggleSortMode({ state }) {
			TabsManager.state.tabsData.addedTracks.reverse();
		},
		removeSelectedTracksFromAppState({ commit, state }) {
			TrackSelector.state.selectedTracks.forEach((selectedTrack: TrackType) => {
				state.tabsData.addedTracks.filter((track: TrackType) => track.fileLocation == selectedTrack.fileLocation)
				state.tabsData.recentTracks.filter((track: TrackType) => track.fileLocation == selectedTrack.fileLocation)
			});
			TrackSelector.state.selectedTracks = [];
		},
	},
	modules: {
		NotificationManager,
		PlaybackManger,
		SearchManager,
		SettingsManager,
		StatsManager,
		TabsManager,
		TrackSelector,
		UIController,
		BingDownloadManager
	},
};

export default new Vuex.Store(store);
