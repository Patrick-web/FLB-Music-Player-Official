<template>
  <div id="PlaylistWidget">
    <p
      class="modalClose"
      @click="UIcontrollerToggleProperty('showPlaylistWidget')"
    >
      <img src="@/RendererProcess/assets/images/x.svg" alt="" />
    </p>
    <h2 style="text-align: center">Select Playlist</h2>
    <div class="newPlaylistForm">
      <input
        class="inputElem"
        placeholder="Create new playlist"
        type="text"
        v-model="newPlaylistName"
      />
      <button @click="createNewPlaylist()" v-if="newPlaylistName">
        Create
      </button>
    </div>
    <br />
    <p
      @click="addToPlaylist(playlist.name)"
      v-for="playlist in playlists"
      :key="playlist.name"
      class="playlistName"
    >
      {{ playlist.name }}
    </p>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      newPlaylistName: "",
    };
  },
  computed: {
    playlists() {
      return this.$store.state.TabsManager.tabsData.playlists;
    },
    selectedTracks() {
      return this.$store.state.TrackSelector.selectedTracks;
    },
  },
  methods: {
    ...mapMutations([
      "createPlaylist",
      "addSelectedTracksToPlaylist",
      "UIcontrollerToggleProperty",
      "pushNotification",
      "clearSelectedTracks",
    ]),
    createNewPlaylist() {
      this.createPlaylist(this.newPlaylistName);
      this.newPlaylistName = "";
    },
    addToPlaylist(playlistName) {
      this.addSelectedTracksToPlaylist(playlistName);
      this.UIcontrollerToggleProperty("showPlaylistWidget");
      this.pushNotification({
        title: `Added to ${playlistName} playlist`,
        subTitle: `${this.selectedTracks[0].defaultTitle}`,
        type: "normal",
      });
      this.clearSelectedTracks();
    },
  },
};
</script>

<style lang="scss">
#PlaylistWidget {
  position: fixed;
  top: 700px;
  min-width: 250px;
  max-width: 250px;
  z-index: 60;
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 50px 10px black;
  padding: 10px;
  border-radius: 20px;
  transition: none;
}
.newPlaylistForm {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.playlistName {
  background: #11111150;
  padding: 5px;
  font-size: 1rem;
  transition: 0.2s ease;
  cursor: pointer;
  text-align: left;
}
.playlistName:hover {
  background-color: #ffffff1e;
  border-radius: 20px;
  margin: 5px;
  border: none;
  padding: 8px;
}
</style>
