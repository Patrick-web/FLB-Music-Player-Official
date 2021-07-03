<template>
  <div class="Equalizer widget blurred_bg blur20">
    <div class="widget_header">
      <h1 class="widget_title">Equalizer</h1>
      <base-button
        @click.native="UIcontrollerToggleProperty('showEqualizerWidget')"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        class="widget_close shrink_icon circle shrink8"
        :small="true"
      />
    </div>
    <div class="presets grid3 gap10">
      <base-button
        v-for="preset in equalizerPresets"
        :key="preset.name"
        extraClass="bg1"
        @click.native.stop="loadPreset(preset)"
        :text="preset.name"
        :active="currentPreset == preset.name"
      />
    </div>
    <div class="filter_sliders">
      <div v-for="(band, index) in bands" :key="band.id" class="filter">
        <p>{{ band.value }}db</p>
        <FilterSlider
          :targetBand="band.id"
          :bandIndex="index"
          :filterValue="band.value"
          v-on:rangeUpdated="updateBandFilter"
        />
        <p>{{ band.frequency }}</p>
      </div>
    </div>
    <div class="b_t">
      <triangle-slider v-on:newGainValues="changeBandGains" filterName="Bass" />
      <triangle-slider
        v-on:newGainValues="changeBandGains"
        filterName="Treble"
      />
      <triangle-slider filterName="VBoost" title="Boost Volume" />
    </div>
  </div>
</template>

<script>
import FilterSlider from "./FilterSlider.vue";
import BaseButton from "../../BaseComponents/BaseButton.vue";
import { mapMutations } from "vuex";
import TriangleSlider from "./TriangleSlider.vue";
export default {
  computed: {
    bands() {
      return this.$store.state.EqualizerManager.bands;
    },
    equalizerPresets() {
      return this.$store.state.EqualizerManager.equalizerPresets;
    },
    currentPreset() {
      return this.$store.state.EqualizerManager.currentPreset;
    },
  },
  components: { FilterSlider, BaseButton, TriangleSlider },
  methods: {
    ...mapMutations([
      "UIcontrollerToggleProperty",
      "updateBandFilter",
      "changeBandGains",
      "loadPreset",
    ]),
  },
};
</script>

<style lang="scss">
.Equalizer {
  padding: 10px;
  padding-top: 5px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.582);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 50;
  .filter_sliders {
    padding: 10px;
    display: flex;
    gap: 15px;
    .filter {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      p {
        font-size: 0.8rem;
        font-family: roboto-light;
      }
    }
  }
  .b_t {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0px;
  }
}
</style>