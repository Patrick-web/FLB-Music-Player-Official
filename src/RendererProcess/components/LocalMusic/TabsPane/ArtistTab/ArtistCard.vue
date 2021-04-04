<template>
  <div
    @click="goToArtist()"
    :class="[!artistPicture ? 'groupCard_noPicture' : '', 'groupCard']"
  >
    <img v-if="artistPicture" class="coverArt" :src="artistPicture" />
    <div v-if="!artistPicture" class="letterDiv">
      <h1 :style="randomColorGenerator">
        {{ artist.name.charAt(0) }}
      </h1>
    </div>
    <div class="tracksCount">
      <p>
        {{ artist.tracks.length }}
      </p>
    </div>
    <div class="groupedCard_info">
      <p class="groupedInfo_title">
        {{ artist.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { shuffleArray } from "@/sharedUtilities";

export default {
  computed: {
    randomColorGenerator() {
      const colors = ["#3182FF", "#3074FF", "#0066FF"];
      const shuffledColors = shuffleArray(colors);
      const styleObject = {
        color: shuffledColors[0],
      };
      return styleObject;
    },
    artistPicture() {
      return (
        this.$store.state.TabsManager.downloadedArtistPictures.filter(
          (artistPicInfo) => artistPicInfo.name == this.artist.name
        )[0]?.pathToPicture || false
      );
    },
  },
  methods: {
    ...mapActions(["findAndGoToArtist"]),
    goToArtist() {
      document.querySelector("#Artists").click();
      this.findAndGoToArtist(this.artist.name);
    },
  },
  props: {
    artist: Object,
  },
};
</script>

<style lang="scss">
.groupCard {
  position: relative;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  max-width: 150px;
  max-height: 200px;
  align-self: center;
  justify-self: center;
  .coverArt {
    height: 150px;
    max-width: 150px;
  }
  .groupedCard_info {
    width: 150px;
    padding: 0px;
    margin: 0px;
    .groupedInfo_title,
    .groupedInfo_subtitle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .groupedInfo_title {
      font-family: roboto-light;
      font-size: 0.9rem;
    }
    .groupedInfo_subtitle {
      font-family: roboto-thin;
      font-size: 0.8em;
    }
    p {
      text-align: left;
      max-width: 150px;
    }
  }
}
.groupCard_noPicture {
  .groupedCard_info {
    p {
      text-align: center;
    }
  }
  .letterDiv {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      font-size: 5rem;
    }
  }
}
</style>