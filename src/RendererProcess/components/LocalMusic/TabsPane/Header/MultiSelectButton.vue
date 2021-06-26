<template>
  <base-button
    title="Select Multiple Tracks"
    @click.native="toggleMultiSelect()"
    :icon="require('@/RendererProcess/assets/images/multiselect.svg')"
    text="Select"
    :active="multiSelectOn"
  />
</template>

<script>
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import { mapMutations } from "vuex";
export default {
  components: { BaseButton },
  computed: {
    multiSelectOn() {
      return this.$store.state.UIController.UIProperties.multiSelectMode;
    },
  },
  methods: {
    ...mapMutations([
      "selectGroup",
      "clearSelectedTracks",
      "UIcontrollerToggleProperty",
    ]),
    toggleMultiSelect() {
      this.UIcontrollerToggleProperty("multiSelectMode");
      this.clearSelectedTracks();
      const trackOptions = document.querySelector(".trackOptions");
      if (this.multiSelectOn) {
        trackOptions.style.height = `0px`;
        trackOptions.style.top = `300px`;
        trackOptions.style.left = `600px`;
        setTimeout(() => {
          trackOptions.style.height = `225px`;
        }, 100);
      } else {
        trackOptions.style.height = `0px`;
      }
    },
  },
};
</script>

<style>
</style>