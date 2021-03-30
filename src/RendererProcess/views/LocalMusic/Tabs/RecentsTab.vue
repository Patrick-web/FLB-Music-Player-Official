<template>
  <div class="tab RecentsTab">
    <TrackCard
      v-for="track in recentlyPlayedTracks"
      :source="track"
      :key="track.fileLocation"
      :index="0"
    />
  </div>
</template>
<script>
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";

export default {
  data() {
    return {
      card: TrackCard,
    };
  },
  computed: {
    recentlyPlayedTracks() {
      return this.$store.state.TabsManager.tabsData.recentlyPlayedTracks;
    },
  },
  components: {
    TrackCard,
  },
};
</script>

<style>
.RecentsTab {
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
}
</style>
