<template>
  <div class="PodCategoryCard">
    <div class="sectionHeading">
      <p>Top Technology Podcasts</p>
      <div class="line"></div>
      <base-button text="Show All" />
    </div>
    <div class="podCardsWrapper grid_auto">
      <pod-card :podcast="{ name: 'test' }" />
      <pod-card :podcast="{ name: 'test' }" />
      <pod-card :podcast="{ name: 'test' }" />
      <pod-card :podcast="{ name: 'test' }" />
    </div>
  </div>
</template>

<script>
import BaseButton from "../BaseComponents/BaseButton.vue";
import PodCard from "./PodCard.vue";
export default {
  components: { BaseButton, PodCard },
};
</script>

<style lang="scss">
.PodCategoryCard {
  .sectionHeading {
    width: 100%;
    gap: 0px;
  }
}
</style>