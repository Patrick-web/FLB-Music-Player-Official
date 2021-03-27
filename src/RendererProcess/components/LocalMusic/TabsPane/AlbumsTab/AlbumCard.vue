<template>
  <div @click="selectGroup(album)" class="groupCard">
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
    <p class="tracksCount">
      {{ album.tracks.length }}
    </p>
    <div class="groupedCard_info">
      <div>
        <p class="groupedInfo_title">
          {{ album.name }}
        </p>
        <p class="groupedInfo_subtitle">{{ album.tracks[0].artist }}</p>
      </div>
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
    album: Object,
  },
};
</script>

<style>
</style>