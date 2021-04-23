<template>
  <div class="FLBing">
    <h1 v-if="!resultsGotten" style="font-size: 2.5rem">FLBING</h1>
    <div :class="[resultsGotten ? 'shrinkToTop' : '', 'SearchArea']">
      <input
        placeholder="Search and Download Music"
        type="text"
        class="BigSearch inputElem"
        id="bingSearch"
        v-model="query"
        v-on:keyup.enter="search"
      />
      <p id="bingEnter" style="opacity: 0" @click="search"></p>
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
    <transition
      enter-active-class="animated slideInUp extrafaster"
      leave-active-class="animated slideOutDown extrafaster"
    >
      <ArtistPage
        v-on:clearArtistResults="clearSelectedArtistOrAlbum('artist')"
        v-on:selectedAlbum="setSelectedAlbum"
        :artistInfo="selectedArtist"
        v-if="selectedArtist"
      />
    </transition>
    <transition
      enter-active-class="animated slideInUp extrafaster"
      leave-active-class="animated slideOutDown extrafaster"
    >
      <AlbumPage
        v-on:clearAlbumResults="clearSelectedArtistOrAlbum('album')"
        :albumInfo="selectedAlbum"
        v-if="selectedAlbum"
      />
    </transition>
    <downloads-widget />
  </div>
</template>

<script>
import ArtistPage from "@/RendererProcess/components/FLBing/BingArtistPage.vue";
import AlbumPage from "@/RendererProcess/components/FLBing/BingAlbumPage.vue";
import SearchResults from "@/RendererProcess/components/FLBing/BingSearchResults.vue";
import DownloadsWidget from "../components/FLBing/DownloadsWidget.vue";
import { mapMutations } from "vuex";
import { removeDuplicates } from "@/sharedUtilities";
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
    ...mapMutations(["pushNotification"]),
    setSelectedArtist(payload) {
      this.selectedArtist = payload;
    },
    setSelectedAlbum(payload) {
      this.selectedAlbum = payload;
    },
    clearSelectedArtistOrAlbum(target) {
      if (target === "artist") {
        this.selectedArtist = null;
        return;
      }
      this.selectedAlbum = null;
    },
    clearResults() {
      this.results.tracks = [];
      this.results.artists = [];
      this.results.albums = [];
      this.resultsGotten = false;
    },
    search() {
      if (!this.query) this.query = document.querySelector("#bingSearch").value;
      this.searching = true;
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`https://api.deezer.com/search?q=${this.query}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.results.tracks = JSON.parse(result).data;
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://api.deezer.com/search?q=artist:"${this.query}"`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.results.artists = removeDuplicates(
            JSON.parse(result).data.map((track) => track.artist),
            "id"
          );
        })
        .catch((error) => console.log("error", error));
      //api.deezer.com/search?q=artist:"aloe blacc"
      fetch(
        `https://api.deezer.com/search?q=album:"${this.query}"`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const albums = JSON.parse(result).data.map((track) => track.album);
          this.results.albums = removeDuplicates(albums, "id");
          this.resultsGotten = true;
          this.searching = false;
        })
        .catch((error) => console.log("error", error));
    },
  },
  mounted() {
    if (!navigator.onLine) {
      this.pushNotification({
        title: `No internet connection detected`,
        subTitle: null,
        type: "danger",
      });
    }
  },
  components: { SearchResults, ArtistPage, AlbumPage, DownloadsWidget },
};
</script>

<style lang="scss">
.playingPaneLoaded {
  .FLBing {
    height: 86%;
  }
}
.FLBing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  .shrinkToTop {
    top: 0% !important;
    left: 50% !important;
    transform: translateX(-50%) translateY(-5%) !important;
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
      bottom: 12px;
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
