<template>
	<div class="onboard">
		<transition
			enter-active-class="animated slideInUp faster"
			leave-active-class="animated slideOutUp faster"
		>
			<div class="slide" v-if="currentSlide == 1">
				<img id="onboard1" src="@/assets/images/onboard1.svg" alt="" />
				<img id="lamma" src="@/assets/images/lamma.gif" alt="" />
				<button @click="goToSlide2" id="jamBt" class="bt_active">
					<h1>Let's Jam</h1>
					<h2>🎸</h2>
				</button>
			</div>
			<div class="slide" v-if="currentSlide == 2">
				<article>
					<h2>Where should I look for Music ?</h2>
					<br />
					<div
						v-for="folder in settings.foldersToScan"
						:key="folder"
						class="folderBox"
					>
						<div>
							<p>{{ folder.replace(/(.*)[\/\\]/, "") }}</p>
							<p style="font-family:roboto-thin;font-size:0.9rem">
								{{ folder }}
							</p>
						</div>
						<button
							@click="removeFromScannedFolders(folder)"
							title="Remove folder"
							class="iconBt dangerBt"
						>
							<img style="width:15px" src="@/assets/images/x.svg" alt="" />
						</button>
					</div>
					<button class="bt_active" style="max-width:200px" @click="addFolder">
						<h3>Add Folder</h3>
					</button>
				</article>
				<article>
					<div
						@click="updateSetting(['includeVideo', !settings.includeVideo])"
						class="opt"
					>
						<h2>Should I add videos too ?</h2>
						<button class="bt_active" v-if="settings.includeVideo">
							<h3>
								Yes, I have some music videos
							</h3>
						</button>
						<button class="bt_active" v-if="!settings.includeVideo">
							<h3>
								No, all my music is in audio
							</h3>
						</button>
					</div>
				</article>
				<button @click="initialize" id="jamBt" class="bt_active">
					<h1>Next</h1>
					<h2>✨</h2>
				</button>
			</div>
			<div class="slide" v-if="currentSlide == 3">
				<h1 class="slideTitle">Great! Am loading your music</h1>
				<h3 style="position:absolute;bottom:100px;z-index:2">
					Tip {{ tips[currentTip] }}
				</h3>
				<img id="loadingCat" src="@/assets/images/cat.gif" alt="" />
				<div id="parseProgress">
					<h2>Tracks Added</h2>
					<h3>{{ fraction }}</h3>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { sendMessageToNode } from "@/Utils/frontEndUtils";
import { ipcRenderer } from "electron";
export default {
	data() {
		return {
			currentSlide: 1,
			currentTip: 0,
			fraction: "0/0",
			tips: [
				"✨✨ Right click on any track to see more options ✨✨",
				"🪓🪓 Drag tracks in the queue to reorder them 🪓🪓",
				"🏹🏹 Make sure to check out the settings 🏹🏹",
			],
		};
	},
	computed: {
		...mapState(["scannedFolders", "settings"]),
	},
	methods: {
		...mapMutations([
			"updateSetting",
			"restoreSettings",
			"UIcontrollerToggleProperty",
		]),
		goToSlide2() {
			this.currentSlide = 2;
			setInterval(() => {
				if (this.currentTip == 2) {
					this.currentTip = 0;
				} else {
					this.currentTip += 1;
				}
			}, 3000);
		},
		addFolder() {
			sendMessageToNode("addScanFolder", "");
		},
		removeFromScannedFolders(path) {
			sendMessageToNode("removeFromScannedFolders", path);
		},
		initialize() {
			ipcRenderer.send("getFirstTracks");
			this.currentSlide = 3;
		},
	},
	mounted() {
		ipcRenderer.on("parsingProgress", (e, [currentIndex, total]) => {
			this.fraction = `${currentIndex}/${total}`;
		});
		ipcRenderer.on("userSettings", (e, payload) => {
			console.log(payload);
			console.log("User Settings Received");
			this.restoreSettings(payload);
		});
		ipcRenderer.send("initializeSettings");
	},
};
</script>

<style lang="scss">
.onboard {
	position: fixed;
	bottom: 0;
	width: 100vw;
	height: 95vh;
	background: rgb(22, 22, 22);
	left: 0;
	z-index: 60;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.slide {
		position: relative;
		background: black;
		display: flex;
		border-radius: 20px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 70%;
		width: 60%;
		.slideTitle {
			width: 100%;
			text-align: center;
			position: absolute;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
		}
		#onboard1 {
			width: 60vw;
			margin-top: -30px;
		}
		#lamma {
			position: absolute;
			top: 250px;
			left: 50%;
			transform: translateX(-50%);
			width: 200px;
			filter: invert(1);
		}
		#loadingCat {
			position: absolute;
			top: 60px;
			left: 50%;
			transform: translateX(-50%);
			width: 300px;
			filter: invert(1);
		}
		#jamBt {
			width: 220px;
			left: 50%;
			transform: translateX(-50%);
			border-radius: 40px;
			bottom: 20px;
			position: absolute;
			display: flex;
			justify-content: center;
			background: rgb(0, 132, 255) !important;
			h2 {
				margin-left: 5px;
			}
		}
		#jamBt:hover {
			background: rgb(0, 174, 255) !important;
			border-radius: 5px;
		}
		#parseProgress {
			position: absolute;
			width: 100%;
			background: rgb(2, 196, 67);
			bottom: 0px;
			padding-bottom: 10px;
			padding-top: 10px;
			border-bottom-left-radius: 20px;
			border-bottom-right-radius: 20px;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	}
	article {
		background: rgba(255, 255, 255, 0.082);
		width: 40vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 10px;
		.folderBox {
			background: rgba(0, 0, 0, 0.801);
			padding: 10px 0px 10px 10px;
			border-radius: 20px;
			width: 400px;
			display: grid;
			align-items: center;
			grid-template-columns: 7fr 1fr;
			margin-bottom: 2px;
			button {
				margin-top: 0px;
			}
		}
		ul {
			p {
				background: rgba(0, 0, 0, 0.282);
				margin-bottom: 1px;
				padding: 5px;
				font-family: roboto-light;
				cursor: pointer;
			}
			p:hover {
				border-radius: 5px;
				padding-left: 10px;
				margin: 5px;
			}
			.activeSetting {
				padding-left: 10px;
				border-radius: 5px;
				margin: 5px;
				background: #0062ff !important;
			}
		}
	}
}
</style>
