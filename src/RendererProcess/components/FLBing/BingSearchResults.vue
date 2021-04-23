<template>
  <div class="SearchResults bg2">
    <div
      v-if="
        !searchResults.tracks.length &&
        !searchResults.albums.length &&
        !searchResults.artists.length
      "
      class="centerContents"
      style="height: 100%; width: 300%"
    >
      <h1 id="noBingResults">No Results Found</h1>
    </div>

    <div v-if="searchResults.tracks.length" class="results trackResults">
      <h2>Tracks</h2>
      <div class="column contentsWrapper">
        <Track
          v-for="track in searchResults.tracks"
          :key="track.id"
          :trackInfo="track"
        />
      </div>
    </div>
    <div v-if="searchResults.artists.length" class="results artistResults">
      <h2>Artists</h2>
      <div class="flex_auto contentsWrapper">
        <ArtistCard
          v-on:selectedArtist="bubbleArtist"
          v-for="artist in searchResults.artists"
          :key="artist.id"
          :artistInfo="artist"
        />
      </div>
    </div>
    <div v-if="searchResults.albums.length" class="results albumResults">
      <h2>Albums</h2>
      <div class="flex_auto contentsWrapper">
        <AlbumCard
          v-on:selectedAlbum="bubbleAlbum"
          v-for="album in searchResults.albums"
          :key="album.id"
          :albumInfo="album"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlbumCard from "./BingAlbumCard.vue";
import ArtistCard from "./BingArtistCard.vue";
import Track from "./BingTrack.vue";
export default {
  components: { AlbumCard, ArtistCard, Track },
  methods: {
    bubbleArtist(artistData) {
      this.$emit("selectedArtist", artistData);
    },
    bubbleAlbum(albumData) {
      this.$emit("selectedAlbum", albumData);
      console.log("Sending...");
      console.table(albumData);
    },
  },
  props: {
    searchResults: Object,
  },
};
</script>

<style lang="scss">
.SearchResults {
  padding: 10px;
  margin-top: 30px;
  overflow: hidden;
  height: 87%;
  width: 97.5%;
  border-radius: 15px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: flex-start;
}
.playingPaneLoaded {
  .results {
    height: 68vh;
  }
}
.results {
  height: 78vh;
  .contentsWrapper {
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
  }
  h2 {
    font-size: 1.2rem;
    padding: 5px;
    padding-left: 10px;
    position: sticky;
    z-index: 3;
    top: 0px;
    text-align: center;
  }
}
</style>
