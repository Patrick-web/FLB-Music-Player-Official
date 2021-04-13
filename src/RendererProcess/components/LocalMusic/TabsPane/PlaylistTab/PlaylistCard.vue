<template>
  <div class="PlaylistCard">
    <p class="playlist_name">{{ playlist.name }}</p>
    <div
      @click="openPlaylist"
      style="cursor: pointer"
      v-if="playlist.tracks.length == 0"
      class="centerContents"
    >
      <img
        style="width: 140px"
        src="@/RendererProcess/assets/images/addIllustration.svg"
        alt=""
      />
      <p style="font-family: roboto-thin">Empty Playlist</p>
    </div>
    <div class="top4Tracks">
      <div
        @click="playTrack(track)"
        v-for="track in top5MixTracks"
        :key="track.fileLocation"
        class="card"
      >
        <img
          class="card_image"
          v-if="track.albumArt"
          :src="track.albumArt"
          alt=""
        />
        <img
          class="card_image"
          v-else
          src="@/RendererProcess/assets/images/FLBDefaultCover.png"
        />
        <base-button
          :icon="require('@/RendererProcess/assets/images/playButton.svg')"
          id="card_playBt"
          style="backdrop-filter: blur(20px)"
        />
        <p class="card_title">{{ track.defaultTitle }}</p>
        <p class="card_subTitle">
          {{ track.defaultArtist || "unknown artist" }}
        </p>
      </div>
    </div>
    <div v-if="playlist.tracks.length != 0" class="pl_ActionsWrapper">
      <base-button
        :icon="require('@/RendererProcess/assets/images/playlist_add.svg')"
        @click.native="openPlaylist"
        text="Open Playlist"
        style="margin-top: 10px; margin-bottom: 10px"
      />
      <base-button
        :icon="require('@/RendererProcess/assets/images/playButton.svg')"
        @click.native="playAll"
        text="Play All"
      />
    </div>
  </div>
</template>

<script>
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import { mapMutations, mapActions } from "vuex";
export default {
  components: { BaseButton },
  computed: {
    top5MixTracks() {
      return this.playlist.tracks.slice(0, 5);
    },
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "overWriteCustomQueue",
      "selectGroup",
      "pushNotification",
    ]),
    playTrack(track) {
      if (document.querySelector("audio")) {
        document.querySelector("audio").muted = false;
      }
      this.setPlayingTrack({ track, index: 0 });
    },
    playAll() {
      this.setPlayingTrack({ track: this.playlist.tracks[0], index: 0 });
      this.overWriteCustomQueue(this.playlist.tracks);
      this.pushNotification({
        title: "Playing all tracks from",
        subTitle: this.playlist.name,
        type: "normal",
      });
    },
    openPlaylist() {
      this.selectGroup(this.playlist);
    },
  },
  props: {
    playlist: Object,
  },
};
</script>

<style lang="scss">
.PlaylistCard {
  align-self: flex-start;
  justify-self: center;
  background: rgba(255, 255, 255, 0.068);
  padding: 10px;
  border-radius: 20px;
  .playlist_name {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  .playlistOption {
    background: white;
    img {
      filter: invert(1);
    }
    p {
      color: black;
    }
  }
  .top4Tracks {
    display: flex;
    .card {
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.068);
      backdrop-filter: blur(10px);
      padding: 10px;
      box-shadow: -15px 5px 10px rgba(0, 0, 0, 0.39);
      position: relative;
      cursor: pointer;
      p {
        text-align: left;
        font-family: roboto-light;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .card_title {
        font-size: 0.9rem;
      }
      .card_subTitle {
        font-size: 0.8rem;
      }
      .card_image {
        height: 120px;
        margin: auto;
        border-radius: 20px;
      }
      #card_playBt {
        position: absolute;
        background: rgba(0, 0, 0, 0.397);
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
      }
    }
    .card:hover {
      transform: translateY(-10px);
      #card_playBt {
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
    .card:hover ~ .card {
      transform: translateX(120px);
    }
    .card:not(:first-child) {
      margin-left: -120px;
    }
  }
}
</style>