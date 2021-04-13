<template>
  <div class="FLBing">
    <h1 v-if="!resultsGotten" style="font-size: 2.5rem">FLBING</h1>
    <div :class="[resultsGotten ? 'shrinkToTop' : '', 'SearchArea']">
      <input
        placeholder="Search and Download Music"
        type="text"
        class="BigSearch inputElem"
        v-model="query"
        v-on:keyup.enter="search"
      />
      <img
        @click.stop="clearResults()"
        src="@/RendererProcess/assets/images/x.svg"
        v-if="resultsGotten"
        id="clearResultsIcon"
      />
      <div id="fetchIndicator" v-if="searching" class="loadingIndicator"></div>
    </div>
    <transition
      enter-active-class="animated slideInUp extrafaster"
      leave-active-class="animated slideOutDown extrafaster"
    >
      <SearchResults
        v-on:selectedArtist="setSelectedArtist"
        v-on:selectedAlbum="setSelectedAlbum"
        v-if="resultsGotten"
        :searchResults="results"
      />
    </transition>
    <ArtistPage :artistInfo="selectedArtist" v-if="selectedArtist" />
    <AlbumPage :albumInfo="selectedAlbum" v-if="selectedAlbum" />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import ArtistPage from "@/RendererProcess/components/FLBing/ArtistPage.vue";
import AlbumPage from "@/RendererProcess/components/FLBing/AlbumPage.vue";
import SearchResults from "@/RendererProcess/components/FLBing/SearchResults.vue";
export default {
  data() {
    return {
      query: "",
      resultsGotten: false,
      searching: false,
      results: {
        tracks: [],
        albums: [],
        artists: [],
      },
      selectedArtist: null,
      selectedAlbum: null,
    };
  },
  methods: {
    ...mapMutations([
      "setBingAlbums",
      "setBingArtists",
      "setBingTracks",
      "setBingArtistInfo",
      "setBingAlbumInfo",
    ]),
    setSelectedArtist(payload) {
      console.log("setSelectedArtis");
      this.selectedArtist = payload;
      console.table(payload);
    },
    setSelectedAlbum(payload) {
      console.log("setSelectedAlbum");
      this.selectedAlbum = payload;
      console.table(payload);
    },
    reset() {
      this.setBingArtistInfo(null);
      this.setBingAlbumInfo(null);
      this.resultsGotten = false;
      this.$emit("goFullflbing", false);
    },
    hideModal() {
      document.querySelector(".FLBing").style.display = "none";
    },
    clearResults() {
      this.results.tracks = [];
      this.results.artists = [];
      this.results.albums = [];
      this.resultsGotten = false;
    },
    search() {
      this.searching = true;
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(
        `https://apiflbdeezer.herokuapp.com/search/?category=tracks&query=${this.query}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.results.tracks = JSON.parse(result).results;
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://apiflbdeezer.herokuapp.com/search/?category=artists&query=${this.query}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.results.artists = JSON.parse(result).results.slice(0, 6);
        })
        .catch((error) => console.log("error", error));
      fetch(
        `https://apiflbdeezer.herokuapp.com/search/?category=albums&query=${this.query}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.searching = false;
          this.resultsGotten = true;
          this.results.albums = JSON.parse(result).results.slice(0, 18);
        })
        .catch((error) => console.log("error", error));
    },
  },
  components: { SearchResults, ArtistPage, AlbumPage },
};
</script>

<style lang="scss">
.FLBing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  .shrinkToTop {
    top: 2% !important;
    left: 50% !important;
    transform: translateX(-50%) translateY(0%) !important;
    width: 60% !important;
    #fetchIndicator {
      right: -5px !important;
      top: 60% !important;
      transform: scale(0.8) translateY(-50%) !important;
    }
    .BigSearch {
      font-size: var(--baseFontSize);
      padding: 10px;
    }
  }
  .SearchArea {
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    #clearResultsIcon {
      position: absolute;
      right: 0px;
      width: 15px;
      bottom: 15px;
      cursor: pointer;
      z-index: 4;
    }
    #fetchIndicator {
      position: absolute;
      right: -15px;
      top: 70%;
      transform: scale(1) translateY(-50%);
    }
  }
  h1 {
    margin-top: -140px;
    text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.295);
    text-align: center;
  }
  .BigSearch {
    width: 90%;
    padding: 20px;
    border-radius: 40px;
    outline: none;
    border: none;
    background: rgba(255, 255, 255, 0.103);
    font-size: 1.2em;
    font-family: roboto-thin;
  }
  .scroller {
    position: fixed;
    z-index: 5;
    top: 8px;
    left: 50%;
    transform: translateX(-80%);
    background: black;
    border-radius: 20px;
    box-shadow: 0px 0px 20px black;

    h4 {
      border-radius: 20px;
      padding: 8px;
      text-align: center;
      cursor: pointer;
    }
    .activeScroll {
      background: rgb(0, 68, 255);
    }
  }
}
</style>
