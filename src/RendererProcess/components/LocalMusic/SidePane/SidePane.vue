<template>
  <div class="SidePane">
    <div
      v-if="!playingTrack"
      style="width: 19.5vw; height: 100%"
      class="centerContents"
    >
      <img
        style="width: 19vw; margin: auto"
        src="@/RendererProcess/assets/images/empty_Illustration.svg"
        alt=""
      />
      <pre
        style="
          text-align: center;
          font-family: roboto-thin;
          transform: translateY(-180px);
        "
      >
        This could be you,
        if you started playing something
      </pre>
    </div>
    <div v-if="playingTrack" class="tabber">
      <div
        @click.stop="switchAidePaneActiveTab('TrackInfo')"
        :class="[sidePaneActiveTab == 'TrackInfo' ? 'activeSidePaneTab' : '']"
        title="Track Info"
      >
        <img src="@/RendererProcess/assets/images/music_note.svg" alt="" />
      </div>
      <div
        @click.stop="switchAidePaneActiveTab('CustomQueue')"
        :class="[sidePaneActiveTab == 'CustomQueue' ? 'activeSidePaneTab' : '']"
        title="Queued Tracks"
      >
        <img src="@/RendererProcess/assets/images/queue-music.svg" alt="" />
      </div>
      <div
        @click.stop="switchAidePaneActiveTab('Lyrics')"
        :class="[sidePaneActiveTab == 'Lyrics' ? 'activeSidePaneTab' : '']"
        title="Lyrics"
        class="lyricsTabIcon"
      >
        <img src="@/RendererProcess/assets/images/lyrics.svg" alt="" />
      </div>
    </div>
    <TrackInfo
      v-on:targetTrack="emitTargetTrack"
      v-if="sidePaneActiveTab == 'TrackInfo' && playingTrack"
    />
    <QueuedTracks v-if="sidePaneActiveTab == 'CustomQueue'" />
    <Lyrics v-if="sidePaneActiveTab == 'Lyrics'" />
  </div>
</template>

<script>
import QueuedTracks from "./QueuedTracks";
import TrackInfo from "./TrackInfo";
import Lyrics from "./Lyrics";
import { mapMutations } from "vuex";

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
    switchAidePaneActiveTab(tab) {
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
.light_theme {
  .activeSidePaneTab {
    filter: invert(1);
  }
}
.SidePane {
  position: relative;
  padding-bottom: 110px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.083);
  padding: 10px;
  border-radius: 20px;
  max-width: 19.5vw;
  min-width: 17vw;
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
    margin-bottom: 10px;
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
  @media (max-width: 900px) {
    .SidePane {
      display: none;
    }
  }
}
</style>
