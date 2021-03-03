<template>
  <div @click="getArtistData" class="squareCard artistCard">
    <div class="thumbnailArea">
      <img :src="artistInfo.picture" alt />
    </div>
    <div class="cardInfo">
      <h4 class="artistName">{{ artistInfo.name }}</h4>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  mounted() {},
  data() {
    return {
      artistData: {
        name: null,
        cover: null,
        tracks: [],
        albums: [],
      },
    };
  },
  methods: {
    ...mapMutations(["setBingArtistInfo"]),
    getArtistData() {
      document.body.classList.add("loading");
      let requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.deezer.com/artist/${this.artistInfo.id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.artistData.name = JSON.parse(result).name;
          this.artistData.cover = JSON.parse(result).picture_big;
          fetch(
            `https://api.deezer.com/artist/${this.artistInfo.id}/top?limit=50`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              this.artistData.tracks = JSON.parse(result).data;
            })
            .catch((error) => console.log("error", error));
          fetch(
            `https://api.deezer.com/artist/${this.artistInfo.id}/albums`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              this.artistData.albums = JSON.parse(result).data;
              this.setBingArtistInfo(this.artistData);
              document.body.classList.remove("loading");
            })
            .catch((error) => console.log("error", error));
        })
        .catch((error) => console.log("error", error));
    },
  },
  props: {
    artistInfo: Object,
  },
};
</script>

<style lang="scss">
.artistCard {
  height: 200px;
  width: 200px;
  border: 0px solid rgb(255, 255, 255);
  .artistName {
    font-size: 0.9em;
    text-align: center;
  }
}
.artistCard:hover {
  .cardInfo {
    box-shadow: none;
  }
}
</style>
