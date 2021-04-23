<template>
  <div
    :class="[showWidget ? 'showDownloadWidget' : '', 'BingDownloadsWidget ']"
  >
    <h3>Downloads</h3>
    <div class="tab_switcher">
      <div
        @click="tab = 'Pending'"
        :class="[tab == 'Pending' ? 'activeSwitcher' : '', 'switcher']"
      >
        Pending
      </div>
      <div
        @click="tab = 'Completed'"
        :class="[tab == 'Completed' ? 'activeSwitcher' : '', 'switcher']"
      >
        Completed
      </div>
    </div>
    <div class="widgetToggleBt" @click="showWidget = !showWidget">
      <img src="@/RendererProcess/assets/images/arrowDown.svg" />
    </div>
    <div v-if="tab == 'Pending'" class="pending_tracks tracks_wrapper">
      <bing-pending-track
        v-for="track in downloadQueue"
        :key="track.id"
        :trackInfo="track"
      />
    </div>
    <div v-else class="tracks_wrapper downloadedTracks">
      <bing-completed-track
        v-for="track in completedTracks"
        :key="track.fileLocation"
        :track="track"
      />
    </div>
  </div>
</template>

<script>
import BingCompletedTrack from "./BingCompletedTrack.vue";
// import BaseButton from "../BaseComponents/BaseButton.vue";
import BingPendingTrack from "./BingPendingTrack";

export default {
  data() {
    return {
      tab: "Pending",
      showWidget: false,
    };
  },
  computed: {
    downloadQueue() {
      return this.$store.state.BingDownloadManager.pendingDownloads;
    },
    completedTracks() {
      return this.$store.state.BingDownloadManager.completedDownloads;
    },
  },
  components: {
    BingPendingTrack,
    BingCompletedTrack,
    // BaseButton,
  },
  mounted() {
    console.log(this.downloadQueue);
  },
};
</script>

<style lang="scss">
.BingDownloadsWidget {
  z-index: 10;
  position: absolute;
  right: 0px;
  top: 0px;
  height: 98%;
  width: 20vw;
  border-radius: 10px;
  background: var(--accentColor);
  box-shadow: -5px 0px 6px rgba(0, 0, 0, 0.308);
  transform: translateX(100%);

  h3 {
    text-align: center;
    font-size: 1.3rem;
    padding: 8px;
    background: var(--accentColor);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .tab_switcher {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
    .switcher {
      background: rgba(255, 255, 255, 0.158);
      width: 35%;
      text-align: center;
      padding: 5px;
      border-radius: 20px;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.274);
      }
    }
    .activeSwitcher {
      background: white;
      color: black;
      &:hover {
        background: white;
      }
    }
  }

  .tracks_wrapper {
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
    height: 92%;
  }
  .downloadedTracks {
    display: column;
    columns: 2;
    gap: 5px;
    padding-left: 10px;
  }
  .pending_tracks {
    padding-left: 10px;
  }
}
.showDownloadWidget {
  transform: translateX(0%);
  .widgetToggleBt {
    transform: translate(-40%, -50%) rotate(90deg);
    img {
      transform: translateY(0px);
    }
  }
}
.widgetToggleBt {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(-40%, -50%) rotate(-90deg);
  height: 40px;
  width: 40px;
  background: var(--accentColor);
  //   box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.377);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
  img {
    width: 50%;
    transform: translateY(-5px);
  }
}
</style>