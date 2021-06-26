<template>
  <div
    :class="[
      currentlyPlayingTrackPath === track.fileLocation ? 'playing_track' : '',
      'queuedTrack bg1',
    ]"
    @click.stop="playQueuedTrack(track)"
  >
    <p class="card_title">{{ track.defaultTitle }}</p>
    <p class="card_subTitle">{{ track.defaultArtist }}</p>
    <img
      @click.stop="removeTrackFromCustomQueue(index)"
      src="@/RendererProcess/assets/images/x.svg"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    track: Object,
  },
  computed: {
    currentlyPlayingTrackPath() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track
        .fileLocation;
    },
  },
  methods: {
    ...mapMutations(["setPlayingTrack", "removeTrackFromCustomQueue"]),
    playQueuedTrack(track) {
      this.setPlayingTrack({ track: track, index: 0 });
    },
  },
};
</script>

<style>
</style>