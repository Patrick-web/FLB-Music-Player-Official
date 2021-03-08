<template>
	<div @click="close" class="trackOptions">
		<div @click.stop="playNext" class="option hideOnMultiSelectMode">
			<img src="@/assets/images/playnext.svg" alt="" />
			<span>Play Next</span>
		</div>
		<div @click.stop="queueTrack" class="option">
			<img src="@/assets/images/queue-music.svg" alt="" />
			<span>Add to Queue</span>
		</div>
		<div @click.stop="addToFavourites" class="option">
			<img src="@/assets/images/heart.svg" alt="" />
			<span>Add to Favourites</span>
		</div>
		<div
			v-if="currentTab !== 'Playlists'"
			@click.stop="showPlaylistWidget"
			class="option"
		>
			<img src="@/assets/images/list-circle-outline.png" alt="" />
			<span>Add to Playlist</span>
		</div>
		<div
			v-if="currentTab === 'Playlists'"
			@click.stop="removeFromPlaylist"
			class="option"
		>
			<img src="@/assets/images/cancel.svg" alt="" />
			<span>Remove from Playlist</span>
		</div>
		<div @click.stop="deleteSelectedTracks" class="option">
			<img src="@/assets/images/trash-bin-outline.svg" alt="" />
			<span>Delete Permanently</span>
		</div>
		<div @click.stop="showTagEditor" class="option hideOnMultiSelectMode">
			<img src="@/assets/images/edit.svg" alt="" />
			<span>Edit Tags</span>
		</div>
	</div>
</template>

<script>
import { sendMessageToNode } from "@/Utils/frontEndUtils";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
	computed: {
		...mapState([
			"selectedTracks",
			"UIcontroller",
			"currentTab",
			"selectedGroup",
		]),
	},
	methods: {
		...mapMutations([
			"addSelectedTrackToPlaylist",
			"deleteSelectedTrackToPlaylist",
			"UIcontrollerToggleProperty",
			"addToCustomQueue",
			"addSelectedTrackToCustomQueue",
			"setSelectedTrackToPlayNext",
			"switchSidePaneTab",
			"clearSelectedTracks",
		]),
		...mapActions(["pushNotification"]),
		queueTrack() {
			this.addSelectedTrackToCustomQueue();
			this.switchSidePaneTab("CustomQueue");
			this.pushNotification({
				title: "Track(s) added to queue",
				subTitle: null,
				type: "normal",
			});
			this.close();
		},
		playNext() {
			this.setSelectedTrackToPlayNext();
			this.close();
			this.pushNotification({
				title: `Playing that track Next`,
				subTitle: null,
				type: "normal",
			});
		},
		close() {
			document.querySelector(".trackOptions").style.height = `0px`;
		},
		showPlaylistWidget() {
			if (!this.UIcontroller.showPlaylistWidget) {
				this.UIcontrollerToggleProperty("showPlaylistWidget");
			}
			const optionsWidget = document.querySelector(".trackOptions");
			const cordinates = {
				x: parseInt(
					window.getComputedStyle(optionsWidget).left.replace("px", "")
				),
				y: parseInt(
					window.getComputedStyle(optionsWidget).top.replace("px", "")
				),
			};
			setTimeout(() => {
				console.log(cordinates);
				const playlistWidget = document.querySelector("#PlaylistWidget");
				playlistWidget.style.bottom = "initial";
				document.querySelector("#PlaylistWidget").style.top =
					cordinates.y + "px";
				document.querySelector("#PlaylistWidget").style.left =
					cordinates.x + 250 + "px";
			}, 0);
		},
		removeFromPlaylist() {
			console.log(this.selectedTracks);
			this.deleteSelectedTrackToPlaylist();
			this.close();
			this.pushNotification({
				title: `Removed from Favourites ${this.selectedGroup.name}`,
				subTitle: `${this.selectedTracks[0].defaultTitle}`,
				type: "danger",
			});
		},
		addToFavourites() {
			this.addSelectedTrackToPlaylist("Favourites");
			this.pushNotification({
				title: `Added to Favourites`,
				subTitle: `${this.selectedTracks[0].defaultTitle}`,
				type: "normal",
			});
			this.close();
		},
		showTagEditor() {
			this.UIcontrollerToggleProperty("showTagEditor");
			this.$emit("targetTrack", this.selectedTracks[0]);
			this.close();
		},
		deleteSelectedTracks() {
			console.log("Deleting");
			sendMessageToNode("deleteFiles", this.selectedTracks);
			this.close();
		},
	},
	// mounted() {},
};
</script>

<style lang="scss">
.multiSelectMode {
	.trackOptions {
		height: 150px !important;
		.hideOnMultiSelectMode {
			display: none !important;
		}
	}
}
.trackOptions {
	position: fixed;
	top: -250px;
	z-index: 80;
	left: 10px;
	border-radius: 20px;
	width: 220px;
	background-color: #00000038;
	backdrop-filter: blur(10px);
	overflow: hidden;
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.597) !important;
	transition: 0.2s ease;
	.option {
		padding: 8px;
		padding-left: 10px;
		font-family: roboto-thin;
		cursor: pointer;
		display: grid;
		grid-template-columns: 1fr 5fr;
		transition: 0.2s ease;
		img {
			width: 20px;
		}
	}
	.option:hover {
		background-color: #ffffff1e;
		border-radius: 20px;
		margin: 5px;
	}
}
</style>
