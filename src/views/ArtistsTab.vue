<template>
  <div class="tab grouperTab">
    <TrackCard v-if="0" />
    <div v-if="artists.length == 0" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div v-if="!selectedGroup" class="groupCards">
      <div
        v-for="artist in artists"
        :key="artist.name"
        @click="selectGroup(artist)"
        class="groupCard"
      >
        <img
          v-if="artist.picture"
          class="coverArt"
          :src="artist.picture"
          alt=""
        />
        <img
          v-if="!artist.picture"
          class="coverArt"
          src="@/assets/images/FLBDefaultArtistPic.png"
          alt=""
          style="border-radius: 10%"
        />
        <p class="tracksCount">
          {{ artist.tracks.length }}
        </p>
        <div class="groupedCard_info">
          <p class="groupedInfo_title">
            {{ artist.name }}
          </p>
        </div>
      </div>
    </div>
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <div v-if="selectedGroup" class="selectedGroup">
        <div class="sliverBar">
          <div class="sliverBarActions">
            <button @click="playAll" class="btWithIcon">
              <img src="@/assets/images/playnext.svg" alt="" />
              <p>Play All</p>
            </button>
            <button @click="addTracksToQueue" class="btWithIcon">
              <img src="@/assets/images/queue-music.svg" alt="" />
              <p>Add To Queue</p>
            </button>
          </div>
          <button
            @click="deSelectGroup()"
            class="iconBt backToUnfilteredItems"
            style="margin-top: 20px"
          >
            <img src="@/assets/images/back.svg" alt="" />
          </button>
          <img
            v-if="selectedGroup.picture"
            class="coverArt"
            :src="artist.picture"
            alt=""
          />
          <img
            v-if="!selectedGroup.picture"
            class="coverArt"
            src="@/assets/images/FLBDefaultArtistPic.png"
            alt=""
          />
          <img
            v-if="selectedGroup.picture"
            class="coverArt"
            :src="artist.picture"
            alt=""
            id="blurred"
          />
          <img
            v-if="!selectedGroup.picture"
            class="coverArt"
            src="@/assets/images/FLBDefaultArtistPic.png"
            alt=""
            id="blurred"
          />
          <div class="groupedCard_info">
            <p class="groupedInfo_title">
              {{ selectedGroup.name }}
            </p>
            <p class="artist">
              {{ selectedGroup.tracks.artist }}
            </p>
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
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import TrackCard from "@/components/Widgets/TrackCard.vue";

export default {
  data() {
    return {
      card: TrackCard,
    };
  },
  methods: {
    ...mapMutations([
      "addSelectedTrackToCustomQueue",
      "addToSelectedTracks",
      "switchSidePaneTab",
      "clearSelectedTracks",
      "selectGroup",
      "deSelectGroup",
      "setPlayingTrack",
      "overWriteCustomQueue",
      "pushNotification",
    ]),
    ...mapActions(["generateArtistsData"]),
    addTracksToQueue() {
      this.switchSidePaneTab("CustomQueue");
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
        title: "Playing all tracks from",
        subTitle: this.selectedGroup.name,
        type: "normal",
      });
    },
  },
  computed: {
    artists() {
      return this.$store.state.TabsManager.tabsData.artists;
    },
    selectedGroup() {
      return this.$store.state.TrackSelector.selectedGroup;
    },
    renderedTracks() {
      return this.$store.state.renderedTracks;
    },
  },
  components: {
    TrackCard,
  },
  mounted() {
    this.generateArtistsData();
  },
};
</script>

<style lang="scss"></style>
