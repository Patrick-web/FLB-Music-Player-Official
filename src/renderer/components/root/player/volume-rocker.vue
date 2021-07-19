<template>
  <div class="VolumeRocker bg1">
    <input
      min="0"
      value=".5"
      max="1"
      step="0.05"
      type="range"
      @input="changeVolume($event)"
    >
    <!-- <div class="base_slider_progress"></div> -->
    <div
      :style="{ width: progressBarWidth }"
      class="base_slider_progress"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { gainNode } from '../equalizer/equalizer';

export default {
  name: 'VolumeRocker',

  data() {
    return {
      volume: 0.5
    };
  },
  computed: {
    progressBarWidth() {
      return `${Math.trunc(this.userSetVolume * 100)}%`;
    },
    userSetVolume() {
      return this.$store.state.SettingsManager.settings.volume;
    }
  },
  methods: {
    ...mapMutations(['setSettingValue']),
    changeVolume(e) {
      this.volume = e.srcElement.value;
      gainNode.gain.value = this.volume;
      this.setSettingValue({ property: 'volume', newValue: this.volume });
    }
  },
  mounted() {
    this.volume = this.userSetVolume;
    setTimeout(() => {
      gainNode.gain.value = this.volume;
    }, 0);
  }
};
</script>

<style lang="scss">
.VolumeRocker {
  position: relative;
  width: 135px;
  height: 6px;
  border-radius: 10px;
  cursor: pointer;
  &:active {
    height: 12px;
  }
  &:hover {
    .base_slider_progress {
      background: var(--accentColor);
    }
  }
  input {
    cursor: pointer;
    -webkit-appearance: none;
    opacity: 0;
    position: absolute;
    z-index: 2;
    top: -10px;
    left: -5px;
    height: 20px;
    width: 100%;
  }
  .base_slider_progress {
    position: absolute;
    border-radius: 10px;
    top: 50%;
    transform: translateY(-50%);
    left: 0px;
    height: 150%;
    background: white;
    width: 100%;
    max-width: 100%;
  }
}
</style>
