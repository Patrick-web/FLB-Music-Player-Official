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
    <div v-if="playingTrack" class="Tabswitcher" style="margin-top: 0px">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        :class="[sidePaneActiveTab === tab.name ? 'activeTab' : '', 'tabBtn']"
        @click.stop="switchAidePaneActiveTab(tab.name)"
        :id="tab.name"
      >
        <img :src="tab.icon" alt="" />
        <p>{{ tab.name }}</p>
      </div>
    </div>
    <TrackInfo
      v-on:targetTrack="emitTargetTrack"
      v-if="sidePaneActiveTab == 'Info' && playingTrack"
    />
    <QueuedTracks v-if="sidePaneActiveTab == 'Queue'" />
    <Lyrics v-if="sidePaneActiveTab == 'Lyrics'" />
  </div>
</template>

<script>
import QueuedTracks from "./QueuedTracks";
import TrackInfo from "./TrackInfo";
import Lyrics from "./Lyrics";
import { mapMutations } from "vuex";
import lyricsIcon from "@/RendererProcess/assets/images/lyrics.svg";
import trackInfoIcon from "@/RendererProcess/assets/images/music_note.svg";
import queueIcon from "@/RendererProcess/assets/images/queue-music.svg";
export default {
  data() {
    return {
      tabs: [
        { name: "Info", icon: trackInfoIcon },
        { name: "Queue", icon: queueIcon },
        { name: "Lyrics", icon: lyricsIcon },
      ],
    };
  },
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
    sidePaneActiveTab() {
      return this.$store.state.UIController.UIProperties.currentSidePaneTab;
    },
    playingTrackLyrics() {
      return (
        this.$store.state.PlaybackManger.allLyrics.filter(
          (trackLyricInfo) =>
            trackLyricInfo.trackName == this.playingTrack.defaultTitle
        )[0]?.lyrics || false
      );
    },
  },
  methods: {
    ...mapMutations([
      "UIcontrollerSetPropertyValue",
      "UIcontrollerToggleProperty",
    ]),
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
.SidePane {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.083);
  padding: 10px;
  border-radius: 20px;
  width: 19.5vw;
  height: 97%;
  @media (max-width: 900px) {
    .SidePane {
      display: none;
    }
  }
}
</style>
