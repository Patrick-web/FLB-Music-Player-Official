<template>
  <div class="QueuedTracks animated faster disable__options">
    <div
      class="clearQueueBt"
      @click="clearCustomQueue"
      v-if="customQueue.length !== 0"
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
import { mapMutations } from "vuex";
import draggable from "vuedraggable";
import QueTrack from "./QueTrack.vue";
export default {
  data() {
    return {
      queue: [],
    };
  },
  components: {
    draggable,
    QueTrack,
  },
  computed: {
    customQueue: {
      get() {
        const queue = this.$store.state.PlaybackManger.customQueue;
        const indexOfPlayingTrack = queue.findIndex(
          (track) => track.fileLocation === this.currentlyPlayingTrackPath
        );
        if (indexOfPlayingTrack > -1) {
          return queue;
        } else if (queue.length === 1) {
          return [this.$store.state.PlaybackManger.playingTrackInfo.track];
        } else {
          return [
            this.$store.state.PlaybackManger.playingTrackInfo.track,
            ...queue,
          ];
        }
      },
      set(value) {
        this.$store.commit("reorderQueue", value);
      },
    },
    currentlyPlayingTrackPath() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track
        .fileLocation;
    },
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "removeTrackFromCustomQueue",
      "UIcontrollerToggleProperty",
      "clearCustomQueue",
    ]),
    playQueuedTrack(track) {
      this.setPlayingTrack({ track: track, index: 0 });
    },
  },
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
  .queuedTrack {
    position: relative;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    // margin-right: 10px;
    cursor: pointer;
    width: 90%;
    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 0.95rem;
    }
    .card_title {
      font-family: roboto-light;
      font-size: 0.9rem;
      width: 90%;
    }
    .card_subTitle {
      font-family: roboto-thin;
      font-size: 0.8rem;
    }
    img {
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) scale(0);
      width: 10px;
      padding: 5px;
      background: crimson;
      border-radius: 10px;
    }
    img:hover {
      transform: translateX(-50%) scale(1.2) !important;
    }
    &::before,
    &::after {
      content: "";
      position: absolute;
      height: 3px;
      width: 20px;
      right: 10px;
      cursor: grab;
      top: 40%;
    }

    &::before {
      border-top: 2px solid white;
    }
    &::after {
      border-bottom: 2px solid white;
      border-top: 2px solid white;
      transform: translateY(5px);
    }
  }
  .ghost {
    background: var(--accentColor);
  }
  .queuedTrack:hover {
    background: rgba(255, 255, 255, 0.158);
    img {
      transform: translateX(-50%) scale(1);
    }
  }
  .queuedTrack:active {
    img {
      transform: translateX(-50%) scale(0);
    }
  }
  .playing_track {
    border-left: 5px solid var(--accentColor);
    border-right: 5px solid var(--accentColor);
    // border-top-left-radius: 0px;
    // border-bottom-right-radius: 0px;
    width: 86%;
  }
}
</style>
