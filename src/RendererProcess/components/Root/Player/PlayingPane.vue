<template>
  <div class="playingPane bg2">
    <div class="left_pane_section">
      <div class="album_art_resolver">
        <img
          v-if="playingTrack.albumArt"
          @dblclick="toggleFromFavorites"
          @click="expandPlayingPane"
          class="album_art"
          :src="playingTrack.albumArt"
          alt=""
        />
        <img
          v-if="!playingTrack.albumArt"
          @dblclick="toggleFromFavorites"
          @click="expandPlayingPane"
          class="album_art"
          src="@/RendererProcess/assets/images/FLBDefaultCover.png"
          alt=""
        />
      </div>

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
      <div class="flex center-v gap20">
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
      <div class="trackData"></div>
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
      <div class="flex center-v">
        <img src="@/RendererProcess/assets/images/volume_down.svg" alt="" />
        <volume-rocker v-on:newVolume="adjustVolume" />
      </div>
    </div>

    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <equalizer v-if="showEqualizerWidget" />
    </transition>
  </div>
</template>

<script>
import TrackBar from "./TrackBar";
import { mapActions, mapMutations } from "vuex";
import BaseButton from "../../BaseComponents/BaseButton.vue";
import Equalizer from "../Equalizer/Equalizer.vue";
import VolumeRocker from "./VolumeRocker.vue";

export default {
  components: {
    TrackBar,
    BaseButton,
    Equalizer,
    VolumeRocker,
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
      document.body.classList.toggle("fullScreenPlayingPane");
      // document.querySelector(".split").classList.toggle("playingPaneLoaded");
    },
    adjustVolume(newVolume) {
      document.querySelector("audio").volume = newVolume;
      this.setSettingValue({ property: "volume", newValue: newVolume });
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
        playlistWidget.style.bottom = "120px";
        document.querySelector("#PlaylistWidget").style.top = "initial";
        document.querySelector("#PlaylistWidget").style.left = "79%";
      }, 0);
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
    this.adjustVolume(this.userSetVolume);
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
    document.querySelector(".split").classList.add("playingPaneLoaded");

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
  height: 100px;
  position: fixed;
  bottom: 5px;
  width: 98.5vw;
  margin-left: 10px;
  z-index: 20;
  border-radius: 20px;
  display: flex;
  gap: 10px;
}
.left_pane_section {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 20%;
  padding-left: 10px;
}
.album_art_resolver {
  .album_art {
    width: 80px;
    border-radius: 15px;
  }
}
.track_info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .track_title,
  .track_artist {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.95rem;
    font-family: roboto-thin;
    max-width: 13vw;
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
  justify-content: flex-end;
  button {
    transform: scale(0.8);
  }
  #toggle_play {
    img {
      width: 3rem;
      transform: scale(1.2);
      &:hover {
        transform: scale(1.25) perspective(1px);
      }
    }
  }
}
.right_pane_section {
  width: 20%;
  justify-self: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.scale_icon {
  img {
    transform: scale(1.5);
  }
}
</style>
