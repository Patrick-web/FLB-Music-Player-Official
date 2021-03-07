<template>
	<div class="TrackBar">
		<audio :src="playingTrack.r_fileLocation" id="audioTag" autoplay></audio>
		<div @click="seek($event)" class="seekBar">
			<div class="seekProgress"></div>
			<p id="hoverTime">{{ hoverTime }}</p>
		</div>
		<div class="progressInfoCard">
			<p>
				{{ currentTime }}
			</p>
			<p>
				{{ duration }}
			</p>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";

export default {
	computed: {
		...mapState(["playingTrack", "isPlaying"]),
	},
	data() {
		return {
			currentTime: "00:00",
			duration: "00:00",
			hoverTime: "00:00",
		};
	},

	methods: {
		...mapActions(["determineNextTrack"]),
		...mapMutations(["toggleIsPlaying"]),
		play() {
			document.querySelector("audio").play();
			document.querySelector("video").play();
			const webview = document.querySelector("webview");
			if (webview) {
				webview.executeJavaScript(
					`function pause () {
            if(document.querySelector('.svg-icon-pause')){
              document.querySelector('[aria-label="Pause"]').click()
          }
          }
          pause();`
				);
			}
		},
		pause() {
			document.querySelector("video").pause();
			document.querySelector("audio").pause();
		},
		seekBack() {
			const audio = document.querySelector("#audioTag");
			audio.currentTime = audio.currentTime - 30;
			const video = document.querySelector("video");
			if (video) {
				video.currentTime = audio.currentTime - 30;
			}
		},
		seekForward() {
			const audio = document.querySelector("#audioTag");
			audio.currentTime = audio.currentTime + 30;
			const video = document.querySelector("video");
			if (video) {
				video.currentTime = audio.currentTime + 30;
			}
		},
		seek(e) {
			const track = document.querySelector(".seekBar");
			const seekProgress = document.querySelector(".seekProgress");
			const length = e.clientX - track.getBoundingClientRect().x;
			const percentageSeek = Math.ceil(
				(length / window.getComputedStyle(track).width.replace("px", "")) * 100
			);
			seekProgress.style.width = `${percentageSeek}%`;
			const audio = document.querySelector("#audioTag");

			audio.currentTime = (percentageSeek * audio.duration) / 100;
			const video = document.querySelector("video");
			if (video) {
				video.currentTime = audio.currentTime;
				video.play();
			}
			audio.play();
		},
		timeFormatter(duration) {
			// Hours, minutes and seconds
			const hrs = ~~(duration / 3600);
			const mins = ~~((duration % 3600) / 60);
			const secs = ~~duration % 60;

			// Output like "1:01" or "4:03:59" or "123:03:59"
			let ret = "";

			if (hrs > 0) {
				ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
			}

			ret += "" + mins + ":" + (secs < 10 ? "0" : "");
			ret += "" + secs;
			return ret;
		},
	},
	mounted() {
		const progressBar = document.querySelector(".seekBar");
		const seekProgress = document.querySelector(".seekProgress");
		const audio = document.querySelector("audio");
		console.log(audio.currentTime);
		document.querySelector("audio").addEventListener("timeupdate", (e) => {
			this.currentTime = this.timeFormatter(audio.currentTime);
			this.duration = this.timeFormatter(audio.duration);
			const percent = Math.floor((audio.currentTime / audio.duration) * 100);
			seekProgress.style.width = `${percent}%`;
			if (audio.currentTime == audio.duration) {
				this.determineNextTrack("next");
			}
		});
		progressBar.addEventListener("mousemove", (e) => {
			const posX = e.clientX - progressBar.getBoundingClientRect().x;
			const percentageSeek = Math.ceil(
				(posX / window.getComputedStyle(progressBar).width.replace("px", "")) *
					100
			);
			this.hoverTime = this.timeFormatter(
				(percentageSeek * audio.duration) / 100
			);
			document.querySelector("#hoverTime").style.left = `${percentageSeek -
				2}%`;
		});
		//handle being pause by os
		audio.addEventListener("pause", () => {
			const playIcon = document.querySelector("#playIcon");
			if (playIcon) playIcon.click();
		});
	},
};
</script>

<style lang="scss">
.TrackBar {
	position: relative;
	z-index: 25;
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transform: translateY(20%);
}

.seekBar {
	background: #ffffff21;
	width: 100%;
	height: 10px;
	position: relative;
	border-radius: 10px;
	.seekProgress {
		border-radius: 10px;
		position: absolute;
		height: 100%;
		max-height: 100%;
		width: 0%;
		background: #ffffff;
		transition: 0.2s linear;
	}
}
.seekBar:hover {
	cursor: pointer;
	.progressInfoCard {
		opacity: 1;
	}
	#hoverTime {
		transform: translateY(-130%) !important;
		opacity: 1 !important;
	}
}

.iconsWrapper {
	height: 30px;
	width: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.iconsWrapper:hover {
	cursor: pointer;
}
.toggleIcons {
	width: 25px;
}
.playingState {
}
.progressInfoCard {
	position: absolute;
	display: flex;
	justify-content: space-between;
	transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	width: 100%;
	top: 0%;
	left: 0%;
	transform: translateY(-10%);
	p {
		font-family: roboto-light;
		font-size: 0.8em;
	}
}
#hoverTime {
	position: absolute;
	top: 0;
	transform: translateY(-50%);
	opacity: 0;
	left: 0%;
	z-index: 2;
	font-family: roboto-light;
	font-size: 0.8em;
	padding: 2px 5px 2px 5px;
	border-radius: 10px;
	text-align: center;
	background: rgb(0, 0, 0);
	pointer-events: none;
}
</style>
