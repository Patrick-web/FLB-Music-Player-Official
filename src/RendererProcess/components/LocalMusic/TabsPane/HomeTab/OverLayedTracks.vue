<template>
  <div class="overLayedTracks">
    <div
      @click="playTrack(track)"
      v-for="track in top10MixTracks"
      :key="track.fileLocation"
      class="card"
    >
      <img
        class="card_image"
        v-if="track.albumArt"
        :src="track.albumArt"
        alt=""
      />
      <img
        class="card_image"
        v-else
        src="@/RendererProcess/assets/images/FLBDefaultCover.png"
      />
      <button class="card_playBt iconBt">
        <img src="@/RendererProcess/assets/images/playButton.svg" />
      </button>
      <p class="card_title">{{ track.defaultTitle }}</p>
      <p class="card_subTitle">{{ track.defaultArtist || "unknown artist" }}</p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
export default {
  computed: {
    top10MixTracks() {
      return this.tracks.slice(0, 10);
    },
  },
  methods: {
    ...mapMutations(["setPlayingTrack"]),
    ...mapActions(["getLyrics"]),
    playTrack(track) {
      if (document.querySelector("audio")) {
        document.querySelector("audio").muted = false;
      }
      this.setPlayingTrack({ track, index: 0 });
      this.getLyrics(track);
    },
  },
  props: {
    tracks: Array,
  },
};
</script>

<style lang="scss" >
.overLayedTracks {
  display: flex;
  align-items: flex-end;
  // overflow-x: scroll;
  height: 215px;
  padding-bottom: 10px;
  .card {
    background: rgba(255, 255, 255, 0.068);
    backdrop-filter: blur(10px);
    padding: 10px;
    box-shadow: -15px 5px 10px rgba(0, 0, 0, 0.39);
    position: relative;
    max-width: 140px;
    overflow: hidden;
    cursor: pointer;
    p {
      text-align: left;
      font-family: roboto-light;
      width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .card_title {
      font-size: 0.9rem;
    }
    .card_subTitle {
      font-size: 0.8rem;
    }
    .card_image {
      height: 140px;
      margin: auto;
    }
    .card_playBt {
      position: absolute;
      background: rgba(0, 0, 0, 0.397);
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
    }
  }
  .card:hover {
    transform: translateY(-10px);
    .card_playBt {
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
  .card:hover ~ .card {
    transform: translateX(90px);
  }
  .card:not(:first-child) {
    margin-left: -90px;
  }
}
</style>