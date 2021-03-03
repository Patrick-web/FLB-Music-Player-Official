<template>
  <div class="SearchResults">
    <div class="results trackResults">
      <h2>Tracks</h2>
      <div class="column">
        <Track v-for="track in bingTracks" :key="track.id" :trackInfo="track" />
      </div>
    </div>
    <div class="aResults">
      <div class="results artistResults">
        <h2>Artists</h2>
        <div class="grid3_30">
          <ArtistCard
            v-for="artist in bingArtists"
            :key="artist.id"
            :artistInfo="artist"
          />
        </div>
      </div>
      <div class="results albumResults">
        <h2>Albums</h2>
        <div class="grid3">
          <AlbumCard
            v-for="album in bingAlbums"
            :key="album.id"
            :albumInfo="album"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AlbumCard from "./AlbumCard.vue";
import ArtistCard from "./ArtistCard.vue";
import Track from "./Track.vue";
export default {
  components: { AlbumCard, ArtistCard, Track },
  computed: {
    ...mapGetters(["bingTracks", "bingAlbums", "bingArtists"]),
  },
  methods: {},
};
</script>

<style lang="scss">
.SearchResults {
  padding: 10px;
  overflow: hidden;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.results {
  margin-bottom: 20px;
  h2 {
    margin-bottom: 10px;
  }
}
</style>
