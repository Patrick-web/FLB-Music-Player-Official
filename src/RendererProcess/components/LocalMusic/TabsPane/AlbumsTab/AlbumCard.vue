<template>
  <div @click="goToAlbum(album)" class="groupCard">
    <img
      class="coverArt"
      v-if="album.tracks[0].albumArt"
      :src="album.tracks[0].albumArt"
      alt=""
    />
    <img
      class="coverArt"
      v-if="!album.tracks[0].albumArt"
      src="@/RendererProcess/assets/images/FLBDefaultCover.png"
      alt=""
    />
    <div class="tracksCount">
      <p>
        {{ album.tracks.length }}
      </p>
    </div>
    <div class="groupedCard_info">
      <div>
        <p class="groupedInfo_title">
          {{ album.name }}
        </p>
        <p v-if="!hideArtist" class="groupedInfo_subtitle">
          {{ album.tracks[0].artist }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["selectGroup"]),
    goToAlbum(album) {
      document.querySelector("#Albums").click();
      this.selectGroup(album);
    },
  },
  props: {
    album: Object,
    hideArtist: Boolean,
  },
};
</script>

<style>
</style>