<template>
  <div class="APage">
    <div class="coverArea">
      <img :src="albumInfo.cover" alt="" class="blurred" />
      <img class="artistImage" :src="albumInfo.cover" alt="" />
      <h2>
        <pre>Album</pre>
        {{ albumInfo.name }}
      </h2>
      <img
        @click="$emit('closeArtist')"
        id="closePage"
        src="@/RendererProcess/assets/images/x.svg"
      />
    </div>
    <div>
      <div class="results trackResults">
        <h2>Tracks</h2>
        <div class="column">
          <Track
            v-for="track in tracks"
            :key="track.id"
            :trackInfo="track"
            :overideCoverArt="albumInfo.cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import AlbumCard from "./AlbumCard.vue";
import Track from "./Track.vue";
export default {
  data() {
    return {
      tracks: [],
    };
  },
  components: {
    // AlbumCard,
    Track,
  },
  methods: {
    fetchTracks() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      console.table(this.albumInfo);
      fetch(this.albumInfo.tracklist, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.tracks = JSON.parse(result).data;
        })
        .catch((error) => console.log("error", error));
    },
  },
  props: {
    albumInfo: Object,
  },
  mounted() {
    this.fetchTracks();
  },
};
</script>

<style lang="scss">
.AlbumPage {
  // margin-top: -100px;
}
</style>
