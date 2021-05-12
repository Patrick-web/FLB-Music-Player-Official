<template>
  <div class="VolumeRocker bg1">
    <input
      v-on:input="sendNewVolume($event)"
      min="0"
      value="1"
      max="1"
      step="0.1"
      type="range"
    />
    <!-- <div class="base_slider_progress"></div> -->
    <div
      :style="{ width: progressBarWidth }"
      class="base_slider_progress"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      volume: 1,
    };
  },
  computed: {
    progressBarWidth() {
      return `${Math.trunc(this.volume * 100)}%`;
    },
  },
  methods: {
    sendNewVolume(e) {
      this.volume = e.srcElement.value;
      console.log(this.volume);
      this.$emit("newVolume", this.volume);
    },
  },
};
</script>

<style lang="scss">
.VolumeRocker {
  position: relative;
  width: 130px;
  height: 10px;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  input {
    cursor: pointer;
    -webkit-appearance: none;
    opacity: 0;
    position: absolute;
    z-index: 2;
    top: 0px;
    left: 0px;
    height: 20px;
    width: 100px;
    // background: wheat;
    transform-origin: center center;
    // transform: rotate(90deg) translateX(90px) translateY(90px);
    &::-webkit-range-progress {
      background: rgb(179, 237, 245);
      -webkit-appearance: none;
      width: 90px;
    }
    &::-webkit-slider-runnable-track {
      height: 100%;
      border-radius: 3px;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none !important;
      background: rgb(179, 237, 245);
      height: 100%;
      width: 10px;
    }
  }
  .base_slider_progress {
    position: absolute;
    border-radius: 5px;
    bottom: 0px;
    left: 0px;
    height: 100%;
    background: var(--accentColor);
    width: 100%;
  }
}
</style>