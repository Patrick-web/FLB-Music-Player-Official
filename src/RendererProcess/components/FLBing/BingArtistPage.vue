<template>
  <div class="groupedContentTab bingArtistPage bingPage">
    <div class="sliverBar">
      <img class="coverArt" id="blurred" :src="artistInfo.cover" />
      <img class="coverArt" :src="artistInfo.cover" alt="" />
      <div class="groupedCard_info">
        <p class="groupedInfo_title">
          {{ artistInfo.name }}
        </p>
      </div>
      <base-button
        @click.native="$emit('goBackToResults')"
        :icon="require('@/RendererProcess/assets/images/back.svg')"
        id="backToUnfilteredItems"
      />
    </div>
    <div class="cardsWrapper">
      <div class="grid2 gap10">
        <div class="results trackResults">
          <div class="sectionHeading">
            <p>Tracks</p>
            <div class="line"></div>
            <p>{{ artistInfo.tracks.length }}</p>
          </div>
          <div class="column content">
            <Track
              v-for="track in artistInfo.tracks"
              :key="track.id"
              :trackInfo="track"
            />
          </div>
        </div>
        <div class="results albumResults">
          <div class="sectionHeading">
            <p>Albums</p>
            <div class="line"></div>
            <p>{{ artistInfo.albums.length }}</p>
          </div>
          <div class="grid3 content">
            <AlbumCard
              v-for="album in artistInfo.albums"
              :key="album.id"
              :albumInfo="album"
              v-on:selectedAlbum="bubbleAlbum"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import AlbumCard from "./BingAlbumCard.vue";
import Track from "./BingTrack.vue";
export default {
  components: {
    AlbumCard,
    Track,
    BaseButton,
  },
  methods: {
    bubbleAlbum(albumData) {
      this.$emit("selectedAlbum", albumData);
      console.log("Sending...");
      console.table(albumData);
    },
  },
  props: {
    artistInfo: Object,
  },
};
</script>

<style lang="scss">
.bingPage {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
  background: rgb(14, 14, 14);
  border-radius: 20px;
  overflow: hidden;
  height: 93% !important;
  // backdrop-filter: blur(40px);
}
.bingPage {
  .content {
    padding: 10px;
    height: 57vh !important;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
