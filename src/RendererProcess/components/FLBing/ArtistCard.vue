<template>
  <div @click="getArtistData" class="groupCard">
    <img class="coverArt" :src="artistInfo.picture" alt />
    <div class="groupedCard_info">
      <p class="groupedInfo_title">
        {{ artistInfo.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
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
    getArtistData() {
      document.body.classList.add("loading");
      const requestOptions = {
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
              this.$emit("selectedArtist", this.artistData);
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
</style>
