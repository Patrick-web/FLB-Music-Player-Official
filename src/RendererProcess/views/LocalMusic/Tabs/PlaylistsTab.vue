<template>
  <div class="PlaylistsTab tab">
    <div v-if="!selectedGroup" class="playlistCards">
      <PlaylistCard
        v-for="playlist in playlists"
        :playlist="playlist"
        :key="playlist.name"
      />
    </div>
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <div v-if="selectedGroup" class="selectedGroup">
        <button
          @click="deSelectGroup()"
          class="iconBt backToUnfilteredItems"
          style="margin-top: 20px"
        >
          <img src="@/RendererProcess/assets/images/back.svg" alt="" />
        </button>
        <div class="sliverBar">
          <img
            class="coverArt"
            src="@/RendererProcess/assets/images/plImages/teal.png"
            alt=""
          />
          <div class="groupedCard_info">
            <p style="margin-bottom: 10px" class="groupedInfo_title">
              {{ selectedGroup.name }}
            </p>
          </div>

          <EditPlaylistWidget
            v-on:newPlaylistName="renamePlaylist"
            v-on:closeWidget="closeWidget"
            v-if="showPlaylistEditor"
          />

          <div class="sliverBarActions">
            <button @click="addPlaylistToQueue" class="btWithIcon">
              <img
                src="@/RendererProcess/assets/images/queue-music.svg"
                alt=""
              />
              <p>Add To Queue</p>
            </button>
            <button
              v-if="selectedGroup.name !== 'Favorites'"
              @click="showPlaylistEditor = !showPlaylistEditor"
              class="btWithIcon"
            >
              <img src="@/RendererProcess/assets/images/edit.svg" alt="" />
              <p>Edit Playlist</p>
            </button>
            <button
              v-if="selectedGroup.name !== 'Favourites'"
              @click="deleteCurrentPlaylist"
              class="btWithIcon dangerBt"
            >
              <img
                src="@/RendererProcess/assets/images/trash-bin-outline.svg"
                alt=""
              />
              <p>Delete Playlist</p>
            </button>
          </div>
        </div>
        <div class="cardsWrapper">
          <transition-group leave-active-class="animated slideOutDown fast">
            <TrackCard
              v-for="(track, index) in selectedGroup.tracks"
              :key="track.fileLocation"
              :index="index"
              :source="track"
            />
          </transition-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import PlaylistCard from "@/RendererProcess/components/LocalMusic/TabsPane/PlaylistTab/PlaylistCard.vue";
import EditPlaylistWidget from "@/RendererProcess/components/LocalMusic/TabsPane/PlaylistTab/EditPlaylistWidget.vue";
export default {
  data() {
    return {
      showPlaylistEditor: false,
    };
  },
  methods: {
    ...mapMutations([
      "selectGroup",
      "deSelectGroup",
      "deletePlaylist",
      "addToSelectedTracks",
      "clearSelectedTracks",
      "addSelectedTrackToCustomQueue",
      "UIcontrollerSetPropertyValue",
      "renameCurrentPlaylist",
    ]),
    addPlaylistToQueue() {
      this.UIcontrollerSetPropertyValue({
        property: "currentSidePaneTab",
        newValue: "CustomQueue",
      });
      this.clearSelectedTracks();
      this.selectedGroup.tracks.forEach((track) => {
        console.log(track);
        this.addToSelectedTracks(track);
      });
      console.log(this.selectedTracks);
      this.addSelectedTrackToCustomQueue();
    },
    deleteCurrentPlaylist() {
      this.deletePlaylist(this.selectedGroup.name);
      this.deSelectGroup();
    },
    renamePlaylist(newPlaylistName) {
      this.showPlaylistEditor = false;
      this.renameCurrentPlaylist(newPlaylistName);
    },
    closeWidget() {
      this.showPlaylistEditor = false;
    },
  },
  computed: {
    playlists() {
      return this.$store.state.TabsManager.tabsData.playlists;
    },
    selectedTracks() {
      return this.$store.state.TrackSelector.selectedTracks;
    },
    selectedGroup() {
      return this.$store.state.TrackSelector.selectedGroup;
    },
  },
  components: {
    TrackCard,
    PlaylistCard,
    EditPlaylistWidget,
  },
};
</script>

<style lang="scss">
.PlaylistsTab {
  height: 100%;
  position: relative;
}

.playlistCards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  height: 75vh;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
