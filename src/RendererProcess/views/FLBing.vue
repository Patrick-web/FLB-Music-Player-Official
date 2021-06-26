<template>
  <div class="FLBing">
    <div class="main_content">
      <div :class="['SearchArea']">
        <bing-search-bar
          ref="searchBar"
          :searchInProgress="searchInProgress"
          :searchIsComplete="searchDone"
          v-on:searchQuery="makeSearch"
          v-on:clearSearch="clearSearchResults"
        />
        <bing-recommender
          v-on:selectedRecommendedArtist="setSelectedRecommendedArtist"
          v-if="!searchDone"
        />
      </div>
      <tabs-view :class="[!searchDone ? 'hide_this' : '', 'SearchResults']">
        <tab-wrapper title="Deezex">
          <deezer-page
            v-on:selectedArtist="setSelectedArtist"
            v-on:selectedAlbum="setSelectedAlbum"
            v-on:searchDone="searchDone = true"
            v-on:searchInProgress="searchInProgress = true"
            ref="deezerPage"
          />
        </tab-wrapper>
        <tab-wrapper title="YouTube">
          <youtube-page
            v-on:searchDone="searchDone = true"
            v-on:searchInProgress="searchInProgress = true"
            ref="youtubePage"
          />
        </tab-wrapper>
      </tabs-view>
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
import DeezerPage from "@/RendererProcess/components/FLBing/DeezerPage.vue";
import DownloadsWidget from "../components/FLBing/DownloadsWidget.vue";
import { mapMutations } from "vuex";
import DownloadWidgetToggle from "../components/FLBing/DownloadWidgetToggle.vue";
import BingRecommender from "../components/FLBing/BingRecommender.vue";
import YoutubePage from "../components/FLBing/YoutubePage.vue";
import TabsView from "../components/BaseComponents/BaseTabView/TabsView.vue";
import TabWrapper from "../components/BaseComponents/BaseTabView/TabWrapper.vue";
import BingSearchBar from "../components/FLBing/BingSearchBar.vue";
export default {
  data() {
    return {
      searchDone: false,
      searchInProgress: false,
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
    clearSearchResults() {
      this.searchDone = false;
      this.searchInProgress = false;
    },
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
    makeSearch(query) {
      this.$refs.youtubePage.searchInYoutube(query);
      this.$refs.deezerPage.searchInDeezer(query);
    },
  },
  components: {
    ArtistPage,
    AlbumPage,
    DownloadsWidget,
    DownloadWidgetToggle,
    BingRecommender,
    DeezerPage,
    YoutubePage,
    TabWrapper,
    TabsView,
    BingSearchBar,
  },
};
</script>

<style lang="scss">
.FLBing {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  .SearchArea {
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.295);
    text-align: center;
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
.SearchResults {
  height: 90%;
  width: 100%;
  border-radius: 15px;
  position: relative;
  .tab {
    width: 97%;
    height: 85.5%;
  }
}
</style>
