<template>
  <div @click="getAlbumData" class="bing_card groupCard">
    <img class="coverArt" :src="albumInfo.cover" alt />
    <div class="groupedCard_info">
      <p class="groupedInfo_title">
        {{ albumInfo.title }}
      </p>
    </div>
    <div v-if="loading" class="loading">
      <div class="loadingIndicator"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      albumData: {
        name: null,
        cover: null,
        tracks: [],
      },
    };
  },
  methods: {
    getAlbumData() {
      this.loading = true;
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.deezer.com/album/${this.albumInfo.id}/tracks`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const tracks = JSON.parse(result).data;
          const albumData = {
            name: this.albumInfo.title,
            cover: this.albumInfo.cover,
            tracks,
          };
          this.loading = false;
          this.$emit("selectedAlbum", albumData);
        })
        .catch((error) => console.log("error", error));
    },
  },
  props: {
    albumInfo: Object,
  },
};
</script>

<style lang="scss">
</style>
