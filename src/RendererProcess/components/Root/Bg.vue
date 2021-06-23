<template>
  <div class="bg">
    <img
      v-if="playingTrack"
      :src="
        playingTrack.albumArt ||
        require('@/RendererProcess/assets/images/FLBDefaultCover.png')
      "
      id="bg_fancy"
    />
    <img
      v-if="!playingTrack"
      :src="require('@/RendererProcess/assets/images/FLBDefaultCover.png')"
      id="bg_fancy"
    />
  </div>
</template>

<script>
export default {
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
    theme() {
      return this.$store.state.SettingsManager.settings.theme;
    },
  },
};
</script>

<style lang="scss">
.bg {
  pointer-events: none;
  position: fixed;
  top: 0%;
  left: 0;
  width: 120%;
  height: 100vh;
  .hideImage {
    border-radius: 50% !important;
    height: 0% !important;
    width: 0% !important;
  }
  #bg_fancy {
    border-radius: 0%;
    position: fixed;
    top: 0%;
    width: 100%;
    height: 100%;
    filter: blur(50px);
    opacity: 0.3;
  }
}
</style>