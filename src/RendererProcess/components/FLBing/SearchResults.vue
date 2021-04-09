<template>
  <div class="SearchResults">
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
      <div class="grid2 contentsWrapper">
        <ArtistCard
          v-on:selectedArtist="$emit('selectedArtist', artist)"
          v-for="artist in searchResults.artists"
          :key="artist.id"
          :artistInfo="artist"
        />
      </div>
    </div>
    <div v-if="searchResults.albums.length" class="results albumResults">
      <h2>Albums</h2>
      <div class="grid2 contentsWrapper">
        <AlbumCard
          v-on:selectedAlbum="$emit('selectedAlbum', album)"
          v-for="album in searchResults.albums"
          :key="album.id"
          :albumInfo="album"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlbumCard from "./AlbumCard.vue";
import ArtistCard from "./ArtistCard.vue";
import Track from "./Track.vue";
export default {
  components: { AlbumCard, ArtistCard, Track },
  props: {
    searchResults: Object,
  },
};
</script>

<style lang="scss">
.SearchResults {
  padding: 10px;
  padding-top: 50px;
  overflow: hidden;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
.results {
  .contentsWrapper {
    max-height: 80vh;
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
