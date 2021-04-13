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
        <base-button
          @click.native="deSelectGroup"
          :icon="require('@/RendererProcess/assets/images/back.svg')"
          id="backToUnfilteredItems"
        />
        <div class="sliverBar">
          <img
            class="coverArt"
            src="@/RendererProcess/assets/images/FLBDefaultCover.png"
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
            <base-button
              @click.native="addTracksToQueue"
              :icon="require('@/RendererProcess/assets/images/queue-music.svg')"
              text="Add To Queue"
            />
            <base-button
              @click.native="showPlaylistEditor = !showPlaylistEditor"
              :icon="require('@/RendererProcess/assets/images/edit.svg')"
              text="Edit Playlist"
              v-if="selectedGroup.name !== 'Favorites'"
            />
            <base-button
              @click.native="deleteCurrentPlaylist"
              :icon="
                require('@/RendererProcess/assets/images/trash-bin-outline.svg')
              "
              text="Delete Playlist"
              v-if="selectedGroup.name !== 'Favorites'"
            />
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
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";

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
        newValue: "Queue",
      });
      this.clearSelectedTracks();
      this.selectedGroup.tracks.forEach((track) => {
        this.addToSelectedTracks(track);
      });
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
    BaseButton,
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px 0px;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
