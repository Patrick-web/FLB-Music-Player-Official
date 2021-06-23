<template>
  <div
    @click="cleanUp"
    id="app"
    :class="[accentColor, theme + '_theme', miniMode ? 'miniMode' : '']"
  >
    <CustomTitleBar />
    <IpcListener />
    <transition
      enter-active-class="animated slideInUp extrafaster"
      leave-active-class="animated slideOutDown extrafaster"
    >
      <Settings v-if="showSettings" />
    </transition>
    <OnBoard v-on:closeOnBoard="showOnboard = false" v-if="showOnboard" />
    <Notifications />
    <section id="main-view">
      <div v-if="!miniMode" class="flex" id="sub-view-1">
        <SideNav />
        <router-view />
      </div>
      <PlayingPane v-if="playingTrack" />
    </section>
    <Bg v-if="theme === 'fancy'" />
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
        miniMode() {
      return this.$store.state.UIController.UIProperties.miniMode;
    },
	  },
	  methods: {
	    cleanUp() {
	      if(document.querySelector(".trackOptions")){
	        document.querySelector(".trackOptions").style.height = `0px`;
	      }
	    },
	  },
	});
</script>
<style lang="scss">
@import "./RendererProcess/assets/cssAssets/animate.css";
@import "./RendererProcess/assets/cssAssets/global.css";
@import "./RendererProcess/assets/cssAssets/themer.css";
@import "./RendererProcess/assets/cssAssets/groupedContent.css";
@import "./RendererProcess/assets/cssAssets/utilityClasses.css";
@import "@/RendererProcess/assets/sass/mixins.scss";
@import "@/RendererProcess/assets/sass/fun.scss";
* {
  scroll-behavior: smooth;
}
body {
  height: 100vh;
  overflow: hidden;
}
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(8, 8, 8);
}
::-webkit-scrollbar {
  background: rgba(0, 0, 0, 0);
  width: 8px;
  height: 6px;
}
::-webkit-scrollbar-track-piece {
  background: rgba(255, 255, 255, 0);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: var(--accentColor);
  border-radius: 10px;
}
.playingPaneLoaded {
  #main-view {
    height: 94%;
  }
  #sub-view-1 {
    min-height: 85%;
    max-height: 0vh;
  }
}
#main-view {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
#sub-view-1 {
  height: 100%;
  min-height: 100%;
  max-height: 0vh;
}
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
