<template>
  <div
    :class="[
      currentlyPlayingTrackPath === track.fileLocation ? 'playing_track' : '',
      'queuedTrack bg1'
    ]"
    @click.stop="playQueuedTrack(track)"
  >
    <p class="card_title">
      {{ track.defaultTitle }}
    </p>
    <p class="card_subTitle">
      {{ track.defaultArtist }}
    </p>
    <base-icon icon="x" @click.stop="removeTrackFromCustomQueue(index)" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'QueTrack',
  props: {
    track: Object
  },
  computed: {
    currentlyPlayingTrackPath() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track
        .fileLocation;
    }
  },
  methods: {
    ...mapMutations(['setPlayingTrack', 'removeTrackFromCustomQueue']),
    playQueuedTrack(track) {
      this.setPlayingTrack({ track, index: 0 });
    }
  }
};
</script>

<style></style>
