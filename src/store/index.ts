import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import {
	removeDuplicates,
	sendMessageToNode,
	sortArrayOfObjects,
} from "../Utils/frontEndUtils";
import { getSong } from "genius-lyrics-api";
import {
	RootStateType,
	TrackType,
	tabType,
	UIcontrollerPropertiesType,
	ArtistType,
	AlbumType,
	FolderInfoType,
	FolderParsedType,
	PlaylistType,
	SettingsType,
	SettingsPropertiesType,
	geniusSongType,
	NotificationType,
} from "./types";
import { selectCover } from "music-metadata";
import { stat } from "fs";

Vue.use(Vuex);

const store: StoreOptions<RootStateType> = {
	state: {
		tabsData: {
			addedTracks: [],
			recentTracks: [],
			artists: [],
			albums: [],
			playlists: [
				{
					name: "Favourites",
					tracks: [],
				},
			],
			folders: [],
		},
		renderedTracks: [],
		customQueue: [],
		playingTrack: null,
		playingNext: null,
		selectedTracks: [],
		playingTrackLyrics: null,
		bingData: {
			tracks: [],
			artists: [],
			albums: [],
		},
		UIcontroller: {
			showSettings: false,
			showTagEditor: false,
			showPlaylistWidget: false,
		},
		sidePaneActiveTab: "TrackInfo",
		audioState: {
			playing: false,
			repeat: false,
			shuffle: false,
		},
		currentTab: "Tracks",
		searchResults: {
			tracks: [],
			artists: [],
			albums: [],
		},
		selectedGroup: null,
		scannedFolders: [],
		settings: {
			includeVideo: false,
			desktopNotifications: true,
			defaultTab: "Tracks",
			theme: "Fancy",
			accentColor: "accent_blue",
			volume: 1,
		},
		notifications: [],
	},
	mutations: {
		switchTab: (state: RootStateType, payload: tabType) => {
			state.currentTab = payload;
			switch (state.currentTab) {
				case "Tracks":
					state.renderedTracks = state.tabsData.addedTracks;
					break;
				case "Recents":
					console.log(state.tabsData.recentTracks);
					state.renderedTracks = state.tabsData.recentTracks;
					break;
				default:
					break;
			}
			state.renderedTracks.forEach((track) => {
				track.isCurrentlyPlaying = false;
			});
		},
		addToSelectedTracks: (state: RootStateType, payload: TrackType) => {
			const index = state.selectedTracks.findIndex(
				(track) => track.fileLocation == payload.fileLocation
			);
			if (index > -1) {
				state.selectedTracks.splice(index, 1);
			} else {
				state.selectedTracks.unshift(payload);
			}
			console.log(state.selectedTracks.map((track) => track.defaultTitle));
		},
		clearSelectedTracks: (state: RootStateType) => {
			state.selectedTracks = [];
		},
		setPlayingTrack: (state: RootStateType, payload: TrackType) => {
			state.playingTrack = payload;
			state.audioState.playing = true;
			state.renderedTracks.forEach((track) => {
				if (track.isCurrentlyPlaying) {
					track.isCurrentlyPlaying = false;
				}
				if (track.fileLocation == payload.fileLocation) {
					track.isCurrentlyPlaying = true;
				}
			});
			//Logic to add the track to the recents
			if (state.currentTab != "Recents") {
				state.tabsData.recentTracks.unshift(payload);
				if (state.tabsData.recentTracks.length > 20) {
					state.tabsData.recentTracks.pop();
				}
				state.tabsData.recentTracks = removeDuplicates(
					state.tabsData.recentTracks,
					"fileLocation"
				);
			}
			sendMessageToNode("playingTrack", payload);
		},
		addSelectedTrackToCustomQueue(state: RootStateType) {
			state.selectedTracks.forEach((track) => {
				state.customQueue.push(track);
			});
			state.customQueue = removeDuplicates(state.customQueue, "fileLocation");
		},
		removeTrackFromQueue(state: RootStateType, index: number) {
			state.customQueue.splice(index, 1);
		},
		clearCustomQueue(state: RootStateType) {
			state.customQueue = [];
		},
		updateCustomQueue(state: RootStateType, value: Array<TrackType>) {
			state.customQueue = value;
		},
		setSelectedTrackToPlayNext(state: RootStateType) {
			state.customQueue.unshift(state.selectedTracks[0]);
			state.selectedTracks.shift();
		},
		updatePlayingQueue(state: RootStateType, payload: Array<TrackType>) {
			state.renderedTracks = payload;
			state.renderedTracks.forEach((track) => {
				if (track.fileLocation == state.playingTrack?.fileLocation) {
					track.isCurrentlyPlaying = true;
				}
			});
			console.log(state.renderedTracks);
		},
		toggleIsPlaying(state: RootStateType) {
			state.audioState.playing = !state.audioState.playing;
			if (state.audioState.playing) {
				document.querySelector("audio")?.play();
				document.querySelector("video")?.play();
			} else {
				document.querySelector("audio")?.pause();
				document.querySelector("video")?.pause();
			}
		},
		toggleRepeat(state: RootStateType) {
			state.audioState.repeat = !state.audioState.repeat;
			document.querySelector("audio")!.loop = state.audioState.repeat;
		},
		toggleShuffler(state: RootStateType) {
			state.audioState.shuffle = !state.audioState.shuffle;
		},
		addTrack(state: RootStateType, payload: TrackType) {
			const trackAlreadyAdded = state.tabsData.addedTracks.some(
				(track) => track.fileLocation == payload.fileLocation
			);
			if (!trackAlreadyAdded) {
				state.tabsData.addedTracks.unshift(payload);
			}
		},
		restoreTracks(state: RootStateType, payload: Array<TrackType>) {
			state.tabsData.addedTracks = payload;
		},
		restoreRecentlyPlayed(state: RootStateType, payload: Array<TrackType>) {
			state.tabsData.recentTracks = payload;
		},
		search(state: RootStateType, query: string) {
			if (query) {
				state.searchResults.tracks = state.tabsData.addedTracks
					.filter(
						(track) =>
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
					.slice(0, 4);
				state.searchResults.albums = state.tabsData.albums
					.filter((album) =>
						album.name.toLowerCase()?.includes(query.toLocaleLowerCase())
					)
					.slice(0, 5);
				state.searchResults.artists = state.tabsData.artists
					.filter((artist) =>
						artist.name.toLowerCase()?.includes(query.toLocaleLowerCase())
					)
					.slice(0, 5);
				console.log(state.searchResults.albums);
			}
		},
		UIcontrollerToggleProperty: (
			state: RootStateType,
			property: UIcontrollerPropertiesType
		) => {
			state.UIcontroller[property] = !state.UIcontroller[property];
		},
		switchSidePaneTab(state: RootStateType, payload: string) {
			state.sidePaneActiveTab = payload;
		},
		generateArtistsData: (state) => {
			state.tabsData.artists = [];
			const artists = new Set(
				state.tabsData.addedTracks
					.map((track) => track.artist || track.extractedArtist)
					.filter((artist) => artist)
			);
			console.log(artists);
			artists.forEach((artist) => {
				const artistInfo: ArtistType = {
					name: artist,
					picture: null,
					tracks: [],
					albums: [],
				};
				const tracks = state.tabsData.addedTracks.filter(
					(track) => track.artist === artist || track.extractedArtist === artist
				);
				artistInfo.tracks = tracks;
				//TODO: tracks has repeated objects
				const albums = tracks
					.map((track) => track.album)
					.filter((album) => album);
				albums.forEach((album) => {
					const newAlbum: AlbumType = {
						name: album,
						artist: artist,
						tracks: tracks.filter((track) => track.album === album),
					};
					artistInfo.albums.push(newAlbum);
				});
				state.tabsData.artists.unshift(artistInfo);
			});
		},
		deSelectGroup(state: RootStateType) {
			state.selectedGroup = null;
		},
		generateAlbumsData: (state) => {
			state.tabsData.albums = [];
			const albums = new Set(
				state.tabsData.addedTracks
					.map((track) => track.album)
					.filter((album) => album)
			);
			albums.forEach((album) => {
				const albumInfo: AlbumType = {
					name: album,
					artist: "",
					tracks: [],
				};
				const tracks = state.tabsData.addedTracks.filter(
					(track) => track.album === album
				);
				albumInfo.tracks = tracks;
				albumInfo.artist = tracks[0].artist || tracks[0].extractedArtist;
				state.tabsData.albums.unshift(albumInfo);
			});
		},
		selectGroup: (
			state: RootStateType,
			payload: ArtistType | AlbumType | FolderParsedType
		) => {
			state.selectedGroup = payload;
			state.renderedTracks = payload.tracks;
		},
		generateFoldersData: (state: RootStateType) => {
			state.tabsData.folders = [];
			let folders: Array<FolderInfoType> = state.tabsData.addedTracks.map(
				(track) => track.folderInfo
			);
			folders = removeDuplicates(folders, "path");
			folders.forEach((folder) => {
				const folderInfo: FolderParsedType = {
					name: folder.name,
					path: folder.path,
					tracks: [],
				};
				const tracks = state.tabsData.addedTracks.filter(
					(track) => track.folderInfo.path === folder.path
				);
				folderInfo.tracks = tracks;
				state.tabsData.folders.unshift(folderInfo);
			});
		},
		restorePlaylists(state: RootStateType, payload: Array<PlaylistType>) {
			state.tabsData.playlists = payload;
		},
		createPlaylist(state: RootStateType, payload: string) {
			const newPlaylist: PlaylistType = {
				name: payload,
				tracks: [],
			};
			state.tabsData.playlists.push(newPlaylist);
			sendMessageToNode("updatePlaylists", state.tabsData.playlists);
		},
		deletePlaylist(state: RootStateType, payload: string) {
			state.tabsData.playlists.forEach((playlist, pindex) => {
				if (playlist.name === payload) {
					state.tabsData.playlists.splice(pindex, 1);
				}
			});
			sendMessageToNode("updatePlaylists", state.tabsData.playlists);
		},
		addSelectedTrackToPlaylist(state: RootStateType, payload: string) {
			state.tabsData.playlists.forEach((playlist, index) => {
				if (playlist.name === payload) {
					state.selectedTracks.forEach((track) => {
						state.tabsData.playlists[index].tracks.push(track);
						state.tabsData.playlists[index].tracks = removeDuplicates(
							state.tabsData.playlists[index].tracks,
							"fileLocation"
						);
					});
				}
			});
			console.log(state.tabsData.playlists);
			sendMessageToNode("updatePlaylists", state.tabsData.playlists);
		},
		renameCurrentPlaylist(state: RootStateType, payload: string) {
			state.tabsData.playlists.forEach((playlist) => {
				if (playlist.name === state.selectedGroup?.name) {
					playlist.name = payload;
					state.selectedGroup.name = payload;
				}
			});
			sendMessageToNode("updatePlaylists", state.tabsData.playlists);
		},
		deleteSelectedTrackToPlaylist(state: RootStateType) {
			state.tabsData.playlists.forEach((playlist, pindex) => {
				if (playlist.name === state.selectedGroup?.name) {
					playlist.tracks.forEach((track, tindex) => {
						state.selectedTracks.forEach((selectedTrack) => {
							if (selectedTrack.fileLocation === track.fileLocation) {
								state.tabsData.playlists[pindex].tracks.splice(tindex, 1);
							}
						});
					});
				}
			});
			sendMessageToNode("updatePlaylists", state.tabsData.playlists);
		},
		deleteSelectedTrackToFavourites(state: RootStateType) {
			console.log(state.selectedTracks[0]);
			state.tabsData.playlists[0].tracks.forEach((track, index) => {
				if (state.selectedTracks[0].fileLocation === track.fileLocation) {
					state.tabsData.playlists[0].tracks.splice(index, 1);
				}
			});
		},
		setScannedFolders(state: RootStateType, payload: Array<FolderInfoType>) {
			state.scannedFolders = payload;
		},
		updateSetting(state: RootStateType, [property, value]) {
			state.settings[property] = value;
			console.log(property, value);
			sendMessageToNode("updateSettings", state.settings);
		},
		restoreSettings(state: RootStateType, payload: SettingsType) {
			state.settings = payload;
		},
	},
	actions: {
		playFirstTrack() {
			this.commit("setPlayingTrack", this.state.tabsData.addedTracks[0]);
		},
		determineNextTrack({ commit, dispatch, state }, direction: string) {
			if (document.querySelector("audio")) {
				document.querySelector("audio")!.muted = false;
			}
			if (state.audioState.repeat) {
				return;
			}
			if (state.customQueue.length > 0) {
				state.playingTrack = state.customQueue[0];
				state.customQueue.shift();
				state.renderedTracks.forEach((track, index) => {
					if (track.isCurrentlyPlaying) track.isCurrentlyPlaying = false;
				});
				return;
			}
			console.log("Determining next track");
			let currentlyPlayingIndex = 0;
			let nextTrack;
			state.renderedTracks.forEach((track, index) => {
				if (track.isCurrentlyPlaying) {
					currentlyPlayingIndex = index;
					return;
				}
			});
			if (state.audioState.shuffle) {
				const randomIndex = Math.ceil(
					Math.random() * state.renderedTracks.length
				);
				commit("setPlayingTrack", state.renderedTracks[randomIndex]);
				return;
			}
			if (direction == "next") {
				console.log(state.renderedTracks[currentlyPlayingIndex + 1]);
				if (state.renderedTracks[currentlyPlayingIndex + 1]) {
					nextTrack = state.renderedTracks[currentlyPlayingIndex + 1];
				} else {
					nextTrack = state.renderedTracks[0];
				}
			} else {
				if (state.renderedTracks[currentlyPlayingIndex - 1]) {
					nextTrack = state.renderedTracks[currentlyPlayingIndex - 1];
				} else {
					nextTrack = state.renderedTracks[currentlyPlayingIndex + 1];
				}
			}
			state.renderedTracks[currentlyPlayingIndex].isCurrentlyPlaying = false;
			state.renderedTracks[currentlyPlayingIndex + 1].isCurrentlyPlaying = true;
			commit("setPlayingTrack", nextTrack);
			dispatch("getLyrics", nextTrack);
		},
		findAndGoToArtist({ commit, state }, payload: string) {
			state.tabsData.artists.forEach((artist) => {
				if (payload === artist.name) {
					commit("selectGroup", artist);
				}
			});
		},
		sortTracks({ commit, state }, payload: string) {
			sortArrayOfObjects(state.tabsData.addedTracks, payload);
			sortArrayOfObjects(state.renderedTracks, payload);
		},
		toggleSortMode({ state }) {
			console.log("Reversing");
			state.renderedTracks.reverse();
			state.tabsData.addedTracks.reverse();
		},
		removeSelectedTracks({ commit, state }) {
			state.selectedTracks.forEach((track) => {
				const index1 = state.tabsData.addedTracks.findIndex(
					(trackk) => trackk.fileLocation == track.fileLocation
				);
				const index2 = state.renderedTracks.findIndex(
					(trackk) => trackk.fileLocation == track.fileLocation
				);
				state.tabsData.addedTracks.splice(index1, 1);
				state.renderedTracks.splice(index2, 1);
			});
			state.selectedTracks = [];
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
					state.playingTrackLyrics = song.lyrics.split(/\s\s/);
					console.log(state.playingTrackLyrics);
					const lyricsTabIcon: HTMLElement = document.getElementsByClassName(
						"lyricsTabIcon"
					)[0] as HTMLElement;
					lyricsTabIcon.click();
				}
			});
		},
		pushNotification({ state }, payload: NotificationType) {
			state.notifications.unshift(payload);
		},
		popNotification({ state }) {
			state.notifications.pop();
		},
	},
	getters: {
		allTracks: (state: RootStateType) => state.tabsData.addedTracks,
	},
	modules: {},
};

export default new Vuex.Store(store);
