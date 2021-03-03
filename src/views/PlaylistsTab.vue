<template>
	<div class="Playlists">
		<div v-if="!selectedGroup" class="playlistCards">
			<div
				class="playlistCard"
				v-for="playlist in tabsData.playlists"
				:key="playlist.name"
				@click="selectGroup(playlist)"
			>
				<img
					v-if="playlist.tracks.length == 0"
					class="coverArt"
					src="@/assets/images/plImages/purple.png"
					alt=""
				/>
				<img
					v-if="playlist.tracks.length > 0 && playlist.tracks.length < 5"
					class="coverArt"
					src="@/assets/images/plImages/blue.png"
					alt=""
				/>
				<img
					v-if="playlist.tracks.length > 4 && playlist.tracks.length < 8"
					class="coverArt"
					src="@/assets/images/plImages/orange.png"
					alt=""
				/>
				<img
					v-if="playlist.tracks.length > 7"
					class="coverArt"
					src="@/assets/images/plImages/teal.png"
					alt=""
				/>
				<div class="top4">
					<img
						v-if="playlist.tracks[0]"
						:src="playlist.tracks[0].albumArt"
						alt=""
					/>
					<img
						v-if="playlist.tracks[1]"
						:src="playlist.tracks[1].albumArt"
						alt=""
					/>
					<img
						v-if="playlist.tracks[2]"
						:src="playlist.tracks[2].albumArt"
						alt=""
					/>
					<img
						v-if="playlist.tracks[3]"
						:src="playlist.tracks[3].albumArt"
						alt=""
					/>
				</div>
				<h2>{{ playlist.name }}</h2>
			</div>
		</div>
		<transition
			enter-active-class="animated fadeInUp extrafaster"
			leave-active-class="animated fadeOutDown extrafaster"
		>
			<div v-if="selectedGroup" class="selectedGroup">
				<button
					@click="deSelectGroup()"
					class="iconBt backToUnfilteredItems"
					style="margin-top:20px"
				>
					<img src="@/assets/images/back.svg" alt="" />
				</button>
				<div class="sliverBar">
					<img
						class="coverArt"
						src="@/assets/images/plImages/teal.png"
						alt=""
					/>
					<div class="groupedCard_info">
						<p style="margin-bottom:10px" class="groupedInfo_title">
							{{ selectedGroup.name }}
						</p>
					</div>
					<div class="sliverBarArtions">
						<button
							v-if="selectedGroup.name !== 'Favourites'"
							@click="deleteCurrentPlaylist"
							class="btWithIcon dangerBt"
						>
							<img src="@/assets/images/trash-bin-outline.svg" alt="" />
							<p>Delete Playlist</p>
						</button>
						<button @click="addPlaylistToQueue" class="btWithIcon">
							<img src="@/assets/images/queue-music.svg" alt="" />
							<p>Add To Queue</p>
						</button>
					</div>
				</div>
				<div class="cardsWrapper">
					<transition-group leave-active-class="animated slideOutDown fast">
						<TrackCard
							v-for="(track, index) in renderedTracks"
							:key="track.fileLocation"
							:index="index"
							:source="track"
						/>
					</transition-group>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import TrackCard from "@/components/Widgets/TrackCard.vue";

export default {
	data() {
		return {
			card: TrackCard,
		};
	},
	methods: {
		...mapMutations([
			"selectGroup",
			"deSelectGroup",
			"deletePlaylist",
			"addToSelectedTracks",
			"clearSelectedTracks",
			"addSelectedTrackToCustomQueue",
			"switchSidePaneTab",
		]),
		addPlaylistToQueue() {
			this.switchSidePaneTab("CustomQueue");
			this.clearSelectedTracks();
			this.selectedGroup.tracks.forEach((track) => {
				console.log(track);
				this.addToSelectedTracks(track);
			});
			console.log(this.selectedTracks);
			this.addSelectedTrackToCustomQueue();
		},
		deleteCurrentPlaylist() {
			this.deletePlaylist(this.selectedGroup.name);
			this.deSelectGroup();
		},
	},
	computed: {
		...mapState([
			"tabsData",
			"selectedGroup",
			"renderedTracks",
			"selectedTracks",
		]),
	},
	components: {
		TrackCard,
	},
};
</script>

<style lang="scss">
.sliverBar {
	background: linear-gradient(150deg, transparent, rgba(173, 216, 230, 0.171));
}
.playlistCards {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	height: 75vh;
	overflow: hidden;
	overflow-y: scroll;
	.playlistCard {
		cursor: pointer;
		border-radius: 20px;
		position: relative;
		width: 200px;
		height: 200px;
		overflow: hidden;
		.coverArt {
			width: 100%;
		}
		h2 {
			position: absolute;
			width: 100%;
			bottom: 0px;
			left: 0px;
			padding: 5px;
			background: linear-gradient(transparent, rgba(0, 0, 0, 0.61));
		}
		.top4 {
			position: absolute;
			// width: 200px;
			top: 0px;
			left: 0px;
			display: grid;
			grid-template-columns: 1fr 1fr;
			opacity: 0.9;
			img {
				width: 100%;
			}
		}
	}
	.playlistCard:hover {
		.top4 {
			padding: 10px;
			gap: 10px;
			img {
				border-radius: 20px;
			}
		}
	}
}
</style>
