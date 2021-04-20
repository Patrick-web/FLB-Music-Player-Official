<template>
  <div
    @click="goToArtist()"
    :class="[!artistPicture ? 'groupCard_noPicture' : '', 'groupCard']"
  >
    <img
      v-if="artistPicture"
      class="coverArt roundImage"
      :src="artistPicture"
    />
    <letter-card v-if="!artistPicture" :text="artist.name.charAt(0)" />
    <div class="groupedCard_info">
      <p class="groupedInfo_title" style="text-align: center">
        {{ artist.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import LetterCard from "./LetterCard.vue";

export default {
  components: { LetterCard },
  computed: {
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
}
</style>