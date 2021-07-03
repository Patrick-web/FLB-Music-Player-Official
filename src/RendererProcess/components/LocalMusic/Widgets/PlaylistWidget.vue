<template>
  <div class="PlaylistWidget blurred_bg blur20 widget">
    <div class="widget_header">
      <h1 class="widget_title">Select Playlist</h1>
      <base-button
        @click.native="UIcontrollerToggleProperty('showPlaylistWidget')"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        extraClass="widget_close shrink_icon circle shrink8"
        :small="true"
      />
    </div>
    <div class="newPlaylistForm">
      <input
        class="inputElem w-90"
        placeholder="Create new playlist"
        type="text"
        v-model="newPlaylistName"
      />
      <base-button
        text="Create"
        :active="true"
        @click.native="createNewPlaylist()"
        class="w-100 mt10"
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
.PlaylistWidget {
  z-index: 40;
}
.newPlaylistForm {
  margin-top: 10px;
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
