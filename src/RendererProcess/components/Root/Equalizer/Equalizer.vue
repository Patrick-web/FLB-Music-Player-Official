<template>
  <div class="Equalizer widget blurred_bg blur20">
    <div class="widget_header">
      <h1 class="widget_title">Equalizer</h1>
      <base-button
        @click.native="UIcontrollerToggleProperty('showEqualizerWidget')"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        extraClass="widget_close shrink_icon circle"
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
  </div>
</template>

<script>
import FilterSlider from "./FilterSlider.vue";
import BaseButton from "../../BaseComponents/BaseButton.vue";
import { setupEqualizer } from "./Equalizer";
import { mapMutations } from "vuex";
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
  components: { FilterSlider, BaseButton },
  methods: {
    ...mapMutations([
      "UIcontrollerToggleProperty",
      "updateBandFilter",
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
  .presets {
    margin-top: 10px;
  }
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
}
</style>