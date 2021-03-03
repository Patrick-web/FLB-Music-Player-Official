<template>
  <div class="FLBing">
    <div v-if="!resultsGotten" class="SearchArea">
      <h1>FLBing</h1>
      <input
        placeholder="Search, Select, Download"
        type="text"
        class="BigSearch inputElem"
        v-model="query"
        v-on:keyup.enter="search"
      />
    </div>
    <div v-if="resultsGotten" @click="reset" class="backToSearch">
      <img src="@/assets/images/back.svg" alt="" />
    </div>
    <div v-if="!resultsGotten && searching" class="loadingArea">
      <div style="margin-left:20px" class="loadingIndicator"></div>
    </div>

    <SearchResults v-if="resultsGotten && !bingArtistInfo" />
    <ArtistPage v-if="bingArtistInfo" />
    <AlbumPage v-if="bingAlbumInfo" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ArtistPage from "@/components/FLBing/ArtistPage.vue";
import AlbumPage from "@/components/FLBing/AlbumPage.vue";
import SearchResults from "@/components/FLBing/SearchResults.vue";
export default {
  data() {
    return {
      query: "",
      resultsGotten: false,
      searching: false,
    };
  },
  computed: {
    ...mapGetters(["bingArtistInfo", "bingAlbumInfo"]),
  },
  methods: {
    ...mapMutations([
      "setBingAlbums",
      "setBingArtists",
      "setBingTracks",
      "setBingArtistInfo",
      "setBingAlbumInfo",
    ]),
    reset() {
      this.setBingArtistInfo(null);
      this.setBingAlbumInfo(null);
      this.resultsGotten = false;
      this.$emit("goFullflbing", false);
    },
    hideModal() {
      document.querySelector(".FLBing").style.display = "none";
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
          this.setBingTracks(JSON.parse(result).results);
          this.$emit("goFullflbing", true);
        })
        .catch((error) => console.log("error", error));

      fetch(
        `https://apiflbdeezer.herokuapp.com/search/?category=artists&query=${this.query}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.setBingArtists(JSON.parse(result).results.slice(0, 6));
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
          this.setBingAlbums(JSON.parse(result).results.slice(0, 18));
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
  .backToSearch {
    position: fixed;
    z-index: 10;
    top: 10px;
    left: 35%;
    transform: translateX(-50%);
    background: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
    img {
      width: 20px;
    }
  }
  .backToSearch:hover {
    filter: invert(1);
  }
  .SearchArea {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    margin-top: -100px;
    margin-bottom: 10px;
    text-align: center;
  }
  .BigSearch {
    width: 90%;
    padding: 20px;
    border-radius: 40px;
    outline: none;
    border: none;
    background: rgb(0, 0, 0);
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
