<template>
	<div class="playingPane animated faster">
		<img
			@click="expandPlayingPane"
			id="expandPlayingPane"
			src="@/assets/images/arrowDown.svg"
			alt=""
		/>
		<div
			v-if="!playingTrack.fileName.match(/mp4|mkv/)"
			class="audioImageResolver"
		>
			<img
				v-if="!playingTrack.albumArt"
				src="@/assets/images/FLBDefaultCover.png"
				alt=""
				id="blurred"
			/>
			<img
				v-if="playingTrack.albumArt"
				:src="playingTrack.albumArt"
				alt=""
				id="blurred"
			/>

			<img
				v-if="playingTrack.albumArt"
				@dblclick="toggleFromFavourites"
				@click="expandPlayingPane"
				id="cover"
				:src="playingTrack.albumArt"
				alt=""
			/>
			<img
				v-if="!playingTrack.albumArt"
				@dblclick="toggleFromFavourites"
				@click="expandPlayingPane"
				id="cover"
				src="@/assets/images/FLBDefaultCover.png"
				alt=""
			/>
		</div>
		<div v-if="playingTrack.fileName.match(/mp4|mkv/)" class="video_resolver">
			<video
				autoplay
				controls
				muted="true"
				:src="playingTrack.fileLocation"
			></video>
		</div>
		<div @click="toggleIsPlaying" id="pauseBt" class="iconsWrapper">
			<img
				v-if="!audioState.playing"
				class="toggleIcons playIcon"
				src="@/assets/images/playButton.svg"
				alt
			/>
			<img
				v-if="audioState.playing"
				class="toggleIcons pauseIcon"
				src="@/assets/images/pause.svg"
				alt
			/>
		</div>
		<div class="trackData">
			<div class="trackInfo">
				<p id="trackName">
					{{ playingTrack.defaultTitle }}
				</p>
				<p @click="goToArtist(playingTrack.defaultArtist)" id="artistName">
					{{ playingTrack.defaultArtist }}
				</p>
			</div>
			<TrackBar />
		</div>

		<div class="controls">
			<div class="volumeRockerArea">
				<img src="@/assets/images/volume_down.svg" alt="" />
				<input
					id="volume"
					@change="adjustVolume"
					v-model="volume"
					type="range"
					min="0"
					max="1"
					step="0.1"
					name=""
				/>
			</div>
			<div class="control play_controls">
				<button
					@click="determineNextTrack('prev')"
					id="prevTrackBt"
					class="iconBt"
				>
					<img
						style="transform:rotate(-180deg)"
						src="@/assets/images/play_arrow.svg"
						alt=""
					/>
				</button>
				<button @click="toggleFromFavourites" id="favorIcon" class="iconBt">
					<img width="18px" src="@/assets/images/heart.svg" alt="" />
				</button>
				<button
					id="nextTrackBt"
					@click="determineNextTrack('next')"
					class="iconBt"
				>
					<img src="@/assets/images/play_arrow.svg" alt="" />
				</button>
			</div>
			<div class="control extra_controls">
				<button @click="showPlaylistAdder" id="playlistBt" class="iconBt">
					<img id="plIcon" src="@/assets/images/playlist_add.svg" alt="" />
				</button>
				<button
					@click="toggleRepeat"
					:class="[audioState.repeat ? 'bt_active' : '', 'iconBt']"
					id="repeatIcon"
					title="repeat"
				>
					<img id="plIcon" src="@/assets/images/repeat_one.svg" alt="" />
				</button>
				<button
					@click="toggleShuffler"
					id="shuffleIcon"
					:class="[audioState.shuffle ? 'bt_active' : '', 'iconBt']"
				>
					<img src="@/assets/images/shuffle.svg" alt="" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import TrackBar from "@/components/TrackBar.vue";
import { mapActions, mapMutations, mapState } from "vuex";
// import particleBg from "@/components/particleBg.vue";

export default {
	computed: {
		...mapState([
			"playingTrack",
			"audioState",
			"tabsData",
			"UIcontroller",
			"settings",
		]),
	},
	data() {
		return {
			elements: ["songName", "artistName", "albumName"],
			repeat: false,
			shuffle: false,
			possibleThumbnails: [],
			selectedCover: "",
			volume: 1,
			isOnline: false,
			visualsOffDueToBlur: false,
		};
	},
	methods: {
		...mapActions(["determineNextTrack", "findAndGoToArtist"]),
		...mapMutations([
			"addToFavorites",
			"removeFromFavorites",
			"addToSelectedTracks",
			"addSelectedTrackToPlaylist",
			"removeSelectedTrackFromPlaylist",
			"toggleRepeat",
			"toggleShuffler",
			"toggleIsPlaying",
			"UIcontrollerToggleProperty",
			"updateSetting",
		]),
		expandPlayingPane() {
			const pane = document.querySelector(".playingPane");
			const audio = document.querySelector("audio");
			const video = document.querySelector("video");
			if (this.playingTrack.fileName.match(/mp4|mkv/)) {
				audio.muted = true;
				video.muted = false;
				video.requestFullscreen();
				audio.currentTime = video.currentTime;
			} else {
				pane.classList.toggle("fullScreenPlayingPane");
			}
		},
		adjustVolume() {
			document.querySelector("audio").volume = this.volume;
			this.updateSetting(["volume", this.volume]);
		},
		goToArtist() {
			document.querySelector("#Artists").click();
			this.findAndGoToArtist(
				this.playingTrack.artist || this.playingTrack.extractedArtist
			);
		},
		showPlaylistAdder() {
			this.addToSelectedTracks(this.playingTrack);
			if (!this.UIcontroller.showPlaylistWidget) {
				this.UIcontrollerToggleProperty("showPlaylistWidget");
			}
			setTimeout(() => {
				const playlistWidget = document.querySelector("#PlaylistWidget");
				playlistWidget.style.bottom = "100px";
				document.querySelector("#PlaylistWidget").style.top = "initial";
				document.querySelector("#PlaylistWidget").style.left = "78%";
			}, 0);
		},
		toggleFromFavourites() {
			this.addToSelectedTracks(this.playingTrack);
			if (
				document.querySelector(".playingPane").classList.contains("favored")
			) {
				// const noti = this.$vs.notify({
				//   color: "danger",
				//   position: "top-center",
				//   title: "Removed from Favourites",
				//   text: `${this.playingTrack.title} removed from Favourites`,
				// });
				this.removeSelectedTrackFromPlaylist("Favourites");
				document.querySelector(".playingPane").classList.remove("favored");
			} else {
				this.addSelectedTrackToPlaylist("Favourites");
				// const noti = this.$vs.notify({
				//   color: "success",
				//   position: "top-center",
				//   title: "Added to Favourites",
				//   text: `${this.playingTrack.title} added to Favourites`,
				// });
				document.querySelector(".playingPane").classList.add("favored");
			}
		},
	},
	mounted() {
		this.volume = this.settings.volume;
		this.adjustVolume();
		window.addEventListener("keydown", (e) => {
			if (!document.activeElement.classList.contains("inputElem")) {
				if (e.code === "Space") {
					e.preventDefault();
					document.querySelector("#pauseBt img").click();
					return;
				}
				if (e.code === "ArrowLeft") {
					document.querySelector("#prevTrackBt").click();
					return;
				}
				if (e.code === "ArrowRight") {
					document.querySelector("#nextTrackBt").click();
					return;
				}
				if (e.code === "ArrowDown" || e.code === "ArrowUp") {
					document.querySelector("#volume").focus();
					return;
				}
			}
		});
	},
	components: {
		TrackBar,
		// particleBg,
	},
};
</script>

<style lang="scss">
.fullScreenPlayingPane {
	height: 96vh !important;
	left: 0;
	width: 100vw;
	z-index: 60 !important;
	#expandPlayingPane {
		position: fixed;
		left: 50%;
		top: 40px;
		transform: rotate(180deg);
		z-index: 5;
	}
	#cover {
		transform: translateX(130%) translateY(-35%);
		max-width: 400px !important;
		width: 380px;
		min-width: 200px !important;
		max-height: 800px !important;
	}
	#cover:hover {
		transform: translateX(130%) translateY(-35%);
	}
	#blurred {
		height: 100vh !important;
		top: 0% !important;
	}
	#trackName {
		position: absolute;
		bottom: 200px;
		left: 20px;
		font-size: 6rem;
		font-family: roboto-thick;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 99%;
	}
	#artistName {
		position: absolute;
		bottom: 120px;
		left: 25px;
		font-size: 3em;
	}
	#pauseBt {
		position: absolute;
		bottom: 50px;
		left: 50%;
		img {
			width: 50px;
		}
	}
	.volumeRockerArea {
		display: none !important;
	}
	.controls {
		transform: translate(80%, 350%);
		#playlistBt {
			display: none;
		}
		button {
			transform: scale(1.3);
			margin: 20px;
			margin-bottom: 10px;
			margin-top: 10px;
		}
		.play_controls {
			border: none;
		}
	}
	.TrackBar {
		position: absolute;
		bottom: 0px;
		left: 20px;
		width: 98%;
		.seekBar {
			background: rgba(255, 255, 255, 0.082);
			border-radius: 0;
			height: 4px;
			.seekProgress {
				background: white;
				border-radius: 0;
			}
		}
		.seekBar:hover {
			height: 8px;
		}
	}
}
.favored {
	#favorIcon {
		cursor: pointer;
		background: rgb(255, 255, 255);
		img {
			filter: invert(100%);
		}
	}
}
.playingPane {
	position: fixed;
	left: 0;
	bottom: 0;
	height: 100px;
	width: 100vw;
	z-index: 20;
	background: black;
	display: grid;
	gap: 10px;
	grid-template-columns: 0.5fr 0.1fr 4fr 2fr;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
	#cover {
		max-width: 150px;
		max-height: 90px;
		margin: auto;
		margin-left: 10px;
		align-self: center;
		cursor: pointer;
	}
	#cover:hover {
		border-radius: 20px;
	}
	.video_resolver {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 150px;
		margin-left: 10px;
		background: black;
		video {
			width: 98%;
			cursor: pointer;
		}
	}
	.trackInfo {
		display: flex;
		justify-content: space-between;
		#artistName {
			font-family: roboto-thin;
		}
		#artistName:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	}

	#blurred {
		position: absolute;
		top: -20px;
		left: 0;
		width: 100%;
		height: 120%;
		filter: blur(100px);
		opacity: 1;
		z-index: -1;
		pointer-events: none;
	}
	.bordered {
		border: 2px solid white;
		border-radius: 15px;
		border-bottom-right-radius: 0px;
		padding: 5px;
	}
}
.controls {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	button {
		margin-left: 5px;
		margin-right: 5px;
	}
	.control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		transition: 0.2s ease;
	}
	.play_controls {
		border-right: 1px solid white;
	}
	.volumeRockerArea {
		position: absolute;
		left: 35px;
		bottom: -2px;
		width: 200px;
		transform: translate(0, 95%);
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		input {
			width: 65%;
			height: 2px;
			cursor: pointer;
			filter: grayscale(0.9);
		}
	}
	.volumeRockerArea:hover {
		input {
			opacity: 1;
		}
	}
}
#expandPlayingPane {
	position: absolute;
	top: 8px;
	left: 97%;
	width: 20px;
	cursor: pointer;
}
.noMusicPlaying {
	position: absolute;
	z-index: 4;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: black;
}
// @media (max-width: 700px) {
//   .playingPane {
//     #cover {
//       width: 100px;
//     }
//   }
//   .volumeRockerArea {
//     display: none;
//   }
//   .editModeBtns {
//     display: none;
//   }
//   .control extra_controls {
//     display: none !important;
//   }
//   #CoverSearcher {
//     display: none;
//   }
// }
</style>
