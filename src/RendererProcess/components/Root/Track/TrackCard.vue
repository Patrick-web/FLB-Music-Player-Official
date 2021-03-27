<template>
  <div
    @contextmenu="showOptions($event)"
    :id="index"
    @click="playTrack"
    :class="[isCurrentlyPlaying ? 'playingTrack' : '', 'TrackCard']"
  >
    <div @click.stop="bulkSelectTrack($event)" class="fxSelectBt"></div>
    <div class="info">
      <p class="trackTitle">
        {{ source.defaultTitle }}
      </p>
      <p class="artist">{{ source.defaultArtist }}</p>
      <p class="album">{{ source.album }}</p>
      <p class="duration">
        {{ source.formattedLength }}
      </p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";

export default {
  computed: {
    isCurrentlyPlaying() {
      return (
        this.$store.state.PlaybackManger.playingTrackInfo.track &&
        this.$store.state.PlaybackManger.playingTrackInfo.track.fileLocation ==
          this.source.fileLocation
      );
    },
  },
  data() {
    return {
      track: null,
    };
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "addToSelectedTracks",
      "UIcontrollerToggleProperty",
      "clearSelectedTracks",
    ]),
    ...mapActions(["getLyrics"]),
    showOptions(e) {
      e.preventDefault();
      document
        .querySelector("#centralArea_tabs")
        .classList.remove("multiSelectMode");
      const cordinates = {
        x: e.clientX + 5,
        y: e.clientY,
      };
      if (cordinates.y > 500) cordinates.y = 500;
      const trackOptions = document.querySelector(".trackOptions");
      trackOptions.style.height = `0px`;
      trackOptions.style.top = `${cordinates.y}px`;
      trackOptions.style.left = `${cordinates.x}px`;
      setTimeout(() => {
        trackOptions.style.height = `225px`;
      }, 100);
      this.clearSelectedTracks();
      this.addToSelectedTracks(this.source);
    },
    playTrack(e) {
      if (document.querySelector("audio")) {
        document.querySelector("audio").muted = false;
      }
      const track = e.currentTarget;
      this.setPlayingTrack({ track: this.source, index: this.index });
      this.getLyrics(this.source);
    },
    bulkSelectTrack(e) {
      e.currentTarget.parentElement.classList.toggle("bulkSelected");
      this.addToSelectedTracks(this.source);
    },
  },
  props: {
    // track: Object,
    // trackIndex: Number,
    // playlistIndex: Number,
    index: {
      // index of current item
      type: Number,
    },
    source: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss">
.multiSelectMode {
  .TrackCard {
    margin-left: 30px;
    .fxSelectBt {
      opacity: 1;
    }
  }
  .TrackCard:hover {
    cursor: default;
    .cover {
      transform: scale(0.9) translate(0px, 0px);
      box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.712);
    }
    .fxSelectBt {
      border: 2px solid#ffffff;
      cursor: pointer;
    }
  }
}
.bulkSelected {
  .fxSelectBt {
    border: 1px solid#ffffff !important;
    background: var(--accentColor) !important;
  }
}
.light_theme {
  .playingTrack {
    border: none;
  }
}
.playingTrack {
  border-left: 4px solid var(--accentColor);
  border-right: 4px solid var(--accentColor);
  background: rgba(255, 255, 255, 0.137);
}
.TrackCard {
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.356);
  color: white;
  cursor: pointer;
  padding-left: 0px;
  transition: 0.2s ease;
  .fxSelectBt {
    position: absolute;
    top: 50%;
    left: -28px;
    transform: translateY(-50%);
    z-index: 4;
    background: rgba(0, 0, 0, 0.466);
    border: 1px solid rgba(255, 255, 255, 0.452);
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  .cover {
    width: 35px;
    transition: 0.2s ease;
    justify-self: center;
    align-self: center;
  }
  p {
    font-size: 0.95rem;
    font-family: roboto-thin;
  }
  .info {
    padding: 5px;
    width: 100%;
    display: grid;
    grid-template-columns: 3fr 1fr 2fr;
    align-items: center;
  }
  .delIcon {
    position: absolute;
    top: 50%;
    right: 0;
    background: crimson;
    width: 30px;
    padding: 5px;
    transform-origin: center;
    transform: translateX(50%) translateY(-50%) scale(0);
    border-radius: 50%;
    transition: 0.4s ease;
    cursor: pointer;
    z-index: 4;
    display: none;
  }
  .delIcon:hover {
    transform: translateX(50%) translateY(-50%) scale(1.2) !important;
  }
  .unQueueIcon {
    position: absolute;
    top: 50%;
    right: 0;
    background: crimson;
    width: 30px;
    padding: 5px;
    transform-origin: center;
    transform: translateX(50%) translateY(-50%) scale(0);
    border-radius: 50%;
    transition: 0.4s ease;
    cursor: pointer;
    z-index: 4;
  }
  .dateAdded {
    display: none;
  }
}
.TrackCard:hover {
  background: rgba(255, 255, 255, 0.144);
  .delIcon {
    transform: translateX(50%) translateY(-50%) scale(1);
  }
}
</style>
