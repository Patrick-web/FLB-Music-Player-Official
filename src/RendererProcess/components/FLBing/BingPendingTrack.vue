<template>
  <div class="BingDownloadTrack">
    <div class="track_body">
      <div class="track_info">
        <p>{{ trackInfo.title }}</p>
        <p class="track_artist">{{ trackInfo.artist.name }}</p>
      </div>
      <div class="track_progress">{{ trackInfo.progress }}%</div>
    </div>
    <div class="dl_progress_bar">
      <div
        :style="{ width: trackInfo.progress + '%' }"
        class="dl_progress"
      ></div>
    </div>
    <p class="track_state">{{ trackInfo.state.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    trackInfo: Object,
  },
  mounted() {
    console.log(this.trackInfo);
  },
};
</script>

<style lang="scss">
.BingDownloadTrack {
  background: rgba(255, 255, 255, 0.11);
  padding: 10px;
  margin-bottom: 5px;
  margin-right: 10px;
  border-radius: 10px;
}
.track_body {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
}
.track_artist {
  font-family: roboto-thin;
  font-size: 0.9rem;
}
.dl_progress_bar {
  height: 10px;
  width: 100%;
  border-radius: 10px;
  margin-top: 5px;
  background: rgba(255, 255, 255, 0.24);
  .dl_progress {
    height: 100%;
    width: 0%;
    border-radius: 10px;
    background: white;
  }
}
.track_state {
  font-size: 0.8rem;
}
</style>