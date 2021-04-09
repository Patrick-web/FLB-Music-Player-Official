<template>
  <div v-if="!playingTrack.fileName.match(/mp4|mkv/)" class="TrackInfo">
    <div
      class="tag"
      style="display: flex; align-items: center; justify-content: center"
    >
      <img
        v-if="playingTrack.albumArt"
        :src="playingTrack.albumArt"
        id="tag_albumArt"
        alt=""
      />
      <p v-if="!playingTrack.albumArt">No Album Art</p>
    </div>
    <div class="tag">
      <pre>Title</pre>
      <p>{{ playingTrack.title || "unknown" }}</p>
    </div>
    <div class="tag">
      <pre>Artist</pre>
      <p>{{ playingTrack.artist || "unknown" }}</p>
    </div>
    <div class="tag">
      <pre>Album</pre>
      <p>{{ playingTrack.album }}</p>
    </div>
    <div v-if="playingTrack.duration" class="tag">
      <pre>Length</pre>
      <p>{{ playingTrack.formattedLength }}</p>
    </div>
    <div class="tag">
      <pre>Date Added</pre>
      <p>{{ Date(playingTrack.dateAdded) }}</p>
    </div>
    <div class="tag">
      <pre>File name</pre>
      <p>{{ playingTrack.fileName }}</p>
    </div>
    <button
      @click="emitPlayingTrack"
      class="iconBt"
      id="toggleTagEditor"
      title="Edit Tags"
    >
      <img src="@/RendererProcess/assets/images/pen.svg" alt="" />
    </button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
  },
  methods: {
    ...mapMutations(["UIcontrollerToggleProperty", "addToSelectedTracks"]),
    emitPlayingTrack() {
      this.$emit("targetTrack", this.playingTrack);
    },
  },
};
</script>

<style lang="scss">
.light_theme {
  #tag_albumArt {
    filter: invert(1);
  }
}
.TrackInfo {
  padding-top: 10px;
  position: relative;
  .tag {
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding: 10px;
    pre {
      font-size: 0.8rem;
      background: rgba(0, 0, 0, 0.411);
      padding: 3px;
      border-left: 1px solid white;
      display: inline;
    }
    p {
      margin-top: 5px;
      font-size: 1rem;
      font-family: roboto-thin;
    }
  }
  #tag_albumArt {
    width: 150px;
  }
  #toggleTagEditor {
    position: absolute;
    top: 0px;
    left: 10%;
    transform: translateX(-50%);
  }
}
</style>
