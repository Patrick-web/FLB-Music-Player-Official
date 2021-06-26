<template>
  <div class="Podcasts">
    <div class="flex gap10">
      <div class="pod_pane pod_center_pane bg2">
        <pod-header />
        <pod-category-card />
      </div>
      <pod-side-pane />
    </div>
  </div>
</template>

<script>
import PodSidePane from "@/RendererProcess/components/Podcasts/PodSidePane.vue";
import PodHeader from "@/RendererProcess/components/Podcasts/PodHeader.vue";
import PodCategoryCard from "@/RendererProcess/components/Podcasts/PodCategoryCard.vue";
export default {
  components: {
    PodSidePane,
    PodHeader,
    PodCategoryCard,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    search() {
      console.log(this.searchQuery);
    },
  },
};
</script>

<style lang="scss">
.Podcasts {
  width: 100%;
  align-items: flex-start;
}
.pod_center_pane {
  width: 100%;
}
.playingPaneLoaded {
  .pod_pane {
    height: 77vh;
  }
}
.pod_pane {
  height: 90vh;
  padding: 10px;
  border-radius: 20px;
}
</style>