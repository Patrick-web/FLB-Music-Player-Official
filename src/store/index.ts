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
import {
	sortArrayOfObjects,
} from "@/Utils/SharedUtilityFunctions";
import {
	TrackType,
} from "./types";

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
			console.log("Reversing");
			state.renderedTracks.reverse();
			state.tabsData.addedTracks.reverse();
		},
		removeSelectedTracksFromAppState({ commit, state }) {
			state.selectedTracks.forEach((selectedTrack: TrackType) => {
				state.tabsData.addedTracks.filter((track: TrackType) => track.fileLocation == selectedTrack.fileLocation)
				state.tabsData.recentTracks.filter((track: TrackType) => track.fileLocation == selectedTrack.fileLocation)
			});
			state.selectedTracks = [];
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
	},
};

export default new Vuex.Store(store);
