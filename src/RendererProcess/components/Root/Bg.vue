<template>
  <div class="bg">
    <img
      v-if="theme == 'fancy' && playingTrack && playingTrack.albumArt"
      :src="playingTrack.albumArt"
      id="bg_fancy"
      alt=""
    />
    <img
      v-else
      style="opacity: 0.4"
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
  pointer-events: none;
  position: fixed;
  top: 0%;
  left: 0;
  width: 120%;
  height: 100vh;
  #bg_fancy {
    width: 100%;
    height: 100%;
    filter: blur(50px);
    opacity: 0.3;
  }
}
</style>