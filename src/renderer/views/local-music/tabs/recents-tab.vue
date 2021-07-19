<template>
  <div class="tab RecentsTab">
    <div
      v-if="recentlyPlayedTracks.length === 0"
      class="centerContents"
      style="height: 100%"
    >
      <img
        width="300px"
        src="@img/no_recents.svg"
      >
      <p style="font-family: inherit">
        You still haven't played anything
      </p>
    </div>
    <track-card
      v-for="track in recentlyPlayedTracks"
      :key="track.fileLocation"
      :source="track"
      :index="0"
    />
  </div>
</template>
<script>
export default {
  name: 'RecentsTab',

  data() {
    return {};
  },
  computed: {
    recentlyPlayedTracks() {
      return this.$store.state.TabsManager.tabsData.recentlyPlayedTracks;
    }
  }
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
