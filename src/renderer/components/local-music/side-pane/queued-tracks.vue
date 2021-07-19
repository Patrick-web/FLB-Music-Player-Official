<template>
  <div class="QueuedTracks animated faster disable__options">
    <div
      v-if="customQueue.length !== 0"
      class="clearQueueBt"
      @click="clearCustomQueue"
    >
      Clear Queue
    </div>
    <div class="QueuedTracksWrapper">
      <draggable
        v-model="customQueue"
        ghost-class="ghost"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group enter-active-class="animated  lightSpeedIn faster">
          <que-track
            v-for="track in customQueue"
            :key="track.fileLocation"
            :track="track"
          />
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'QueuedTracks',

  data() {
    return {
      queue: []
    };
  },
  computed: {
    customQueue: {
      get() {
        const queue = this.$store.state.PlaybackManger.customQueue;
        const indexOfPlayingTrack = queue.findIndex(
          track => track.fileLocation === this.currentlyPlayingTrackPath
        );
        if (indexOfPlayingTrack > -1) {
          return queue;
        }
        if (queue.length === 1) {
          return [this.$store.state.PlaybackManger.playingTrackInfo.track];
        }
        return [
          this.$store.state.PlaybackManger.playingTrackInfo.track,
          ...queue
        ];
      },
      set(value) {
        this.$store.commit('reorderQueue', value);
      }
    },
    currentlyPlayingTrackPath() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track
        .fileLocation;
    }
  },
  methods: {
    ...mapMutations([
      'setPlayingTrack',
      'removeTrackFromCustomQueue',
      'UIcontrollerToggleProperty',
      'clearCustomQueue'
    ]),
    playQueuedTrack(track) {
      this.setPlayingTrack({ track, index: 0 });
    }
  }
};
</script>

<style lang="scss">
.QueuedTracks {
  height: 95%;
  overflow: hidden;
  overflow-y: scroll;
  .clearQueueBt {
    padding: 5px;
    text-align: center;
    background: crimson;
    border-radius: 10px;
    position: absolute;
    top: 50px;
    z-index: 2;
    width: 84%;
    cursor: pointer;
    display: none;
    &:hover {
      border-radius: 20px;
    }
  }
  .QueuedTracksWrapper {
    // padding-top: 40px;
  }
}
</style>
