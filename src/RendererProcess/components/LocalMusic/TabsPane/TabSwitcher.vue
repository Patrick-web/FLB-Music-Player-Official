<template>
  <div class="Tabswitcher">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      :class="[currentTab === tab.name ? 'activeTab' : '', 'tabBtn bg1']"
      @click="routeTo(tab)"
      :id="tab.name"
    >
      <img :src="tab.icon" class="icon" />
      <p>{{ tab.name }}</p>
    </div>
  </div>
</template>

<script lang="js">
	import { mapMutations } from "vuex";
import homeIcon from "@/RendererProcess/assets/images/home.svg";
import tracksIcon from "@/RendererProcess/assets/images/music_note.svg";
import recentsIcon from "@/RendererProcess/assets/images/file.svg";
import playlistsIcon from "@/RendererProcess/assets/images/playlist.svg";
import albumIcon from "@/RendererProcess/assets/images/album.svg";
import artistIcon from "@/RendererProcess/assets/images/user.svg";
import folderIcon from "@/RendererProcess/assets/images/folderNormal.svg";
import { ipcRenderer } from "electron";

	export default {
	name: "TabSwitcher",
  data(){return{
      tabs: [
        { name: "Home",path:'/', icon: homeIcon },
        { name: "Tracks",path:'/Tracks', icon: tracksIcon },
        { name: "Recents",path:'/Recents', icon: recentsIcon },
        { name: "Playlists",path:'/Playlists', icon: playlistsIcon },
        { name: "Artists",path:'/Artists', icon: artistIcon },
        { name: "Albums",path:'/Albums', icon: albumIcon },
        { name: "Folders",path:'/Folders', icon: folderIcon },
      ],
  }},
	computed: {
      currentTab(){
        return this.$store.state.UIController.UIProperties.currentMainTab
      },
      defaultTab(){
      return this.$store.state.SettingsManager.settings.defaultTab;
      }
    },
    methods: {
      ...mapMutations(["deSelectGroup","clearSelectedTracks","UIcontrollerSetPropertyValue"]),
      routeTo(tab) {
        this.clearSelectedTracks()
        this.deSelectGroup()
        if(tab.path!==this.$route.path)
        this.$router.push(tab.path)
        this.UIcontrollerSetPropertyValue({property:'currentMainTab',newValue:tab.name})        
      },
    },
    mounted(){
    ipcRenderer.on("userSettings", (e, payload) => {
      setTimeout(() => {
          const defaultTabIndex = this.tabs.findIndex(tab=>tab.name==this.defaultTab)
          this.routeTo(this.tabs[defaultTabIndex])
        }, 100);
    }); 
  }
  }
</script>

<style lang="scss">
.Tabswitcher {
  display: flex;
  gap: 10px;
  justify-content: center;
  position: relative;
  z-index: 10;
  margin-bottom: 10px;
  margin-top: 10px;
  .tabBtn {
    text-align: center;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 8px;
    color: white;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.4s ease border-radius;
    p {
      font-size: 0.9rem;
      font-family: roboto-light;
    }
    img {
      width: 20px;
      transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    }
    &:hover {
      background: rgba(255, 255, 255, 0.062);
    }
  }
  .activeTab {
    background: var(--accentColor) !important;
    border-radius: 20px;
    // padding-left: 5px;
    // padding-right: 5px;
    // p {
    //   width: 0px;
    //   margin-left: -5px;
    //   opacity: 0;
    // }
  }
  .activeTab:hover {
    background: var(--accentColor);
  }
}
// @media (max-width: 700px) {
//   .Tabswitcher {
//     display: none;
//   }
// }
</style>
