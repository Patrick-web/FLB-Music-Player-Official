<template>
  <div class="groupedContentTab blurred_bg blur30 bingArtistPage bingPage">
    <div class="sliverBar">
      <img class="coverArt" id="blurred" :src="artistInfo.picture" />
      <img class="coverArt" :src="artistInfo.picture" alt="" />
      <div class="sliverBarFooter">
        <div class="groupedCard_info">
          <p class="groupedInfo_title">
            {{ artistInfo.name }}
          </p>
        </div>
      </div>
      <base-button
        @click.native="$emit('clearArtistResults')"
        :icon="require('@/RendererProcess/assets/images/back.svg')"
        id="backToUnfilteredItems"
      />
    </div>
    <div class="cardsWrapper artist_data_results">
      <div class="grid2 gap10">
        <div class="artist_data">
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
        <div class="artist_data">
          <div class="sectionHeading">
            <p>Albums</p>
            <div class="line"></div>
            <p>{{ artistInfo.albums.length }}</p>
          </div>
          <div class="content albums">
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
.playingPaneLoaded {
  .bingPage {
    .cardsWrapper {
      height: 68% !important;
    }
    .artist_data_results .grid2 .artist_data {
      height: 18%;
    }
  }
}
.bingPage {
  position: absolute;
  top: 0;
  width: 99.2%;
  z-index: 4;
  border-radius: 20px;
  overflow: hidden;
  height: 93% !important;
  .content {
    padding: 20px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .sectionHeading {
    margin-right: 20px;
    margin-left: 10px;
  }
}
.artist_data_results {
  height: 72%;
  overflow: hidden;
  .grid2 {
    height: 100%;
    align-items: flex-start;
    .artist_data {
      .content {
        height: 43vh;
      }
    }
  }
}
.artist_data {
  .albums {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 5px;
    align-items: flex-start;
    justify-content: left;
  }
}
</style>
