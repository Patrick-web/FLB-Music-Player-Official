<template>
	<div class="Titlebar">
		<div
			title="Select Multiple Tracks"
			@click.stop="toggleMultiSelect"
			:class="[multiSelect ? 'bt_active' : '', 'multiSelect']"
		>
			<img src="@/assets/images/multiselect.svg" alt="" />
		</div>
		<div class="searchBar">
			<input
				@keyup="search(query)"
				v-model="query"
				id="search"
				placeholder="Search"
				class="inputElem"
			/>
			<img @click="query = ''" src="@/assets/images/x.svg" alt v-if="query" />
		</div>
		<SortWidget />
		<div class="searchResults" v-if="query">
			<div class="TracksResults">
				<h3>Tracks</h3>
				<TrackCard
					v-for="track in searchResults.tracks"
					:key="track.fileLocation"
					:source="track"
					:index="0"
				/>
			</div>
			<hr />
			<div class="ArtistResults grouperTab">
				<h3>Artists</h3>
				<div
					v-if="searchResults.artists.length > 0"
					class="groupCards"
					style="height:120px;overflow:hidden"
				>
					<div
						v-for="artist in searchResults.artists"
						:key="artist.name"
						@click="goToArtist(artist)"
						class="groupCard"
					>
						<img
							v-if="artist.picture"
							class="coverArt"
							:src="artist.picture"
							alt=""
						/>
						<img
							v-if="!artist.picture"
							class="coverArt"
							src="@/assets/images/FLBDefaultArtistPic.png"
							alt=""
							style="border-radius:50%"
						/>
						<p class="tracksCount">
							{{ artist.tracks.length }}
						</p>
						<div class="groupedCard_info">
							<p class="groupedInfo_title" style="text-align:center">
								{{ artist.name }}
							</p>
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div class="AlbumResults grouperTab">
				<h3>Albums</h3>
				<div class="groupCards" style="height:130px;overflow:hidden">
					<div
						v-for="album in searchResults.albums"
						:key="album.name"
						@click="goToAlbum(album)"
						class="groupCard"
					>
						<img class="coverArt" :src="album.tracks[0].albumArt" alt="" />
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
			</div>
		</div>
	</div>
</template>

<script>
import TrackCard from "@/components/Widgets/TrackCard.vue";
import { mapMutations, mapState } from "vuex";
import SortWidget from "../Widgets/SortWidget.vue";
export default {
	data() {
		return {
			card: TrackCard,
			query: "",
			multiSelect: false,
		};
	},
	computed: {
		...mapState(["searchResults"]),
	},
	methods: {
		...mapMutations(["search", "selectGroup", "clearSelectedTracks"]),
		goToArtist(artist) {
			document.querySelector("#Artists").click();
			this.selectGroup(artist);
			this.query = "";
		},
		goToAlbum(album) {
			document.querySelector("#Albums").click();
			this.selectGroup(album);
			this.query = "";
		},
		toggleMultiSelect() {
			this.clearSelectedTracks();
			const centralArea = document.querySelector("#centralArea_tabs");
			centralArea.classList.toggle("multiSelectMode");
			const trackOptions = document.querySelector(".trackOptions");
			if (centralArea.classList.contains("multiSelectMode")) {
				trackOptions.style.height = `0px`;
				trackOptions.style.top = `300px`;
				trackOptions.style.left = `600px`;
				setTimeout(() => {
					trackOptions.style.height = `225px`;
				}, 100);
			} else {
				console.log("hidding");
				trackOptions.style.height = `0px`;
				trackOptions.style.top = `-300px`;
				trackOptions.style.left = `0px`;
			}
		},
	},
	components: {
		TrackCard,
		SortWidget,
		// Player,
	},
};
</script>

<style lang="scss">
.searchingState {
	.magnifier {
		pointer-events: none;
		transform: scale(0) !important;
		filter: grayscale(1);
	}
}
.multiSelectMode {
	.multiSelect {
		background: #0062ff !important;
	}
}
.Titlebar {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	position: relative;
	margin-top: 5px;
	margin-bottom: 5px;
	z-index: 21;
	.multiSelect {
		background: rgba(255, 255, 255, 0.083);
		padding: 7px;
		border-radius: 10px;
		cursor: pointer;
	}
	.multiSelect:hover {
		max-width: 200px;
		background: rgba(255, 255, 255, 0.144);
	}
	.searchResults {
		position: absolute;
		bottom: -5px;
		transform: translateY(100%);
		width: 100%;
		padding: 10px;
		max-height: 600px;
		background-color: rgba(0, 0, 0, 0.507);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.315);
		h3 {
			font-family: roboto-thin;
			font-weight: 300;
		}
		hr {
			height: 1px;
			background: rgba(255, 255, 255, 0.377);
			border: none;
			margin-bottom: 5px;
		}
		.groupCard {
			width: 90px;
			img {
				width: 50px;
			}
			.groupedCard_info {
				.groupedInfo_title {
					max-width: 90px;
				}
				.groupedInfo_subtitle {
					max-width: 90px;
				}
			}
		}
	}
}
.searchBar {
	position: relative;
	img {
		width: 12px;
		transform: translateX(-20px);
		cursor: pointer;
		position: relative;
		z-index: 2;
	}
	#search {
		padding: 5px;
		padding-left: 10px;
		font-size: 1rem;
		border-radius: 10px;
		border: 1px solid transparent;
		outline: none;
		background: rgba(255, 255, 255, 0.083);
		color: white;
		width: 250px;
		font-family: roboto-light;
		transition: 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	#search:focus {
		width: 300px;
		background: rgba(255, 255, 255, 0.083);
	}
	#search:focus ~ .magnifier {
		left: 50%;
		transform: scale(0) translateY(0%);
	}

	#search:hover {
		background: rgba(255, 255, 255, 0.144);
		cursor: pointer;
	}
}
.pageNames {
	height: 45px;
	color: white;
	overflow: hidden;
	h1 {
		font-family: roboto-thick;
		font-size: 2.4rem;
	}
}
.tabTitle {
	font-size: 2.4rem;
	font-weight: 800;
	letter-spacing: 2px;
	color: rgb(var(--base-one), var(--base-two), var(--base-three));
}
</style>
