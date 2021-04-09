<template>
  <div class="APage">
    <div class="coverArea">
      <img :src="artistInfo.cover" alt="" class="blurred" />
      <img class="artistImage" :src="artistInfo.cover" alt="" />
      <h2>
        <pre>Artist</pre>
        {{ artistInfo.name }}
      </h2>
      <img
        @click="$emit('closeArtist')"
        id="closePage"
        src="@/RendererProcess/assets/images/x.svg"
      />
    </div>
    <div class="artistPageResults">
      <div class="results trackResults">
        <h2>Tracks</h2>
        <div class="column">
          <Track
            v-for="track in artistInfo.tracks"
            :key="track.id"
            :trackInfo="track"
          />
        </div>
      </div>
      <div class="results albumResults">
        <h2>Albums</h2>
        <div class="grid3">
          <AlbumCard
            v-for="album in artistInfo.albums"
            :key="album.id"
            :albumInfo="album"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlbumCard from "./AlbumCard.vue";
import Track from "./Track.vue";
export default {
  components: {
    AlbumCard,
    Track,
  },
  props: {
    artistInfo: Object,
  },
};
</script>

<style lang="scss">
.APage {
  height: 99%;
  position: absolute;
  width: 100%;
  top: 0%;
  z-index: 10;
  overflow: hidden;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  #closePage {
    background: white;
    filter: invert(1);
    border-radius: 50%;
    padding: 10px;
    z-index: 4;
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    width: 15px;
    cursor: pointer;
  }
  .bingTrack {
    width: 50%;
  }
  .trackTitle {
    transform: translateY(50%);
  }
  .coverArea {
    height: 40%;
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: -20px;
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
      width: 100%;
      z-index: 4;
    }
    .blurred {
      width: 100%;
      height: 100%;
      filter: blur(80px);
      opacity: 0.5;
      margin-top: -10px;
    }
    .artistImage {
      position: absolute;
      z-index: 2;
      top: 54%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 80%;
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
