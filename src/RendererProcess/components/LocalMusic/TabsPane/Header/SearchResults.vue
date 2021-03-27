<template>
  <div class="searchResults">
    <img
      id="closeSearch"
      @click="closeSearch"
      src="@/RendererProcess/assets/images/x.svg"
      alt
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
import { mapMutations } from "vuex";

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

<style lang="scss">
.searchResults {
  position: absolute;
  bottom: -5px;
  transform: translateY(100%);
  width: 97%;
  padding: 10px;
  max-height: 600px;
  background-color: rgba(0, 0, 0, 0.507);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.315);
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
  overflow: hidden;
  #closeSearch {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 15px;
    cursor: pointer;
  }
  h3 {
    padding: 5px;
  }
  hr {
    height: 1px;
    background: rgba(255, 255, 255, 0.377);
    border: none;
    margin-bottom: 5px;
  }
  .groupCard {
    width: 90px;
    img {
      width: 50px;
    }
    .groupedCard_info {
      .groupedInfo_title {
        max-width: 90px;
      }
      .groupedInfo_subtitle {
        max-width: 90px;
      }
    }
  }
}
</style>