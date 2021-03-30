<template>
  <div @click="cleanUp" id="app" :class="[accentColor, theme + '_theme']">
    <CustomTitleBar />
    <IpcListener />
    <Settings v-if="showSettings" />
    <OnBoard v-on:closeOnBoard="showOnboard = false" v-if="showOnboard" />
    <Notifications />
    <div class="split">
      <section style="display: flex">
        <SideNav />
        <router-view />
      </section>
      <PlayingPane v-if="playingTrack" />
    </div>
    <Bg />
  </div>
</template>
<script lang="js">
	import Vue from "vue";

	import { mapMutations ,mapActions} from "vuex";
	import SideNav from "@/RendererProcess/components/Root/SideNav.vue";
	import PlayingPane from "@/RendererProcess/components/Root/Player/PlayingPane.vue";
  import Settings from "@/RendererProcess/components/Root/Settings";
	import CustomTitleBar from "@/RendererProcess/components/Root/CustomTitleBar.vue";
	import OnBoard from "@/RendererProcess/components/Root/Onboarder/OnBoard.vue";
	import Notifications from "@/RendererProcess/components/Root/Notifications/Notifications.vue";
	import IpcListener from "@/RendererProcess/components/Root/IpcListener.vue";
	import Bg from "@/RendererProcess/components/Root/Bg.vue";
	export default Vue.extend({
	  name: "App",
	  components: {
	    SideNav,
	    PlayingPane,
      Settings,
		CustomTitleBar,
		OnBoard,
		Notifications,
    IpcListener,
    Bg,
	  },
	  data(){return{
		showOnboard:true,
	  }},
	  computed: {
          theme() {
      return this.$store.state.SettingsManager.settings.theme;
    },
      playingTrack(){
        return this.$store.state.PlaybackManger.playingTrackInfo.track;
      },
      showSettings(){
        return this.$store.state.UIController.UIProperties.showSettings
      },
      accentColor(){
      return this.$store.state.SettingsManager.settings.accentColor;
      },
    addedTracks() {
      return this.$store.state.TabsManager.tabsData.addedTracks;
    },
	  },
	  methods: {
	    ...mapMutations(["addTrack","restoreTracks","restorePlaylists","restoreSettings","restoreRecentlyPlayed","setScannedFolders"]),
		...mapActions(['removeSelectedTracks',"popNotification","sortTracks","generateAlbumsData","generateArtistsData","generateFoldersData"]),
	    cleanUp() {
	      if(document.querySelector(".trackOptions")){
	        document.querySelector(".trackOptions").style.height = `0px`;
	      }
	    },
	  },
	});
</script>
<style lang="scss">
@import "./RendererProcess/assets/Css/animate.css";
@import "./RendererProcess/assets/Css/global.css";
@import "./RendererProcess/assets/Css/themer.css";
@import "./RendererProcess/assets/Css/groupedContent.css";
* {
  scroll-behavior: smooth;
}
body {
  height: 100vh;
  overflow: hidden;
}
#app {
  height: 100vh;
  background: black;
}
::-webkit-scrollbar {
  background: rgba(0, 0, 0, 0.199);
  width: 8px;
  height: 6px;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
  z-index: 2;
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
  section {
    // background: rgb(110, 110, 0);
    height: 95%;
    padding: 10px;
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

.playingPaneArea {
  position: relative;
}
.discoverTab {
  padding-top: 0px;
  height: 100vh;
}
</style>
