<template>
  <div class="tab RecentsTab">
    <div
      v-if="recentlyPlayedTracks.length == 0"
      class="centerContents"
      style="height: 100%"
    >
      <img width="300px" src="@/RendererProcess/assets/images/no_recents.svg" />
      <p style="font-family: roboto-thin">You still haven't played anything</p>
    </div>
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
  padding-right: 10px;
}
</style>
