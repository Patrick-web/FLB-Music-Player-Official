<template>
  <div class="groupedContentTab bingPage blurred_bg blur30 bingAlbumPage">
    <div class="sliverBar">
      <img class="coverArt" id="blurred" :src="albumInfo.cover" alt="" />
      <img class="coverArt" :src="albumInfo.cover" alt="" />
      <div class="sliverBarFooter">
        <div class="groupedCard_info">
          <p class="groupedInfo_title">
            {{ albumInfo.name }}
          </p>
          <p class="groupedInfo_subtitle">
            by {{ albumInfo.tracks[0].artist.name }}
          </p>
        </div>
      </div>
      <base-button
        @click.native="$emit('clearAlbumResults')"
        :icon="require('@/RendererProcess/assets/images/back.svg')"
        id="backToUnfilteredItems"
      />
    </div>
    <div>
      <div class="results trackResults">
        <div class="sectionHeading">
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
import Track from "./BingTrack.vue";
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
  mounted() {
    console.log(this.albumInfo);
  },
  props: {
    albumInfo: Object,
  },
};
</script>

<style lang="scss">
.widgetVisible {
  .bingAlbumPage {
    width: 76%;
  }
}
.bingAlbumPage {
  z-index: 5 !important;
  width: 100%;
  .cardsWrapper {
    padding: 40px;
    padding-right: 60px;
    padding-top: 10px;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
