<template>
  <div class="APage">
    <div class="coverArea">
      <img :src="bingArtistInfo.cover" alt="" class="blurred" />
      <img class="artistImage" :src="bingArtistInfo.cover" alt="" />
      <h2>
        <pre>Artist</pre>
        {{ bingArtistInfo.name }}
      </h2>
    </div>
    <div class="artistPageResults">
      <div class="results trackResults">
        <h2>Tracks</h2>
        <div class="column">
          <Track
            v-for="track in bingArtistInfo.tracks"
            :key="track.id"
            :trackInfo="track"
          />
        </div>
      </div>
      <div class="results albumResults">
        <h2>Albums</h2>
        <div class="grid3">
          <AlbumCard
            v-for="album in bingArtistInfo.albums"
            :key="album.id"
            :albumInfo="album"
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
    ...mapGetters(["bingArtistInfo"]),
  },
  components: {
    AlbumCard,
    Track,
  },
};
</script>

<style lang="scss">
.APage {
  height: 100vh;
  margin-top: -50px;
  z-index: 5;
  .TrackCard {
    .trackTitle {
      transform: translateY(50%);
    }
  }
  .coverArea {
    height: 40%;
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: -20px;
    background: black;
    pre {
      font-size: 0.5em;
      font-family: roboto;
      background: black;
      width: 40px;
      padding: 3px;
      border-left: 2px solid white;
    }
    h2 {
      position: absolute;
      bottom: 0px;
      left: 0px;
      padding: 10px;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.685));
      width: 100%;
      z-index: 4;
    }
    .blurred {
      width: 100%;
      height: 100%;
      filter: blur(30px);
      opacity: 0.5;
      margin-top: -10px;
    }
    .artistImage {
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 95%;
    }
  }
  .artistPageResults {
    padding: 10px;
    height: 70%;
    overflow: hidden;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
</style>
