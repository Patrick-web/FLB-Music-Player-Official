<template>
  <div class="APage">
    <div class="coverArea">
      <img :src="bingAlbumInfo.cover" alt="" class="blurred" />
      <img class="artistImage" :src="bingAlbumInfo.cover" alt="" />
      <h2>
        <pre>Album</pre>
        {{ bingAlbumInfo.name }}
      </h2>
    </div>
    <div class="artistPageResults">
      <div class="results trackResults">
        <h2>Tracks</h2>
        <div class="column">
          <Track
            v-for="track in bingAlbumInfo.tracks"
            :key="track.id"
            :trackInfo="track"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AlbumCard from "./AlbumCard.vue";
import Track from "./Track.vue";
export default {
  computed: {
    ...mapGetters(["bingAlbumInfo"]),
  },
  components: {
    AlbumCard,
    Track,
  },
};
</script>

<style lang="scss">
.AlbumPage {
  margin-top: -100px;
}
</style>
