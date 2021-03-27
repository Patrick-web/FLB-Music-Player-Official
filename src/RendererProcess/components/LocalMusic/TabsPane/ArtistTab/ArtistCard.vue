<template>
  <div @click="selectGroup(artist)" class="groupCard">
    <img v-if="artist.picture" class="coverArt" :src="artist.picture" alt="" />
    <img
      v-if="!artist.picture"
      class="coverArt"
      src="@/RendererProcess/assets/images/FLBDefaultArtistPic.png"
      alt=""
      style="border-radius: 10%"
    />
    <p class="tracksCount">
      {{ artist.tracks.length }}
    </p>
    <div class="groupedCard_info">
      <p class="groupedInfo_title">
        {{ artist.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["selectGroup"]),
  },
  props: {
    artist: Object,
  },
};
</script>

<style>
</style>