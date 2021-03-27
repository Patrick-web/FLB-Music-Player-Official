<template>
  <div class="bg">
    <img
      v-if="theme == 'fancy' && playingTrack"
      :src="playingTrack.albumArt"
      id="bg_fancy"
      alt=""
    />
    <img
      v-if="theme == 'fancy' && playingTrack && !playingTrack.albumArt"
      src="@/RendererProcess/assets/images/FLBDefaultCover.png"
      id="bg_fancy"
      alt=""
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
  position: fixed;
  pointer-events: none;
  #bg_fancy {
    position: fixed;
    top: 0%;
    left: 0;
    width: 120%;
    height: 100vh;
    filter: blur(40px);
    opacity: 0.3;
    z-index: -1;
  }
}
</style>