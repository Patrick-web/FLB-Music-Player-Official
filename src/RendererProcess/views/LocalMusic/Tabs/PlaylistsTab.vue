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
      <div v-if="selectedGroup" class="selectedGroup bg1">
        <base-button
          @click.native="deSelectGroup"
          :icon="require('@/RendererProcess/assets/images/back.svg')"
          id="backToUnfilteredItems"
          extraClass="blurred_bg"
        />
        <div class="sliverBar">
          <div class="images_flex">
            <div
              v-for="albumArt in imageFlex"
              :key="albumArt"
              class="flex_image_wrapper"
            >
              <img class="flexImage" :src="'file://' + albumArt" />
            </div>
          </div>

          <EditPlaylistWidget
            v-on:newPlaylistName="renamePlaylist"
            v-on:closeWidget="closeWidget"
            v-if="showPlaylistEditor"
          />
          <div class="sliverBarFooter">
            <div class="groupedCard_info">
              <p style="margin-bottom: 10px" class="groupedInfo_title">
                {{ selectedGroup.name }}
              </p>
            </div>

            <div class="sliverBarActions">
              <base-button
                @click.native="addPlaylistToQueue"
                :icon="
                  require('@/RendererProcess/assets/images/queue-music.svg')
                "
                text="Queue"
                extraClass="blurred_bg"
              />
              <base-button
                @click.native="showPlaylistEditor = !showPlaylistEditor"
                :icon="require('@/RendererProcess/assets/images/edit.svg')"
                text="Edit"
                v-if="selectedGroup.name !== 'Favorites'"
                extraClass="blurred_bg"
              />
              <base-button
                @click.native="deleteCurrentPlaylist"
                :icon="
                  require('@/RendererProcess/assets/images/trash-bin-outline.svg')
                "
                text="Delete"
                v-if="selectedGroup.name !== 'Favorites'"
                extraClass="blurred_bg"
              />
            </div>
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
import { removeDuplicates } from "@/sharedUtilities";

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
    imageFlex() {
      return removeDuplicates(this.selectedGroup.tracks, "album")
        .filter((track) => track.albumArt)
        .map((track) => track.albumArt);
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
@import "@/RendererProcess/assets/sass/mixins.scss";

.PlaylistsTab {
  position: relative;
  height: 100%;
  .playlistCards {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    // flex-direction: column;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    height: 95%;
    overflow: hidden;
    overflow-y: scroll;
  }
  .images_flex {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.151);
    // display: grid;
    // grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    display: flex;
    .flex_image_wrapper {
      height: 100%;
      overflow: hidden;
      .flexImage {
        // position: absolute;
        // display: none;
        height: 100%;
      }
    }
  }
  .selectedGroup {
    button {
      @include blur-bg(10px);
      background: rgba(0, 0, 0, 0.24);
    }
  }
}
</style>
