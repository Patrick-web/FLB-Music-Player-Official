<template>
  <div class="SidePane">
    <div class="tabber">
      <div
        @click.stop="switchSidePaneTab('TrackInfo')"
        :class="[sidePaneActiveTab == 'TrackInfo' ? 'activeSidePaneTab' : '']"
        title="Track Info"
      >
        <img src="@/assets/images/music_note.svg" alt="" />
      </div>
      <div
        @click.stop="switchSidePaneTab('CustomQueue')"
        :class="[sidePaneActiveTab == 'CustomQueue' ? 'activeSidePaneTab' : '']"
        title="Queued Tracks"
      >
        <img src="@/assets/images/queue-music.svg" alt="" />
      </div>
      <div
        @click.stop="switchSidePaneTab('Lyrics')"
        :class="[sidePaneActiveTab == 'Lyrics' ? 'activeSidePaneTab' : '']"
        title="Lyrics"
        class="lyricsTabIcon"
      >
        <img src="@/assets/images/lyrics.svg" alt="" />
      </div>
    </div>
    <TrackInfo
      v-on:targetTrack="emitTargetTrack"
      v-if="sidePaneActiveTab == 'TrackInfo' && playingTrack"
    />
    <QueuedTracks v-if="sidePaneActiveTab == 'CustomQueue'" />
    <Lyrics v-if="sidePaneActiveTab == 'Lyrics'" />

    <!-- <canvas v-if="settings.visuals" id="visualizerArea"></canvas> -->
  </div>
</template>

<script>
import QueuedTracks from "./QueuedTracks.vue";
import TrackInfo from "./TrackInfo.vue";
import Lyrics from "./Lyrics.vue";
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      currentTab: "trackInfo",
    };
  },
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
    sidePaneActiveTab() {
      return this.$store.state.UIController.UIProperties.currentSidePaneTab;
    },
  },
  methods: {
    ...mapMutations(["UIcontrollerSetPropertyValue"]),
    switchSidePaneTab(tab) {
      this.UIcontrollerSetPropertyValue({
        property: "currentSidePaneTab",
        newValue: tab,
      });
    },
    emitTargetTrack(track) {
      this.$emit("targetTrack", track);
      this.UIcontrollerToggleProperty("showTagEditor");
    },
  },
  components: {
    QueuedTracks,
    TrackInfo,
    Lyrics,
  },
};
</script>

<style lang="scss">
.playingPaneLoaded {
  .SidePane {
    height: 76.5vh;
  }
}
.light_them {
  .activeSidePaneTab {
    filter: invert(1);
  }
}
.SidePane {
  height: 91vh;
  position: relative;
  padding-bottom: 110px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.083);
  margin-top: 10px;
  padding: 10px;
  border-radius: 20px;
  max-width: 19.5vw;
  min-width: 19.5vw;
  .tabber {
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 50%;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.083);
    border-radius: 20px;
    position: sticky;
    z-index: 10;
    overflow: hidden;
    div {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 0px solid var(--accentColorLight);
      cursor: pointer;
    }
    div:hover {
      cursor: pointer;
      background: rgba(79, 111, 255, 0.178);
    }
    img {
      width: 20px;
    }
    .activeSidePaneTab {
      background: linear-gradient(transparent, var(--accentColorLight));
    }
    .activeSidePaneTab:hover {
      background: linear-gradient(transparent, var(--accentColorLight));
    }
  }
  #visualizerArea {
    position: absolute;
    top: 48%;
    right: 0;
    width: 100%;
    z-index: -1;
    opacity: 0.8;
    transform: rotate(90deg) translateY(-50%);
  }
}
</style>
