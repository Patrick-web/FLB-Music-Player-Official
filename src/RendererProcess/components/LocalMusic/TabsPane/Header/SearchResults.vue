<template>
  <div class="searchResults blurred_bg blur20 no_scroll">
    <base-button
      id="closeSearch"
      :icon="require('@/RendererProcess/assets/images/x.svg')"
      @click.native="closeSearch"
      :small="true"
      :tiny="true"
      color="rgba(255, 255, 255, 0.1)"
    />
    <div class="TracksResults">
      <div class="sectionHeading">
        <h3>Tracks</h3>
        <div class="line"></div>
        <h4>{{ searchResults.tracks.length }}</h4>
      </div>
      <div
        style="max-height: 200px; overflow: hidden; overflow-y: scroll"
        class="trackResults"
      >
        <TrackCard
          v-for="track in searchResults.tracks"
          :key="track.fileLocation"
          :source="track"
          :index="0"
        />
      </div>
    </div>
    <hr />
    <div
      @click="closeSearch"
      class="ArtistResults groupedContentTab"
      style="padding: 0px"
    >
      <div class="sectionHeading">
        <h3>Artists</h3>
        <div class="line"></div>
        <h4>{{ searchResults.artists.length }}</h4>
      </div>
      <div
        v-if="searchResults.artists.length > 0"
        class="grid_auto"
        style="max-height: 160px; overflow: hidden; overflow-y: scroll"
      >
        <ArtistCard
          v-for="artist in searchResults.artists"
          :key="artist.name"
          :artist="artist"
        />
      </div>
    </div>
    <div @click="closeSearch" class="AlbumResults groupedContentTab">
      <div class="sectionHeading">
        <h3>Albums</h3>
        <div class="line"></div>
        <h4>{{ searchResults.albums.length }}</h4>
      </div>
      <div
        v-if="searchResults.albums.length > 0"
        class="grid_auto"
        style="max-height: 150px; overflow: hidden; overflow-y: scroll"
      >
        <AlbumCard
          v-for="album in searchResults.albums"
          :key="album.name"
          :album="album"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import ArtistCard from "@/RendererProcess/components/LocalMusic/TabsPane/ArtistTab/ArtistCard.vue";
import AlbumCard from "../AlbumsTab/AlbumCard.vue";
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
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
    ArtistCard,
    AlbumCard,
    BaseButton,
  },
};
</script>

<style lang="scss">
.searchResults {
  position: absolute;
  bottom: -5px;
  left: -7px;
  transform: translateY(100%);
  min-width: 61vw;
  max-width: 70vw;
  max-height: 85vh;
  padding: 10px;
  padding-bottom: 0px;
  border: 1px solid rgba(255, 255, 255, 0.315);
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
  #closeSearch {
    position: absolute;
    left: 63%;
    top: -42px;
    border-radius: 50%;
    img {
      transform: scale(0.8);
    }
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
    transform: scale(0.8) translateY(-25px);
  }
}
@media (max-width: 900px) {
  .searchResults {
    width: 86vw !important;
    max-width: 86vw !important;
  }
}
</style>