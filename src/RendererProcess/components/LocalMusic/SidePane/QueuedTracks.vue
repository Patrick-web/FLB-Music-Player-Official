<template>
  <div class="QueuedTracks animated faster disable__options">
    <div
      v-if="customQueue.length == 0"
      class="centerContents"
      style="height: 90%"
    >
      <img
        width="200px"
        src="@/RendererProcess/assets/images/empty_queue.svg"
      />
      <p style="text-align: center; font-family: roboto-light">
        Queue is Empty. Right click on a track to add it to the queue
      </p>
    </div>
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
        <transition-group
          enter-active-class="animated  lightSpeedIn faster"
          leave-active-class="animated hinge fast"
        >
          <div
            v-for="(track, index) in customQueue"
            :key="track.fileLocation"
            class="queuedTrack bg1"
            @click.stop="playQueuedTrack($event, index, track)"
          >
            <p class="card_title">{{ track.defaultTitle }}</p>
            <p class="card_subTitle">{{ track.defaultArtist }}</p>
            <img
              @click.stop="removeTrackFromCustomQueue(index)"
              src="@/RendererProcess/assets/images/x.svg"
              alt=""
            />
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      queue: [],
    };
  },
  components: {
    draggable,
  },
  computed: {
    customQueue: {
      get() {
        return this.$store.state.PlaybackManger.customQueue;
      },
      set(value) {
        this.$store.commit("reorderQueue", value);
      },
    },
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "removeTrackFromCustomQueue",
      "UIcontrollerToggleProperty",
      "clearCustomQueue",
    ]),
    playQueuedTrack(e, index, track) {
      const trackBox = e.currentTarget;
      trackBox.classList.add("playingTrack");
      this.setPlayingTrack({ track: track, index: index });
      this.removeTrackFromCustomQueue(index);
      document.querySelector("audio").muted = false;
    },
  },
};
</script>

<style lang="scss">
.QueuedTracks {
  height: 95%;
  width: 19.5vw;
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
    &:hover {
      border-radius: 20px;
    }
  }
  .QueuedTracksWrapper {
    padding-top: 40px;
  }
  .queuedTrack {
    position: relative;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;
    .card_title {
      font-family: roboto-light;
      font-size: 0.9rem;
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
  .playingtrack {
    z-index: 1;
    margin-top: 0px;
    box-shadow: none;
    .info {
      padding-left: 5px !important;
    }
    .cover {
      transform: scale(0.8);
      box-shadow: none;
      box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.123);
    }
    .options {
      display: none;
    }
    .unQueueIcon {
      display: none;
    }
  }
}
</style>
