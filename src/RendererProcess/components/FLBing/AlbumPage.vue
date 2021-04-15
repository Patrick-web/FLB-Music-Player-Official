<template>
  <div class="groupedContentTab bingPage bingAlbumPage">
    <div class="sliverBar">
      <img class="coverArt" id="blurred" :src="albumInfo.cover" alt="" />
      <img class="coverArt" :src="albumInfo.cover" alt="" />
      <div class="groupedCard_info">
        <p class="groupedInfo_title">
          {{ albumInfo.name }}
        </p>
      </div>
      <base-button
        @click.native="$emit('goBackToResults')"
        :icon="require('@/RendererProcess/assets/images/back.svg')"
        id="backToUnfilteredItems"
      />
    </div>
    <div>
      <div class="results trackResults">
        <div class="subHeading">
          <p>Tracks</p>
          <div class="line"></div>
          <p>{{ albumInfo.tracks.length }}</p>
        </div>
        <div class="cardsWrapper">
          <Track
            v-for="track in albumInfo.tracks"
            :key="track.id"
            :trackInfo="track"
            :overrideCoverArt="albumInfo.cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import Track from "./Track.vue";
export default {
  data() {
    return {
      tracks: [],
    };
  },
  components: {
    BaseButton,
    Track,
  },
  props: {
    albumInfo: Object,
  },
};
</script>

<style lang="scss">
.bingAlbumPage {
  z-index: 5 !important;
  .cardsWrapper {
    padding: 40px;
    padding-right: 60px;
    padding-top: 10px;
  }
}
</style>
