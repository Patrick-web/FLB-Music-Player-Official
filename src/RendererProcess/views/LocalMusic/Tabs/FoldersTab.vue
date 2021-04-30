<template>
  <div class="FoldersTab groupedContentTab tab">
    <div v-if="!selectedGroup" class="folderCards grid_auto">
      <div
        class="folderCard"
        v-for="folder in folders"
        :key="folder.path"
        @click="selectGroup(folder)"
      >
        <div class="silv">
          <img
            class="folderIcon"
            src="@/RendererProcess/assets/images/folder.svg"
            alt=""
          />
          <div class="top3">
            <img
              v-if="folder.tracks[0]"
              :src="folder.tracks[0].albumArt"
              alt=""
            />
            <img
              v-if="folder.tracks[1]"
              :src="folder.tracks[1].albumArt"
              alt=""
            />
            <img
              v-if="folder.tracks[2]"
              :src="folder.tracks[2].albumArt"
              alt=""
            />
          </div>
        </div>
        <p>{{ folder.name }}</p>
      </div>
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
        />
        <div class="sliverBar">
          <div class="sliverBarFooter">
            <div class="groupedCard_info">
              <p class="groupedInfo_title">
                {{ selectedGroup.name }}
              </p>
              <p class="groupedInfo_subtitle">{{ selectedGroup.path }}</p>
            </div>
            <div class="sliverBarActions">
              <base-button
                @click.native="playAll"
                :icon="
                  require('@/RendererProcess/assets/images/playButton.svg')
                "
                text="Play"
              />
              <base-button
                @click.native="addTracksToQueue"
                :icon="
                  require('@/RendererProcess/assets/images/queue-music.svg')
                "
                text="Queue"
              />
            </div>
          </div>
          <img
            v-if="selectedGroup.tracks[0].albumArt"
            id="blurred"
            :src="selectedGroup.tracks[0].albumArt"
            alt=""
          />
          <img
            v-if="!selectedGroup.tracks[0].albumArt"
            id="blurred"
            src="@/RendererProcess/assets/images/FLBDefaultCover.png"
            alt=""
          />
          <img
            class="coverArt"
            src="@/RendererProcess/assets/images/folder.svg"
            alt=""
          />
        </div>
        <div class="cardsWrapper">
          <TrackCard
            v-for="(track, index) in selectedGroup.tracks"
            :key="track.path"
            :index="index"
            :source="track"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";

export default {
  data() {
    return {
      card: TrackCard,
    };
  },
  methods: {
    ...mapMutations([
      "addSelectedTrackToCustomQueue",
      "addToSelectedTracks",
      "UIcontrollerSetPropertyValue",
      "clearSelectedTracks",
      "selectGroup",
      "deSelectGroup",
      "setPlayingTrack",
      "overWriteCustomQueue",
      "pushNotification",
    ]),
    ...mapActions(["generateFoldersData"]),
    addTracksToQueue() {
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
    playAll() {
      this.setPlayingTrack({ track: this.selectedGroup.tracks[0], index: 0 });
      this.overWriteCustomQueue(this.selectedGroup.tracks);
      this.pushNotification({
        title: "Playing all tracks from",
        subTitle: this.selectedGroup.name,
        type: "normal",
      });
    },
  },
  computed: {
    folders() {
      return this.$store.state.TabsManager.tabsData.folders;
    },
    selectedGroup() {
      return this.$store.state.TrackSelector.selectedGroup;
    },
    renderedTracks() {
      return this.$store.state.renderedTracks;
    },
  },
  components: {
    TrackCard,
    BaseButton,
  },
  mounted() {
    this.generateFoldersData();
  },
};
</script>

<style lang="scss">
.FoldersTab {
  height: 100%;
  padding-bottom: 0px;
}
.folderCards {
  gap: 10px;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  .folderCard {
    cursor: pointer;
    padding: 10px;
    border-radius: 20px;
    max-width: 150px;
    .silv {
      position: relative;
      .folderIcon {
        width: 150px;
      }
      .top3 {
        position: absolute;
        top: 45%;
        transform: translateY(-50%) translateX(5px);
        display: flex;
        flex-direction: column;
        img {
          width: 25px;
          margin: 5px;
        }
      }
    }
  }
  .folderCard:hover {
    background: rgba(255, 255, 255, 0.11);
  }
}
</style>
