<template>
  <button
    title="Select Multiple Tracks"
    @click.stop="toggleMultiSelect"
    :class="[multiSelect ? 'bt_active' : '', 'btWithIcon']"
  >
    <p>Select</p>
    <img src="@/RendererProcess/assets/images/multiselect.svg" alt="" />
  </button>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      multiSelect: false,
    };
  },
  methods: {
    ...mapMutations(["selectGroup", "clearSelectedTracks"]),
    toggleMultiSelect() {
      this.multiSelect = !this.multiSelect;
      this.clearSelectedTracks();
      const centralArea = document.querySelector("#tabsArea");
      centralArea.classList.toggle("multiSelectMode");
      const trackOptions = document.querySelector(".trackOptions");
      if (this.multiSelect) {
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