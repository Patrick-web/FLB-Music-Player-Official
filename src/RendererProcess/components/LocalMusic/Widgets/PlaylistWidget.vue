<template>
  <div id="PlaylistWidget" class="blurred_bg blur20">
    <base-button
      @click.native="UIcontrollerToggleProperty('showPlaylistWidget')"
      :icon="require('@/RendererProcess/assets/images/x.svg')"
      extraClass="modalClose"
      :small="true"
      style="transform: translate(5px, -5px) scale(0.8)"
      :transparent="true"
    />
    <h2 style="text-align: center">Select Playlist</h2>
    <div class="newPlaylistForm">
      <input
        class="inputElem"
        placeholder="Create new playlist"
        type="text"
        v-model="newPlaylistName"
      />
      <base-button
        text="Create"
        :active="true"
        :block="true"
        @click.native="createNewPlaylist()"
        style="margin-top: 5px"
      />
    </div>
    <div class="playlistNamesWrapper">
      <p
        @click="addToPlaylist(playlist.name)"
        v-for="playlist in playlists"
        :key="playlist.name"
        class="playlistName"
      >
        {{ playlist.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import BaseButton from "../../BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
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
  box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.281);
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
.playlistNamesWrapper {
  margin-top: 10px;
  .playlistName {
    padding: 5px;
    font-size: var(--baseFontSize);
    font-family: roboto-light;
    transition: 0.2s ease;
    cursor: pointer;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.356);
    &:hover {
      background-color: #ffffff1e;
      border-radius: 20px;
      margin: 5px;
      border: none;
      padding-left: 10px;
    }
  }
}
</style>
