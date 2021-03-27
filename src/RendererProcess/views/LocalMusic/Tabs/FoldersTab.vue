<template>
  <div class="Folders">
    <div v-if="!selectedGroup" class="folderCards">
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
      <div v-if="selectedGroup" class="selectedGroup">
        <button
          @click="deSelectGroup()"
          class="iconBt backToUnfilteredItems"
          style="margin-top: 20px"
        >
          <img src="@/RendererProcess/assets/images/back.svg" alt="" />
        </button>
        <div class="sliverBar">
          <div class="sliverBarActions">
            <button @click="playAll" class="btWithIcon">
              <img src="@/RendererProcess/assets/images/playnext.svg" alt="" />
              <p>Play All</p>
            </button>
            <button @click="addTracksToQueue" class="btWithIcon">
              <img
                src="@/RendererProcess/assets/images/queue-music.svg"
                alt=""
              />
              <p>Add To Queue</p>
            </button>
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
          <div class="groupedCard_info">
            <p class="groupedInfo_title">
              {{ selectedGroup.name }}
            </p>
            <p>{{ selectedGroup.path }}</p>
          </div>
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
import { mapActions, mapMutations, mapState } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";

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
      "switchSidePaneTab",
      "clearSelectedTracks",
      "selectGroup",
      "deSelectGroup",
      "setPlayingTrack",
    ]),
    ...mapActions(["generateFoldersData"]),
    addTracksToQueue() {
      this.switchSidePaneTab("CustomQueue");
      this.clearSelectedTracks();
      this.selectedGroup.tracks.forEach((track) => {
        console.log(track);
        this.addToSelectedTracks(track);
      });
      console.log(this.selectedTracks);
      this.addSelectedTrackToCustomQueue();
    },
    playAll() {
      console.log(this.renderedTracks[0]);
      this.setPlayingTrack(this.renderedTracks[0]);
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
  },
  mounted() {
    this.generateFoldersData();
  },
};
</script>

<style lang="scss">
.folderCards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  height: 63vh;
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
