<template>
  <div class="playingPane bg2">
    <div class="left_pane_section">
      <img
        @click="expandPlayingPane"
        class="album_art"
        :src="
          playingTrack.albumArt ||
          require('@/RendererProcess/assets/images/FLBDefaultCover.png')
        "
      />
      <img
        class="album_art_blurred"
        :src="
          playingTrack.albumArt ||
          require('@/RendererProcess/assets/images/FLBDefaultCover.png')
        "
      />

      <div class="track_info">
        <p class="track_title">
          {{ playingTrack.defaultTitle }}
        </p>
        <p
          @click="goToArtist(playingTrack.defaultArtist)"
          title="Go To Artist"
          class="track_artist"
        >
          {{ playingTrack.defaultArtist }}
        </p>
      </div>
    </div>
    <div class="center_pane_section">
      <div class="flex center-v gap20 t_actions">
        <base-button
          @click.native="shuffler"
          :icon="require('@/RendererProcess/assets/images/shuffle.svg')"
          :active="audioState.shuffle"
        />
        <base-button
          @click.native="determineNextTrack('prev')"
          :icon="require('@/RendererProcess/assets/images/play-previous.svg')"
          extraClass="scale_icon"
        />
        <div @click="toggleIsPlaying" id="toggle_play" class="iconsWrapper">
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

        <base-button
          @click.native="determineNextTrack('next')"
          :icon="require('@/RendererProcess/assets/images/play-next.svg')"
          extraClass="scale_icon"
        />

        <base-button
          @click.native="changeRepeat"
          :icon="require('@/RendererProcess/assets/images/repeat_one.svg')"
          :active="audioState.repeat"
        />
      </div>
      <TrackBar />
    </div>

    <div class="right_pane_section">
      <div class="flex center-v gap20">
        <base-button
          @click.native="toggleFromFavorites"
          :icon="require('@/RendererProcess/assets/images/heart.svg')"
          :active="isInFavorites"
        />
        <base-button
          @click.native="showPlaylistAdder"
          :icon="require('@/RendererProcess/assets/images/playlist.svg')"
          :active="showPlaylistWidget"
        />
        <base-button
          @click.native="UIcontrollerToggleProperty('showEqualizerWidget')"
          :icon="require('@/RendererProcess/assets/images/equalizer.svg')"
          :active="showEqualizerWidget"
        />
      </div>
      <div class="flex center-v vol_rocker">
        <img src="@/RendererProcess/assets/images/volume_down.svg" />
        <volume-rocker />
      </div>
    </div>

    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <equalizer v-if="showEqualizerWidget" />
    </transition>
    <div v-if="playingPaneExpanded" class="que_wrappers">
      <h1>Coming Up</h1>
      <queued-tracks />
    </div>
  </div>
</template>

<script>
import TrackBar from "./TrackBar";
import { mapActions, mapMutations } from "vuex";
import BaseButton from "../../BaseComponents/BaseButton.vue";
import Equalizer from "../Equalizer/Equalizer.vue";
import VolumeRocker from "./VolumeRocker.vue";
import { setupEqualizer } from "../Equalizer/Equalizer";
import QueuedTracks from "../../LocalMusic/SidePane/QueuedTracks.vue";

export default {
  components: {
    TrackBar,
    BaseButton,
    Equalizer,
    VolumeRocker,
    QueuedTracks,
  },
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
    showEqualizerWidget() {
      return this.$store.state.UIController.UIProperties.showEqualizerWidget;
    },
    isInFavorites() {
      return this.$store.state.TabsManager.tabsData.playlists[0].tracks.some(
        (track) => track.fileLocation == this.playingTrack.fileLocation
      );
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
      playingPaneExpanded: false,
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
      document.body.classList.toggle("fullScreenPlayingPane");
      this.playingPaneExpanded = !this.playingPaneExpanded;
      // document.querySelector(".split").classList.toggle("playingPaneLoaded");
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
    },
    toggleFromFavorites() {
      this.addToSelectedTracks(this.playingTrack);
      if (this.isInFavorites) {
        this.deleteSelectedTrackFromPlaylist(this.playingTrack);
        this.pushNotification({
          title: `Removed from Favorites`,
          subTitle: `${this.playingTrack.defaultTitle}`,
          type: "danger",
        });
      } else {
        this.addSelectedTracksToPlaylist("Favorites");
        this.pushNotification({
          title: `Added to Favorites`,
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
    setupEqualizer();
    window.addEventListener("keydown", (e) => {
      if (!document.activeElement.classList.contains("inputElem")) {
        if (e.code === "Space") {
          e.preventDefault();
          document.querySelector("#toggle_play").click();
          return;
        }
        if (e.code === "ArrowLeft") {
          this.determineNextTrack("prev");
          return;
        }
        if (e.code === "ArrowRight") {
          this.determineNextTrack("next");
          return;
        }
        if (e.code === "Tab") {
          e.preventDefault();
          document.querySelector("#search").focus();
        }
      }
    });
    document.querySelector("body").classList.add("playingPaneLoaded");

    const actionHandlers = [
      [
        "play",
        () => {
          this.toggleIsPlaying();
        },
      ],
      [
        "pause",
        () => {
          this.toggleIsPlaying();
        },
      ],
      [
        "previoustrack",
        () => {
          this.determineNextTrack("prev");
        },
      ],
      [
        "nexttrack",
        () => {
          this.determineNextTrack("next");
        },
      ],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.log(
          `The media session action "${action}" is not supported yet.`
        );
      }
    }
  },
};
</script>

<style lang="scss">
.playingPane {
  width: 100%;
  z-index: 20;
  border-radius: 20px;
  display: flex;
  gap: 10px;
  height: 100px;
  // transition: none;
  .album_art {
    width: 70px;
    border-radius: 15px;
    cursor: pointer;
    transition: none;
  }
}
.album_art_blurred {
  position: absolute;
  left: 10px;
  z-index: -1;
  height: 94vh;
  width: 98.5vw;
  top: 40px;
  opacity: 1;
  filter: blur(60px);
  display: none;
}
.left_pane_section {
  padding: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  width: 20%;
  transition: none;
}
.track_info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  transition: none;

  .track_title,
  .track_artist {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.95rem;
    font-family: roboto-thin;
    max-width: 13vw;
    transition: none;
  }
  .track_title {
    font-size: 0.9rem;
    font-family: roboto-light;
  }
  .track_artist {
    font-size: 0.8rem;
    font-family: roboto-thin;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}

.center_pane_section {
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  transition: none;

  button {
    transform: scale(0.8);
    transition: none;
  }
  #toggle_play {
    transition: none;

    img {
      transition: none;
      width: 3rem;
      transform: scale(1.2);
      &:hover {
        transform: scale(1.25) perspective(1px);
      }
    }
  }
}
.right_pane_section {
  padding: 10px 0px;
  width: 20%;
  justify-self: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: none;

  .vol_rocker {
    transform: translateY(4px);
    transition: none;
  }
}
.scale_icon {
  img {
    transition: none;

    transform: scale(1.5);
  }
}
.t_actions {
  transition: none;
}
.fullScreenPlayingPane {
  .playingPane {
    position: fixed;
    z-index: 30;
    height: 93vh;
    width: 98.5vw;
    bottom: 10px;
    background: black;
    overflow: hidden;
  }
  .album_art_blurred {
    display: block;
    opacity: 0.4;
  }
  .left_pane_section {
    left: 20px;
    top: 20px;
    position: absolute;
    width: 100%;
    height: 80%;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .album_art {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 25vw;
    }
    .track_info {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      // transform: translateY(100%) translateX(-72%);
      height: 150px;
      .track_title {
        font-size: 4rem;
        max-width: 70vw;
        text-align: center;
      }
      .track_artist {
        font-size: 3rem;
        max-width: 70vw;
        pointer-events: none;
        text-align: center;
      }
    }
  }
  .center_pane_section {
    margin-left: 20px;
    width: 98%;
    justify-content: flex-end;
    .t_actions {
      position: absolute;
      bottom: 40px;
      left: 52%;
      transform: translateX(-50%);
      button {
        width: 50px;
        height: 50px;
        // transform: scale(2);
      }
      #toggle_play {
        width: 50px;
        height: 50px;
      }
    }
  }
  .right_pane_section {
    position: absolute;
    left: -80px;
    top: 40%;
    justify-content: flex-end;
    transform: rotate(-90deg);
    z-index: 20;
    .vol_rocker {
      transform: rotateX(180deg) translateY(72px) translateX(-12px);
      img {
        opacity: 0;
      }
    }
    button {
      transform: rotate(90deg);
      backdrop-filter: blur(20px);
    }
  }
}
.que_wrappers {
  position: absolute;
  right: 10px;
  height: 86%;
  padding-top: 10px;
  width: 300px;
  h1 {
    text-align: center;
    margin-bottom: 10px;
  }
  .QueuedTracks {
    width: 100%;
    .QueuedTracksWrapper {
      padding-top: 0px;
    }
    .clearQueueBt {
      display: none;
    }
  }
}
</style>
