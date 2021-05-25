<template>
  <div class="FLBing">
    <div class="main_content">
      <div class="filler"></div>
      <div :class="[resultsGotten ? 'shrinkToTop' : '', 'SearchArea']">
        <img
          class="animated fadeInUp"
          src="@/RendererProcess/assets/images/flbing.svg"
          id="flbingLogo"
          v-if="!resultsGotten"
        />
        <h1
          v-if="!resultsGotten"
          style="font-size: 2.5rem"
          class="animated fadeInUp"
        >
          FLBING
        </h1>
        <input
          placeholder="Search and Download Music"
          type="text"
          class="BigSearch inputElem animated fadeInUp"
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
        <div
          id="fetchIndicator"
          v-if="searching"
          class="loadingIndicator"
        ></div>
        <bing-recommender
          v-on:selectedRecommendedArtist="setSelectedRecommendedArtist"
          v-if="!resultsGotten"
        />
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
    </div>
    <downloads-widget />
    <download-widget-toggle />
  </div>
</template>

<script>
import ArtistPage from "@/RendererProcess/components/FLBing/BingArtistPage.vue";
import AlbumPage from "@/RendererProcess/components/FLBing/BingAlbumPage.vue";
import SearchResults from "@/RendererProcess/components/FLBing/BingSearchResults.vue";
import DownloadsWidget from "../components/FLBing/DownloadsWidget.vue";
import { mapMutations } from "vuex";
import { removeDuplicates } from "@/sharedUtilities";
import DownloadWidgetToggle from "../components/FLBing/DownloadWidgetToggle.vue";
import BingRecommender from "../components/FLBing/BingRecommender.vue";
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
  computed: {
    appIsOnline() {
      return this.$store.state.appIsOnline;
    },
  },
  methods: {
    ...mapMutations(["pushNotification"]),
    setSelectedArtist(payload) {
      this.selectedArtist = payload;
    },
    setSelectedRecommendedArtist(payload) {
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
      if (!this.appIsOnline) {
        this.pushNotification({
          title: `No internet connection detected`,
          subTitle: null,
          type: "danger",
        });
        return;
      }
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
  components: {
    SearchResults,
    ArtistPage,
    AlbumPage,
    DownloadsWidget,
    DownloadWidgetToggle,
    BingRecommender,
  },
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
  position: relative;
  .filler {
    height: 20%;
  }
  .shrinkToTop {
    transform: translateY(-140px) !important;
    margin-bottom: -160px;

    #fetchIndicator {
      right: -5px !important;
      top: 60% !important;
      transform: scale(0.8) translateY(-40px) !important;
    }
    .BigSearch {
      font-size: var(--baseFontSize);
      padding: 10px;
    }
  }
  .SearchArea {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-50px);
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
      transform: scale(1) translateY(-10px) translateX(20px);
      opacity: 0.7;
    }
  }
  h1 {
    text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.295);
    text-align: center;
  }
  .BigSearch {
    width: 100%;
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

#flbingLogo {
  width: 50px;
}
.main_content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
// #flbingLogoOutline {
//   stroke-dasharray: 174;
//   stroke-dashoffset: 174;
//   // animation-name: animatedash;
//   animation-fill-mode: forwards;
//   animation-duration: 4s;
//   animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
// }
// @keyframes animatedash {
//   to {
//     stroke-dashoffset: 0;
//     stroke-dasharray: 0;
//   }
// }
</style>
