<template>
  <div class="searchResults" v-if="query">
    <img
      id="closeSearch"
      @click="query = ''"
      src="@/RendererProcess/assets/images/x.svg"
      alt
      v-if="query"
    />
    <div class="TracksResults">
      <h3>Tracks</h3>
      <TrackCard
        v-for="track in searchResults.tracks"
        :key="track.fileLocation"
        :source="track"
        :index="0"
      />
    </div>
    <hr />
    <div class="ArtistResults grouperTab">
      <h3>Artists</h3>
      <div
        v-if="searchResults.artists.length > 0"
        class="groupCards"
        style="height: 120px; overflow: hidden"
      >
        <div
          v-for="artist in searchResults.artists"
          :key="artist.name"
          @click="goToArtist(artist)"
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
            src="@/RendererProcess/assets/images/FLBDefaultArtistPic.png"
            alt=""
            style="border-radius: 50%"
          />
          <p class="tracksCount">
            {{ artist.tracks.length }}
          </p>
          <div class="groupedCard_info">
            <p class="groupedInfo_title" style="text-align: center">
              {{ artist.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";

export default {
  computed: {
    searchResults() {
      return this.$store.state.SearchManager.searchResults;
    },
  },
  methods: {
    ...mapMutations(["search", "selectGroup", "clearSelectedTracks"]),
    goToArtist(artist) {
      document.querySelector("#Artists").click();
      this.selectGroup(artist);
      this.closeSearch();
    },
    goToAlbum(album) {
      document.querySelector("#Albums").click();
      this.selectGroup(album);
      this.closeSearch();
    },
    closeSearch() {
      this.$emit("closeSearch");
    },
  },
  components: {
    TrackCard,
  },
};
</script>

<style>
</style>