<template>
	<div @click="cleanUp" id="app" :class="settings.accentColor">
		<CustomTitleBar />
		<OnBoard v-if="!hideOnboard" />
		<Notifications />
		<div class="split">
			<img
				v-if="settings.theme == 'fancy' && playingTrack"
				:src="playingTrack.albumArt"
				id="bg_fancy"
				alt=""
			/>
			<img
				v-if="
					settings.theme == 'fancy' && playingTrack && !playingTrack.albumArt
				"
				src="@/assets/images/FLBDefaultCover.png"
				id="bg_fancy"
				alt=""
			/>
			<section style="display:flex">
				<SideNav />
				<router-view />
			</section>
			<PlayingPane v-if="playingTrack" />
		</div>
	</div>
</template>
<script lang="js">
import Vue from "vue";

import SideNav from "@/components/SideNav.vue";
import { mapMutations, mapState ,mapActions} from "vuex";
import { ipcRenderer } from "electron";
import PlayingPane from "./components/Widgets/PlayingPane.vue";
import CustomTitleBar from "./components/CustomTitleBar.vue";
import OnBoard from "./components/OnBoard.vue";
import Notifications from "./components/Widgets/Notifications.vue";
export default Vue.extend({
  name: "App",
  components: {
    SideNav,
    PlayingPane,
	CustomTitleBar,
	OnBoard,
	Notifications
  },
  data(){return{
	hideOnboard:false,
  }},
  computed: {
    ...mapState(["currentTab", "playingTrack","settings"]),
  },
  methods: {
    ...mapMutations(["addTrack","restoreTracks","restorePlaylists","restoreSettings","restoreRecentlyPlayed","setScannedFolders","generateAlbumsData","generateArtistsData","generateFoldersData"]),
	...mapActions(['removeSelectedTracks',"playFirstTrack"]),
    cleanUp() {
      if(document.querySelector(".trackOptions")){
        document.querySelector(".trackOptions").style.height = `0px`;
      }
    },
  },
  mounted() {
	ipcRenderer.send("initializeSettings");
	ipcRenderer.send("initializeAppData");
	ipcRenderer.on("newTrack", (e, newTrack) => {
		this.addTrack(newTrack);
		console.log("Adding " + newTrack.fileName);
	});
	ipcRenderer.on("processedFiles", (e, tracks) => {
		this.hideOnboard = true
		this.restoreTracks(tracks);
		this.generateAlbumsData()
		this.generateArtistsData()
		this.generateFoldersData()
	});
	ipcRenderer.on("recentlyPlayed", (e, tracks) => {
		console.log(tracks);
		this.restoreRecentlyPlayed(tracks);
	});
	ipcRenderer.on("userPlaylists", (e, playlists) => {
		this.restorePlaylists(playlists);
	});
	ipcRenderer.on("userSettings", (e, payload) => {
		this.restoreSettings(payload);
	document.querySelector(`#${payload.defaultTab}`).click();
	setTimeout(() => {
		document.querySelector(`#${payload.defaultTab}`).click();
	}, 100);
		});
	ipcRenderer.on("foldersToScan", (e, folders) => {
		this.setScannedFolders(folders);
	});
	ipcRenderer.on("removeSelectedTracks", () => {
		this.removeSelectedTracks();
	});
	ipcRenderer.on("playFirstTrack", () => {
		this.playFirstTrack();
	});
	ipcRenderer.on("parsingDone", () => {
		this.generateAlbumsData()
		this.generateArtistsData()
		this.generateFoldersData()
		this.hideOnboard = true
	});

	window.addEventListener('online',()=>{
		console.log("online");
	})
  },
});
</script>
<style lang="scss">
@import "./assets/Css/animate.css";
@import "./assets/Css/global.css";
@import "./assets/Css/grouperTabs.css";
* {
	scroll-behavior: smooth;
}
body {
	background: black;
	font-family: roboto;
	height: 100vh;
	overflow: hidden;
	#app {
		height: 100vh;
	}
}
::-webkit-scrollbar {
	background: rgba(0, 0, 0, 0.199);
	width: 8px;
}
::-webkit-scrollbar-track-piece {
	background: rgba(255, 255, 255, 0.083);
	border-radius: 10px;
}
::-webkit-scrollbar-thumb {
	background: rgb(255, 255, 255);
	border-radius: 10px;
}
.split {
	display: flex;
	justify-content: space-between;
	#logo {
		position: fixed;
		width: 40px;
		top: 25px;
		left: 15px;
		z-index: 20;
	}
	#logo:hover {
		cursor: pointer;
	}
	#bg_fancy {
		position: fixed;
		top: -50%;
		left: 0;
		width: 120%;
		filter: blur(40px);
		opacity: 0.2;
		z-index: -1;
	}
}
// @media (max-width: 700px) {
//   .MainGrid {
//     grid-template-columns: 4fr 1fr;
//   }
//   .featuresSwitcherArea {
//     display: none !important;
//   }
//   #logo {
//     display: none !important;
//   }
// }
.featuresSwitcherArea {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 100vh;
	padding-left: 0px;
	margin-right: 10px;
}
.tab {
	overflow: hidden;
}

.playingPaneArea {
	position: relative;
}
.discoverTab {
	padding-top: 0px;
	height: 100vh;
}
</style>
