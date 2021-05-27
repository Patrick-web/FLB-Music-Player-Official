<template>
  <div class="ytPage">
    <div
      v-if="!searchResults.length"
      class="centerContents"
      style="height: 100%; width: 100%"
    >
      <h1 id="noBingResults">No Results Found</h1>
    </div>
    <div class="grid_auto_big gap10">
      <youtube-track
        v-for="video in searchResults"
        :key="video.id"
        :ytTrack="video"
        v-on:playYTVideo="playYTVideo"
      />
    </div>
    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster"
    >
      <YTVideoPlayer
        v-on:closeYTPlayer="closeYTPlayer"
        :srcString="ytSrc"
        v-if="showYTPlayer"
        ref="ytPlayer"
      />
    </transition>
  </div>
</template>

<script>
import YoutubeTrack from "./YoutubeTrack.vue";
import YTVideoPlayer from "./YTVideoPlayer.vue";
export default {
  data() {
    return {
      searchResults: [],
      showYTPlayer: false,
      ytSrc: "",
    };
  },
  methods: {
    playYTVideo(srcString) {
      this.ytSrc = srcString;
      this.showYTPlayer = true;
    },
    closeYTPlayer() {
      this.showYTPlayer = false;
    },
    searchInYoutube(searchQuery) {
      this.notifySearchInProgress();
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("X-API-KEY", "RPHGBA-YTUUDP-FUZWMW-YBAEGW-ARQ");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        `https://thearq.tech/youtube?query=${searchQuery}&count=1`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const responseRes = JSON.parse(result);
          if (responseRes.ok) {
            this.searchResults = responseRes.result;
            this.notifySearchFinished();
          }
        })
        .catch(() => {
          this.notifySearchFinished();

          //sd
        });
    },
    notifySearchInProgress() {
      this.$emit("searchInProgress");
    },
    notifySearchFinished() {
      this.$emit("searchDone");
    },
  },
  components: { YoutubeTrack, YTVideoPlayer },
};
</script>

<style>
.ytPage {
  overflow: hidden;
  overflow-y: scroll;
  height: 103%;
}
</style>