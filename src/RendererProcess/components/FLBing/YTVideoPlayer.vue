<template>
  <div class="ytVideoPlayer">
    <iframe :src="srcString" width="560" height="315" frameborder="0"></iframe>
    <base-button
      :icon="require('@/RendererProcess/assets/images/x.svg')"
      text="Close Player"
      @click.native="closePlayer"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import BaseButton from "../BaseComponents/BaseButton.vue";
export default {
  methods: {
    ...mapActions(["toggleIsPlaying"]),
    closePlayer() {
      this.$emit("closeYTPlayer");
      if (!this.audioState.playing) {
        this.toggleIsPlaying();
      }
    },
  },
  components: { BaseButton },

  computed: {
    audioState() {
      return this.$store.state.PlaybackManger.audioState;
    },
  },
  mounted() {
    if (this.audioState.playing) {
      this.toggleIsPlaying();
    }
  },
  props: {
    srcString: String,
  },
};
</script>

<style lang="scss">
.ytVideoPlayer {
  position: absolute;
  bottom: 20px;
  left: 24.5%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.329);
  backdrop-filter: blur(40px);
  padding: 10px;
  border-radius: 18px;
  iframe {
    border-radius: 15px;
  }
  button {
    background: crimson;
  }
}
</style>