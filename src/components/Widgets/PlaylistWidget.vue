<template>
	<div id="PlaylistWidget">
		<p
			class="modalClose"
			@click="UIcontrollerToggleProperty('showPlaylistWidget')"
		>
			<img src="@/assets/images/x.svg" alt="" />
		</p>
		<h2 style="text-align:center">Select Playlist</h2>
		<div class="newPlaylistForm">
			<input
				class="inputElem"
				placeholder="Create new playlist"
				type="text"
				v-model="newPlaylistName"
			/>
			<button @click="createNewPlaylist()" v-if="newPlaylistName">
				Create
			</button>
		</div>
		<br />
		<p
			@click="addToPlaylist(playlist.name)"
			v-for="playlist in tabsData.playlists"
			:key="playlist.name"
			class="playlistName"
		>
			{{ playlist.name }}
		</p>
	</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
	data() {
		return {
			newPlaylistName: "",
		};
	},
	computed: {
		...mapState(["tabsData"]),
	},
	methods: {
		...mapMutations([
			"createPlaylist",
			"addSelectedTrackToPlaylist",
			"UIcontrollerToggleProperty",
		]),
		createNewPlaylist() {
			this.createPlaylist(this.newPlaylistName);
			this.newPlaylistName = "";
		},
		addToPlaylist(playlistName) {
			this.addSelectedTrackToPlaylist(playlistName);
			this.UIcontrollerToggleProperty("showPlaylistWidget");
			// const noti = this.$vs.notify({
			//   color: "success",
			//   position: "top-center",
			//   title: `Added to ${playlistName} playlist`,
			// });
		},
	},
};
</script>

<style lang="scss">
#PlaylistWidget {
	position: fixed;
	top: 700px;
	min-width: 250px;
	max-width: 250px;
	z-index: 60;
	background-color: rgba(0, 0, 0, 0.39);
	backdrop-filter: blur(10px);
	box-shadow: 0px 0px 50px 10px black;
	padding: 10px;
	border-radius: 20px;
	transition: none;
}
.newPlaylistForm {
	margin-top: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}
.playlistName {
	background: #11111150;
	border-bottom: 0.5px solid rgba(255, 255, 255, 0.226);
	padding: 5px;
	font-size: 1.2em;
	transition: 0.2s ease;
	cursor: pointer;
	text-align: left;
}
.playlistName:hover {
	background-color: #ffffff1e;
	border-radius: 20px;
	margin: 5px;
	border: none;
	padding: 8px;
}
</style>
