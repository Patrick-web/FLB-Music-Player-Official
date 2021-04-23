<template>
  <div class="BingCompletedTrack">
    <img id="cover" :src="track.albumArt" />

    <base-button
      id="playBt"
      :icon="require('@/RendererProcess/assets/images/play.svg')"
      :small="true"
      @click.native="playTrack"
    />
    <div class="content">
      <p class="track_title">{{ track.defaultTitle }}</p>
    </div>
    <p class="track_artist">{{ track.artist }}</p>
  </div>
</template>

<script>
import BaseButton from "../BaseComponents/BaseButton.vue";
import { mapMutations } from "vuex";

export default {
  components: {
    BaseButton,
  },
  methods: {
    ...mapMutations(["setPlayingTrack"]),
    playTrack() {
      this.setPlayingTrack({ track: this.track, index: 0 });
    },
  },
  props: {
    track: Object,
  },
};
</script>

<style lang="scss">
.BingCompletedTrack {
  padding: 10px;
  background: rgba(255, 255, 255, 0.11);
  width: 40%;
  position: relative;
  border-radius: 15px;
  break-inside: avoid;
  #playBt {
    background: rgba(255, 255, 255, 0.11);
    backdrop-filter: blur(10px);
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
  }
  #cover {
    width: 100%;
    border-radius: 15px;
  }
}
</style>