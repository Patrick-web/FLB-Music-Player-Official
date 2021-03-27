<template>
  <div class="tab grouperTab">
    <TrackCard v-if="0" />
    <div v-if="artists.length == 0" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div v-if="!selectedGroup" class="groupCards">
      <ArtistCard
        v-for="artist in artists"
        :key="artist.name"
        :artist="artist"
      />
    </div>
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <div v-if="selectedGroup" class="selectedGroup">
        <div class="sliverBar">
          <div class="sliverBarActions">
            <button @click="playAll" class="btWithIcon">
              <img src="@/RendererProcess/assets/images/playnext.svg" alt="" />
              <p>Play All</p>
            </button>
            <button @click="addTracksToQueue" class="btWithIcon">
              <img
                src="@/RendererProcess/assets/images/queue-music.svg"
                alt=""
              />
              <p>Add To Queue</p>
            </button>
          </div>
          <button
            @click="deSelectGroup()"
            class="iconBt backToUnfilteredItems"
            style="margin-top: 20px"
          >
            <img src="@/RendererProcess/assets/images/back.svg" alt="" />
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
            src="@/RendererProcess/assets/images/FLBDefaultArtistPic.png"
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
            src="@/RendererProcess/assets/images/FLBDefaultArtistPic.png"
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
          <h1>Albums</h1>
          <div class="albumsGrid">
            <div
              v-for="album in selectedGroup.albums"
              :key="album.name"
              @click="goToAlbum(album)"
              class="groupCard"
            >
              <img
                class="coverArt"
                v-if="album.tracks[0].albumArt"
                :src="album.tracks[0].albumArt"
                alt=""
              />
              <img
                class="coverArt"
                v-if="!album.tracks[0].albumArt"
                src="@/RendererProcess/assets/images/FLBDefaultCover.png"
                alt=""
              />
              <p class="tracksCount">
                {{ album.tracks.length }}
              </p>
              <div class="groupedCard_info">
                <div>
                  <p class="groupedInfo_title">
                    {{ album.name }}
                  </p>
                  <p class="groupedInfo_subtitle">
                    {{ album.tracks[0].artist }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h1>Tracks</h1>
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
import { mapActions, mapMutations } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import ArtistCard from "@/RendererProcess/components/LocalMusic/TabsPane/ArtistTab/ArtistCard.vue";

export default {
  data() {
    return {
      card: TrackCard,
      lastScrollTop: 0,
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
    goToAlbum(album) {
      document.querySelector("#Albums").click();
      this.selectGroup(album);
      this.query = "";
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
    ArtistCard,
    TrackCard,
  },
  mounted() {
    this.generateArtistsData();
  },
};
</script>

<style lang="scss">
.albumsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
