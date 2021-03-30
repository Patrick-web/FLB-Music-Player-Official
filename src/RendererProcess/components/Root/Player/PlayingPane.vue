<template>
  <div class="playingPane animated faster">
    <img
      @click="expandPlayingPane"
      id="expandPlayingPane"
      src="@/RendererProcess/assets/images/arrowDown.svg"
      alt=""
    />
    <div
      v-if="!playingTrack.fileName.match(/mp4|mkv/)"
      class="audioImageResolver"
    >
      <img
        v-if="playingTrack.albumArt"
        @dblclick="toggleFromFavourites"
        @click="expandPlayingPane"
        id="cover"
        :src="playingTrack.albumArt"
        alt=""
      />
      <img
        v-if="!playingTrack.albumArt"
        @dblclick="toggleFromFavourites"
        @click="expandPlayingPane"
        id="cover"
        src="@/RendererProcess/assets/images/FLBDefaultCover.png"
        alt=""
      />
    </div>
    <div v-if="playingTrack.fileName.match(/mp4|mkv/)" class="video_resolver">
      <video
        autoplay
        controls
        muted="true"
        :src="playingTrack.fileLocation"
      ></video>
    </div>
    <div @click="toggleIsPlaying" id="pauseBt" class="iconsWrapper">
      <img
        v-if="!audioState.playing"
        class="toggleIcons playIcon"
        src="@/RendererProcess/assets/images/playButton.svg"
        alt
      />
      <img
        v-if="audioState.playing"
        class="toggleIcons pauseIcon"
        src="@/RendererProcess/assets/images/pause.svg"
        alt
      />
    </div>
    <div class="trackData">
      <div class="trackInfo">
        <p id="trackName">
          {{ playingTrack.defaultTitle }}
        </p>
        <p
          @click="goToArtist(playingTrack.defaultArtist)"
          title="Go To Artist"
          id="artistName"
        >
          {{ playingTrack.defaultArtist }}
        </p>
      </div>
      <TrackBar />
    </div>

    <div class="controls">
      <div class="volumeRockerArea">
        <img src="@/RendererProcess/assets/images/volume_down.svg" alt="" />
        <input
          id="volume"
          @change="adjustVolume"
          v-model="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          name=""
        />
      </div>
      <div class="control play_controls">
        <button
          @click="determineNextTrack('prev')"
          id="prevTrackBt"
          class="iconBt"
        >
          <img
            style="transform: rotate(-180deg)"
            src="@/RendererProcess/assets/images/play_arrow.svg"
            alt=""
          />
        </button>
        <button
          @click="toggleFromFavourites"
          id="favorIcon"
          :class="[isInFavourites ? 'bt_active' : '', 'iconBt']"
        >
          <img
            width="18px"
            src="@/RendererProcess/assets/images/heart.svg"
            alt=""
          />
        </button>
        <button
          id="nextTrackBt"
          @click="determineNextTrack('next')"
          class="iconBt"
        >
          <img src="@/RendererProcess/assets/images/play_arrow.svg" alt="" />
        </button>
      </div>
      <div class="control extra_controls">
        <button @click="showPlaylistAdder" id="playlistBt" class="iconBt">
          <img
            id="plIcon"
            src="@/RendererProcess/assets/images/playlist_add.svg"
            alt=""
          />
        </button>
        <button
          @click="changeRepeat"
          :class="[audioState.repeat ? 'bt_active' : '', 'iconBt']"
          id="repeatIcon"
          title="repeat"
        >
          <img
            id="plIcon"
            src="@/RendererProcess/assets/images/repeat_one.svg"
            alt=""
          />
        </button>
        <button
          @click="shuffler"
          id="shuffleIcon"
          :class="[audioState.shuffle ? 'bt_active' : '', 'iconBt']"
        >
          <img src="@/RendererProcess/assets/images/shuffle.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TrackBar from "./TrackBar";
import { mapActions, mapMutations } from "vuex";

export default {
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
    audioState() {
      return this.$store.state.PlaybackManger.audioState;
    },
    showPlaylistWidget() {
      return this.$store.state.UIController.UIProperties.showPlaylistWidget;
    },
    isInFavourites() {
      return this.$store.state.TabsManager.tabsData.playlists[0].tracks.some(
        (track) => track.fileLocation == this.playingTrack.fileLocation
      );
    },
    userSetVolume() {
      return this.$store.state.SettingsManager.settings.volume;
    },
  },
  data() {
    return {
      elements: ["songName", "artistName", "albumName"],
      repeat: false,
      shuffle: false,
      possibleThumbnails: [],
      selectedCover: "",
      volume: 1,
      isOnline: false,
      visualsOffDueToBlur: false,
    };
  },
  methods: {
    ...mapMutations([
      "pushNotification",
      "addToSelectedTracks",
      "addSelectedTracksToPlaylist",
      "deleteSelectedTrackFromPlaylist",
      "UIcontrollerToggleProperty",
      "setSettingValue",
      "clearSelectedTracks",
    ]),
    ...mapActions([
      "toggleRepeat",
      "toggleShuffler",
      "toggleIsPlaying",
      "determineNextTrack",
      "findAndGoToArtist",
    ]),
    expandPlayingPane() {
      const pane = document.querySelector(".playingPane");
      pane.classList.toggle("fullScreenPlayingPane");
    },
    adjustVolume() {
      document.querySelector("audio").volume = this.volume;
      this.setSettingValue({ property: "volume", newValue: this.volume });
    },
    goToArtist() {
      document.querySelector("#Artists").click();
      this.findAndGoToArtist(this.playingTrack.defaultArtist);
    },
    shuffler() {
      this.toggleShuffler();
      const state = this.audioState.shuffle ? "On" : "Off";
      this.pushNotification({
        title: `Shuffle ${state}`,
        subTitle: null,
        type: "normal",
      });
    },
    showPlaylistAdder() {
      this.addToSelectedTracks(this.playingTrack);
      if (!this.showPlaylistWidget) {
        this.UIcontrollerToggleProperty("showPlaylistWidget");
      }
      setTimeout(() => {
        const playlistWidget = document.querySelector("#PlaylistWidget");
        playlistWidget.style.bottom = "100px";
        document.querySelector("#PlaylistWidget").style.top = "initial";
        document.querySelector("#PlaylistWidget").style.left = "78%";
      }, 0);
    },
    toggleFromFavourites() {
      this.addToSelectedTracks(this.playingTrack);
      if (this.isInFavourites) {
        this.deleteSelectedTrackFromPlaylist(this.playingTrack);
        this.pushNotification({
          title: `Removed from Favourites`,
          subTitle: `${this.playingTrack.defaultTitle}`,
          type: "danger",
        });
      } else {
        this.addSelectedTracksToPlaylist("Favorites");
        this.pushNotification({
          title: `Added to Favourites`,
          subTitle: `${this.playingTrack.defaultTitle}`,
          type: "normal",
        });
      }
    },
    changeRepeat() {
      this.toggleRepeat();
      const state = this.audioState.repeat ? "On" : "Off";
      this.pushNotification({
        title: `Repeat ${state}`,
        subTitle: null,
        type: "normal",
      });
    },
  },
  mounted() {
    this.volume = this.userSetVolume;
    this.adjustVolume();
    window.addEventListener("keydown", (e) => {
      if (!document.activeElement.classList.contains("inputElem")) {
        if (e.code === "Space") {
          e.preventDefault();
          document.querySelector("#pauseBt img").click();
          return;
        }
        if (e.code === "ArrowLeft") {
          document.querySelector("#prevTrackBt").click();
          return;
        }
        if (e.code === "ArrowRight") {
          document.querySelector("#nextTrackBt").click();
          return;
        }
        if (e.code === "ArrowDown" || e.code === "ArrowUp") {
          document.querySelector("#volume").focus();
          return;
        }
      }
    });
    document.querySelector(".split").classList.add("playingPaneLoaded");
  },
  components: {
    TrackBar,
    // particleBg,
  },
};
</script>

<style lang="scss">
.fullScreenPlayingPane {
  background-color: rgba(0, 0, 0, 0.301) !important;
  height: 100vh !important;
  width: 100vw !important;
  left: 0;
  width: 100vw;
  z-index: 60 !important;
  border-radius: 0px !important;
  bottom: 0px !important;
  #expandPlayingPane {
    position: fixed;
    left: 50%;
    top: 40px;
    transform: rotate(180deg);
    z-index: 5;
  }
  #cover {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 400px !important;
    width: 50vw;
    min-width: 200px !important;
    max-height: 800px !important;
  }
  #blurred {
    height: 100vh !important;
    top: 0% !important;
  }
  #trackName {
    position: absolute;
    bottom: 200px;
    left: 20px;
    font-size: 6vw;
    font-family: roboto-thick;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 99%;
  }
  #artistName {
    position: absolute;
    bottom: 120px;
    left: 25px;
    font-size: 3vw;
  }
  #pauseBt {
    position: absolute;
    bottom: 50px;
    left: 50%;
    img {
      width: 50px;
    }
  }
  .volumeRockerArea {
    display: none !important;
  }
  .controls {
    transform: translate(82%, 400%);
    #playlistBt {
      display: none;
    }
    button {
      transform: scale(1.1);
      margin: 10px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .play_controls {
      border: none;
    }
  }
  .TrackBar {
    position: absolute;
    bottom: 0px;
    left: 20px;
    width: 98%;
    .seekBar {
      background: rgba(255, 255, 255, 0.082);
      border-radius: 10px;
      height: 6px;
      .seekProgress {
        border-radius: 10px;
        border-radius: 0;
      }
    }
    .seekBar:hover {
      height: 8px;
    }
  }
}
.light_theme {
  .playingPane {
    box-shadow: -2px 2px 20px rgba(255, 255, 255, 0.541);
    background: rgb(34, 34, 34);
    filter: invert(1);
    #cover {
      filter: invert(1);
    }
  }
  .fullScreenPlayingPane {
    background: rgb(34, 34, 34) !important;
  }
}
.playingPane {
  background: rgba(255, 255, 255, 0.083);
  backdrop-filter: blur(10px);
  height: 100px;
  position: fixed;
  bottom: 0px;
  width: 98.5vw;
  margin-left: 10px;
  z-index: 20;
  border-radius: 20px;
  display: grid;
  gap: 10px;
  grid-template-columns: 0.5fr 0.1fr 4fr 2fr;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  #cover {
    max-width: 150px;
    border-radius: 10px;
    max-height: 85px;
    margin: auto;
    margin-top: 2px;
    margin-left: 10px;
    align-self: center;
    cursor: pointer;
  }
  #cover:hover {
    border-radius: 20px;
  }
  .video_resolver {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    margin-left: 10px;
    background: black;
    video {
      width: 98%;
      cursor: pointer;
    }
  }
  .trackInfo {
    display: flex;
    justify-content: space-between;
    #artistName {
      font-family: roboto-thin;
    }
    #artistName:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  #blurred {
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 120%;
    filter: blur(40px);
    opacity: 0.4;
    z-index: -1;
    pointer-events: none;
  }
  .bordered {
    border: 2px solid white;
    border-radius: 15px;
    border-bottom-right-radius: 0px;
    padding: 5px;
  }
}
.controls {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    margin-left: 5px;
    margin-right: 5px;
  }
  .control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    transition: 0.2s ease;
  }
  .play_controls {
    border-right: 1px solid white;
  }
  .volumeRockerArea {
    position: absolute;
    left: 35px;
    bottom: -2px;
    width: 200px;
    transform: translate(0, 95%);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    input {
      width: 65%;
      height: 2px;
      cursor: pointer;
      filter: grayscale(0.9);
    }
  }
  .volumeRockerArea:hover {
    input {
      opacity: 1;
    }
  }
}
#expandPlayingPane {
  position: absolute;
  top: 8px;
  left: 97%;
  width: 20px;
  cursor: pointer;
}
.noMusicPlaying {
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}
@media (min-height: 900px) {
  .playingPane {
    bottom: 10px;
  }
}
</style>
