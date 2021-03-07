<template>
	<div class="tab grouperTab">
		<div v-if="tabsData.albums.length == 0" class="loadingArea">
			<div class="loadingIndicator"></div>
		</div>
		<div v-if="!selectedGroup" class="groupCards">
			<div
				v-for="album in tabsData.albums"
				:key="album.name"
				@click="selectGroup(album)"
				class="groupCard"
			>
				<img
					class="coverArt"
					v-if="album.tracks[0].albumArt"
					:src="album.tracks[0].albumArt"
					alt=""
				/>
				<img
					class="coverArt"
					v-if="!album.tracks[0].albumArt"
					src="@/assets/images/FLBDefaultCover.png"
					alt=""
				/>
				<p class="tracksCount">
					{{ album.tracks.length }}
				</p>
				<div class="groupedCard_info">
					<div>
						<p class="groupedInfo_title">
							{{ album.name }}
						</p>
						<p class="groupedInfo_subtitle">{{ album.tracks[0].artist }}</p>
					</div>
				</div>
			</div>
		</div>
		<TrackCard v-if="0" />
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
					<div class="sliverBarActions">
						<button @click="playAll" class="btWithIcon">
							<img src="@/assets/images/playnext.svg" alt="" />
							<p>Play All</p>
						</button>
						<button @click="addTracksToQueue" class="btWithIcon">
							<img src="@/assets/images/queue-music.svg" alt="" />
							<p>Add To Queue</p>
						</button>
					</div>
					<img
						class="coverArt"
						:src="selectedGroup.tracks[0].albumArt"
						alt=""
					/>
					<img id="blurred" :src="selectedGroup.tracks[0].albumArt" alt="" />
					<div class="groupedCard_info">
						<p class="groupedInfo_title">
							{{ selectedGroup.name }}
						</p>
						<p class="artist">{{ selectedGroup.artist }}</p>
					</div>
				</div>
				<div class="cardsWrapper">
					<TrackCard
						v-for="(track, index) in renderedTracks"
						:key="track.path"
						:index="index"
						:source="track"
					/>
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
			"addSelectedTrackToCustomQueue",
			"addToSelectedTracks",
			"switchSidePaneTab",
			"clearSelectedTracks",
			"generateAlbumsData",
			"selectGroup",
			"deSelectGroup",
			"setPlayingTrack",
		]),
		addTracksToQueue() {
			this.switchSidePaneTab("CustomQueue");
			this.clearSelectedTracks();
			this.selectedGroup.tracks.forEach((track) => {
				console.log(track);
				this.addToSelectedTracks(track);
			});
			console.log(this.selectedTracks);
			this.addSelectedTrackToCustomQueue();
		},
		playAll() {
			console.log(this.renderedTracks[0]);
			this.setPlayingTrack(this.renderedTracks[0]);
		},
	},
	computed: {
		...mapState(["tabsData", "selectedGroup", "renderedTracks"]),
	},
	components: {
		TrackCard,
	},
	mounted() {
		this.generateAlbumsData();
	},
};
</script>

<style lang="scss"></style>
