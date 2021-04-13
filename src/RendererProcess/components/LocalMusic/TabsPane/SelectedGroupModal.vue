<template>
  <div class="selectedGroup">
    <button
      @click="deSelectGroup()"
      class="iconBt backToUnfilteredItems"
      style="margin-top: 20px"
    >
      <img src="@/RendererProcess/assets/images/back.svg" alt="" />
    </button>
    <div class="sliverBar">
      <div class="sliverBarActions">
        <button @click="playAll" class="btWithIcon">
          <img src="@/RendererProcess/assets/images/playnext.svg" alt="" />
          <p>Play All</p>
        </button>
        <button @click="addTracksToQueue" class="btWithIcon">
          <img src="@/RendererProcess/assets/images/queue-music.svg" alt="" />
          <p>Add To Queue</p>
        </button>
      </div>
      <img class="coverArt" :src="selectedGroup.tracks[0].albumArt" alt="" />
      <img id="blurred" :src="selectedGroup.tracks[0].albumArt" alt="" />
      <div class="groupedCard_info">
        <p class="groupedInfo_title">
          {{ selectedGroup.name }}
        </p>
        <p class="artist">{{ selectedGroup.artist }}</p>
      </div>
    </div>
    <div class="cardsWrapper">
      <TrackCard
        v-for="(track, index) in selectedGroup.tracks"
        :key="track.path"
        :index="index"
        :source="track"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import AlbumCard from "@/RendererProcess/components/LocalMusic/TabsPane/AlbumsTab/AlbumCard.vue";

export default {
  methods: {
    ...mapMutations([
      "addSelectedTrackToCustomQueue",
      "addToSelectedTracks",
      "UIcontrollerSetPropertyValue",
      "clearSelectedTracks",
      "selectGroup",
      "deSelectGroup",
      "setPlayingTrack",
      "overWriteCustomQueue",
      "pushNotification",
    ]),
    ...mapActions(["generateAlbumsData"]),
    addTracksToQueue() {
      this.UIcontrollerSetPropertyValue({
        property: "currentSidePaneTab",
        newValue: "Queue",
      });
      this.clearSelectedTracks();
      this.selectedGroup.tracks.forEach((track) => {
        this.addToSelectedTracks(track);
      });
      this.addSelectedTrackToCustomQueue();
      this.pushNotification({
        title: "Tracks addded to the queue",
        subTitle: null,
        type: "normal",
      });
    },
    playAll() {
      this.setPlayingTrack({ track: this.selectedGroup.tracks[0], index: 0 });
      this.overWriteCustomQueue(this.selectedGroup.tracks);
      this.pushNotification({
        title: `Playing ${this.selectedGroup.name} album`,
        subTitle: null,
        type: "normal",
      });
    },
  },
  computed: {
    albums() {
      return this.$store.state.TabsManager.tabsData.albums;
    },
    selectedGroup() {
      return this.$store.state.TrackSelector.selectedGroup;
    },
  },
  components: {
    TrackCard,
    AlbumCard,
  },
  mounted() {
    this.generateAlbumsData();
  },
};
</script>

<style lang="scss"></style>
