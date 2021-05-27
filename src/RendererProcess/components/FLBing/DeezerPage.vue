<template>
  <div class="deezerResults">
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
import { removeDuplicates } from "@/sharedUtilities";
import AlbumCard from "./BingAlbumCard.vue";
import ArtistCard from "./BingArtistCard.vue";
import Track from "./BingTrack.vue";

export default {
  components: { AlbumCard, ArtistCard, Track },
  data() {
    return {
      searchResults: {
        tracks: [],
        artists: [],
        albums: [],
      },
    };
  },
  methods: {
    bubbleArtist(artistData) {
      this.$emit("selectedArtist", artistData);
    },
    bubbleAlbum(albumData) {
      this.$emit("selectedAlbum", albumData);
      console.log("Sending...");
      console.table(albumData);
    },
    searchInDeezer(query) {
      this.notifySearchInProgress();
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`https://api.deezer.com/search?q=${query}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.searchResults.tracks = JSON.parse(result).data;
        })
        .catch((error) => console.log("error", error));

      fetch(`https://api.deezer.com/search?q=artist:"${query}"`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.searchResults.artists = removeDuplicates(
            JSON.parse(result).data.map((track) => track.artist),
            "id"
          );
          console.log(this.searchResults);
        })
        .catch((error) => console.log("error", error));
      //api.deezer.com/search?q=artist:"aloe blacc"
      fetch(`https://api.deezer.com/search?q=album:"${query}"`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const albums = JSON.parse(result).data.map((track) => track.album);
          this.searchResults.albums = removeDuplicates(albums, "id");
          this.notifySearchFinished();
        })
        .catch((error) => {
          this.notifySearchFinished();
        });
    },
    notifySearchInProgress() {
      this.$emit("searchInProgress");
    },
    notifySearchFinished() {
      this.$emit("searchDone");
    },
  },
};
</script>

<style lang="scss">
.playingPaneLoaded {
  .results {
    height: 68vh;
  }
}
.deezerResults {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: flex-start;
}
.results {
  height: 78vh;
  padding-top: 30px;
  .contentsWrapper {
    height: 93%;
    overflow: hidden;
    overflow-y: scroll;
    align-items: center;
    justify-content: center;
  }
  h2 {
    font-size: 1.2rem;
    padding: 5px;
    padding-left: 10px;
    z-index: 3;
    text-align: center;
  }
}
</style>
