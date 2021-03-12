<template>
	<div
		@contextmenu="showOptions($event)"
		:id="index"
		@click="playTrack"
		:class="[source.isCurrentlyPlaying ? 'playingTrack' : '', 'TrackCard']"
	>
		<div @click.stop="bulkSelectTrack($event)" class="fxSelectBt"></div>
		<div class="info">
			<img v-if="source.albumArt" class="cover" :src="source.albumArt" alt="" />
			<img
				v-if="!source.albumArt && !source.fileName.match(/mp4|mkv/)"
				class="cover"
				src="@/assets/images/FLBDefaultCover.png"
				alt=""
			/>
			<img
				v-if="source.fileName.match(/mp4|mkv/)"
				class="cover"
				src="@/assets/images/video.svg"
				alt=""
			/>
			<p class="trackTitle">
				{{ source.defaultTitle }}
			</p>
			<div class="grid">
				<p class="artist">{{ source.defaultArtist }}</p>
				<p class="album">{{ source.album }}</p>
				<p class="duration">
					{{ source.formattedLength }}
				</p>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapActions, mapMutations, mapState } from "vuex";

	export default {
		computed: {
			...mapState(["queuedTracks", "UIcontroller", "selectedTrack"]),
		},
		data() {
			return {
				track: null,
			};
		},
		methods: {
			...mapMutations([
				"setPlayingTrack",
				"addToQueue",
				"addToSelectedTracks",
				"addSelectedTrackToPlaylist",
				"removeSelectedTrackToPlaylist",
				"removeFromQueue",
				"addToSelectedTracks",
				"UIcontrollerToggleProperty",
				"clearSelectedTracks",
			]),
			...mapActions(["getLyrics"]),
			showOptions(e) {
				e.preventDefault();
				document
					.querySelector("#centralArea_tabs")
					.classList.remove("multiSelectMode");
				const cordinates = {
					x: e.clientX + 5,
					y: e.clientY,
				};
				if (cordinates.y > 500) cordinates.y = 500;
				const trackOptions = document.querySelector(".trackOptions");
				trackOptions.style.height = `0px`;
				trackOptions.style.top = `${cordinates.y}px`;
				trackOptions.style.left = `${cordinates.x}px`;
				setTimeout(() => {
					trackOptions.style.height = `225px`;
				}, 100);
				this.clearSelectedTracks();
				this.addToSelectedTracks(this.source);
			},
			playTrack(e) {
				document.querySelector("#search").value = "";
				if (document.querySelector("audio")) {
					document.querySelector("audio").muted = false;
				}
				//Remount Tag Editor
				if (this.UIcontroller.showTagEditor) {
					this.UIcontrollerToggleProperty("showTagEditor");
					setTimeout(() => {
						this.UIcontrollerToggleProperty("showTagEditor");
					}, 100);
				}
				const track = e.currentTarget;
				track.classList.add("playingTrack");
				this.setPlayingTrack(this.source);
				this.getLyrics(this.source);
				// electron.ipcRenderer.send("fetchLyrics", [
				//   this.track.title,
				//   this.track.artist,
				// ]);
			},
			setEditModeValues() {
				if (document.querySelector("#titleTag")) {
					document.querySelector("#titleTag").textContent = this.title;
					document.querySelector("#artistTag").textContent = this.artist;
					document.querySelector("#albumTag").textContent = this.album;
					document.querySelector("#coverArtTag").src = this.cover;
				}
			},
			queueTrack(e) {
				document.querySelector(".queueTabIcon").click();
				const track = e.currentTarget.parentElement.parentElement;
				this.addToQueue(this.selectedTrack);
				// const n2 = this.$vs.notify({
				//   color: "success",
				//   position: "top-center",
				//   title: "Added to Queue",
				//   text: `${this.source.title}`,
				// });
				track.classList.add("queued");
				this.hideOptions(track);
			},
			hideOptions(currentElement) {
				currentElement.classList.remove("showOptions");
			},
			bulkSelectTrack(e) {
				e.currentTarget.parentElement.classList.toggle("bulkSelected");
				this.addToSelectedTracks(this.source);
			},
		},
		props: {
			// track: Object,
			// trackIndex: Number,
			// playlistIndex: Number,
			index: {
				// index of current item
				type: Number,
			},
			source: {
				type: Object,
				default() {
					return {};
				},
			},
		},
	};
</script>

<style lang="scss">
	.multiSelectMode {
		.TrackCard {
			margin-left: 30px;
			.fxSelectBt {
				opacity: 1;
			}
		}
		.TrackCard:hover {
			cursor: default;
			.cover {
				transform: scale(0.9) translate(0px, 0px);
				box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.712);
			}
			.fxSelectBt {
				border: 2px solid#ffffff;
				cursor: pointer;
			}
		}
	}
	.bulkSelected {
		.fxSelectBt {
			border: 1px solid#ffffff !important;
			background: var(--accentColor) !important;
		}
	}
	.playingTrack {
		background: linear-gradient(
			90deg,
			var(--accentColor),
			var(--accentColorLight)
		) !important;
		position: relative;
		border: none !important;
		font-weight: 600;
	}

	.TrackCard {
		position: relative;
		// background: rgba(255, 255, 255, 0.083);
		border-bottom: 1px solid rgba(255, 255, 255, 0.356);
		color: white;
		cursor: pointer;
		padding-left: 0px;
		transition: 0.2s ease;
		.fxSelectBt {
			position: absolute;
			top: 50%;
			left: -28px;
			transform: translateY(-50%);
			z-index: 4;
			background: rgba(0, 0, 0, 0.466);
			border: 1px solid rgba(255, 255, 255, 0.452);
			width: 20px;
			height: 20px;
			opacity: 0;
		}
		.cover {
			width: 35px;
			transition: 0.2s ease;
			justify-self: center;
			align-self: center;
		}
		p {
			font-size: 0.95rem;
			font-family: roboto-thin;
		}
		.info {
			padding: 5px;
			width: 100%;
			display: grid;
			grid-template-columns: 0.1fr 1fr 2fr;
			gap: 10px;
			align-items: center;
		}
		.info_video {
			display: flex;
			align-items: center;
			img {
				margin-right: 5px;
				margin-left: 5px;
			}
		}
		.grid {
			align-items: center;
			display: grid;
			grid-template-columns: 1.5fr 2fr 0.65fr;
			gap: 10px;
			font-size: 1em;
		}
		.delIcon {
			position: absolute;
			top: 50%;
			right: 0;
			background: crimson;
			width: 30px;
			padding: 5px;
			transform-origin: center;
			transform: translateX(50%) translateY(-50%) scale(0);
			border-radius: 50%;
			transition: 0.4s ease;
			cursor: pointer;
			z-index: 4;
			display: none;
		}
		.delIcon:hover {
			transform: translateX(50%) translateY(-50%) scale(1.2) !important;
		}
		.unQueueIcon {
			position: absolute;
			top: 50%;
			right: 0;
			background: crimson;
			width: 30px;
			padding: 5px;
			transform-origin: center;
			transform: translateX(50%) translateY(-50%) scale(0);
			border-radius: 50%;
			transition: 0.4s ease;
			cursor: pointer;
			z-index: 4;
		}
		.dateAdded {
			display: none;
		}
	}
	.TrackCard:hover {
		background: rgba(255, 255, 255, 0.144);
		.delIcon {
			transform: translateX(50%) translateY(-50%) scale(1);
		}
	}
</style>
