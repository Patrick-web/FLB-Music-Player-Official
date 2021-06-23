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
    <div class="lyr_controls" v-if="playingTrackLyrics">
      <base-button
        @click.native="offset += 10"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        id="off_add"
      />
      <p>{{ offset }}</p>
      <base-button
        @click.native="offset -= 10"
        :icon="require('@/RendererProcess/assets/images/windowMinimize.svg')"
        id="off_minus"
      />
      <base-button
        @click.native="autoScroll = !autoScroll"
        text="Auto Scroll"
        :active="autoScroll"
        id="autoScroll"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import BaseButton from "../../BaseComponents/BaseButton.vue";
export default {
  components: {
    BaseButton,
  },
  methods: {
    ...mapActions(["getLyrics"]),
    autoScrollContainer() {
      const audio = document.querySelector("audio");
      const percent = audio.currentTime / audio.duration;
      const container = document.querySelector(".LyricsContainer .lyrics");
      const scrollTo = Math.floor(percent * container.scrollHeight);
      container.scrollTo(0, scrollTo - this.offset);
    },
  },
  data() {
    return {
      offset: 50,
      autoScroll: false,
    };
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
    const audio = document.querySelector("audio");
    document.querySelector("audio").addEventListener("timeupdate", (e) => {
      if (this.autoScroll) {
        this.autoScrollContainer();
      }
    });
  },
};
</script>

<style lang="scss">
.LyricsContainer {
  position: relative;
  scroll-behavior: smooth;
  width: 19vw;
  height: 92%;
  .lyrics {
    position: absolute;
    font-family: roboto-light;
    text-align: left;
    padding: 10px;
    overflow: hidden;
    height: 80%;
    overflow-y: scroll;
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
  .lyr_controls {
    position: absolute;
    bottom: 0px;
    width: 100%;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    #off_add {
      transform: rotate(45deg) scale(0.6);
      img {
        transform: scale(0.8);
      }
    }
    #off_minus {
      transform: rotate(45deg) scale(0.6);
      img {
        transform: rotate(-45deg);
      }
    }
    #autoScroll {
      position: absolute;
      top: 0px;
      transform: translateY(-110%);
    }
  }
}
</style>
