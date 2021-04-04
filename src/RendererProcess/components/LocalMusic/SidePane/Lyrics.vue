<template>
  <div class="LyricsContainer">
    <div v-if="!playingTrackLyrics" class="centerContents" style="height: 90%">
      <img width="200px" src="@/RendererProcess/assets/images/no_lyrics.svg" />
      <p
        v-if="allLyrics.length == 0"
        style="text-align: center; font-family: roboto-thin"
      >
        Comeback here for lyrics. A small dose of internet and bam💥 I'll have
        all the lyrics
      </p>
      <p v-else style="text-align: center; font-family: roboto-thin">
        I haven't found the lyrics for this one, yet
      </p>
    </div>
    <div v-if="playingTrackLyrics" class="lyrics">
      <div v-for="(verse, index) in playingTrackLyrics" :key="index">
        <pre>
				{{ verse.replace(/\[.*\].*/gi, "") }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["getLyrics"]),
  },
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
    playingTrackLyrics() {
      return (
        this.$store.state.PlaybackManger.allLyrics.filter(
          (trackLyricInfo) =>
            trackLyricInfo.trackName == this.playingTrack.defaultTitle
        )[0]?.lyrics || false
      );
    },
    allLyrics() {
      return this.$store.state.PlaybackManger.allLyrics;
    },
  },
  mounted() {
    this.getLyrics();
  },
};
</script>

<style lang="scss">
.LyricsContainer {
  position: relative;
  overflow: hidden;
  height: 92%;
  overflow-y: scroll;
  width: 19vw;
  .lyrics {
    position: absolute;
    font-family: roboto-light;
    text-align: left;
    padding: 10px;
    div {
      padding: 10px;
      width: 250px;
      margin-bottom: 10px;
      margin-left: -20px;
      line-height: 1.5rem;
      text-align: center;
      font-family: "Courier New", Courier, monospace !important;
      pre {
        // font-family: "Courier New", Courier, monospace !important;
        white-space: pre-wrap;
        text-align: center;
      }
    }
    // width: 100px;
  }
}
</style>
