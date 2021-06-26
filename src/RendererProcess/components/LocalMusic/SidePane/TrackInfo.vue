<template>
  <div v-if="!playingTrack.fileName.match(/mp4|mkv/)" class="TrackInfo">
    <div
      class="tag"
      style="display: flex; align-items: center; justify-content: center"
    >
      <img
        v-if="playingTrack.albumArt"
        :src="'file://' + playingTrack.albumArt"
        id="tag_albumArt"
      />
      <p v-if="!playingTrack.albumArt">No Album Art</p>
    </div>
    <div class="tag">
      <pre class="bg1">Title</pre>
      <p>{{ playingTrack.title || "unknown" }}</p>
    </div>
    <div class="tag">
      <pre class="bg1">Artist</pre>
      <p>{{ playingTrack.artist || "unknown" }}</p>
    </div>
    <div class="tag">
      <pre class="bg1">Album</pre>
      <p>{{ playingTrack.album }}</p>
    </div>
    <div v-if="playingTrack.duration" class="tag">
      <pre class="bg1">Length</pre>
      <p>{{ playingTrack.formattedLength }}</p>
    </div>
    <div class="tag">
      <pre class="bg1">Date Added</pre>
      <p>{{ new Date(playingTrack.dateAdded).toDateString() }}</p>
    </div>
    <div class="tag">
      <pre class="bg1">File name</pre>
      <p>{{ playingTrack.fileName }}</p>
    </div>
    <base-button
      title="Edit Tags"
      id="toggleTagEditor"
      @click.native="emitPlayingTrack"
      :icon="require('@/RendererProcess/assets/images/pen.svg')"
      extraClass="shrink_icon"
      :small="true"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import BaseButton from "../../BaseComponents/BaseButton.vue";

export default {
  components: { BaseButton },
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
.TrackInfo {
  padding-top: 10px;
  position: relative;
  .tag {
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding: 10px;
    pre {
      font-size: 0.8rem;
      padding: 4px 7px;
      display: inline;
      border-radius: 15px;
    }
    p {
      margin-top: 5px;
      font-size: var(--baseFontSize);
      font-family: roboto-thin;
    }
  }
  #tag_albumArt {
    width: 150px;
    border-radius: 15px;
  }
  #toggleTagEditor {
    position: absolute;
    top: 0px;
    left: 10%;
    backdrop-filter: blur(10px);
  }
}
</style>
