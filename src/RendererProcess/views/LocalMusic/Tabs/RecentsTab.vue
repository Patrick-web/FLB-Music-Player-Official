<template>
  <div class="tab recentsTab">
    <TrackCard
      v-for="track in recentlyPlayedTracks"
      :source="track"
      :key="track.fileLocation"
      :index="0"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";

export default {
  data() {
    return {
      card: TrackCard,
    };
  },
  computed: {
    ...mapState(["tabsData"]),
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
.recentsTab {
  overflow: hidden;
  overflow-y: scroll;
  height: 64vh;
}
</style>
