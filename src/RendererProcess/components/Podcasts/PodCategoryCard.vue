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
  data() {
    return {
      podcasts: [],
      page: 1,
    };
  },
  components: { BaseButton, PodCard },
  methods: {
    fetchPodcasts() {
      const config = {
        method: "get",
        headers: {
          "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
        },
      };
      fetch(
        `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${this.category.id}&page=${this.page}&region=us&safe_mode=0`,
        config
      )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          document.body.classList.remove("fetchingInProgress");
          console.log(error);
        });
    },
    fetchMorePodcasts() {
      this.page += 1;
      this.fetchPodcasts();
    },
  },
  props: {
    category: Object,
  },
};
</script>

<style lang="scss">
.PodCategoryCard {
  .sectionHeading {
    width: 100%;
    gap: 0px;
  }
}
.podCardsWrapper {
  margin-top: 5px;
}
</style>