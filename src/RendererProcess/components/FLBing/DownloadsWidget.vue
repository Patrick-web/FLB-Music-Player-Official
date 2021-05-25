<template>
  <div
    :class="[
      showWidget ? 'showDownloadWidget' : '',
      'BingDownloadsWidget',
      'bg2',
    ]"
  >
    <div class="content_wrapper">
      <h3>Downloads</h3>
      <div class="tab_switcher">
        <div
          @click="tab = 'Pending'"
          :class="[tab == 'Pending' ? 'activeSwitcher' : '', 'switcher']"
        >
          Pending ⏲
        </div>
        <div
          @click="tab = 'Completed'"
          :class="[tab == 'Completed' ? 'activeSwitcher' : '', 'switcher']"
        >
          Completed 🧱
        </div>
      </div>
      <transition
        enter-active-class="animated slideInLeft faster"
        leave-active-class="animated slideOutLeft"
      >
        <div v-if="tab == 'Pending'" class="pending_tracks tracks_wrapper">
          <bing-pending-track
            v-for="track in downloadQueue"
            :key="track.id"
            :trackInfo="track"
          />
        </div>
      </transition>

      <transition
        enter-active-class="animated slideInRight faster"
        leave-active-class="animated slideOutRight"
      >
        <div v-if="tab !== 'Pending'" class="tracks_wrapper downloadedTracks">
          <bing-completed-track
            v-for="track in [...completedTracks, ...flbingFolderTracks]"
            :key="track.fileLocation"
            :track="track"
          />
        </div>
      </transition>
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
    flbingFolderTracks() {
      return this.$store.state.TabsManager.tabsData.addedTracks.filter(
        (track) => track.folderInfo.name == "FLBing"
      );
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
.playingPaneLoaded {
  .BingDownloadsWidget {
    height: 98%;
    border-radius: 15px;
    margin-right: 10px;
    margin-top: 10px;
  }
}
.widgetVisible {
  .BingDownloadsWidget {
    width: 370px !important;
  }
}
.BingDownloadsWidget {
  height: 102%;
  transform: translateY(-10px) translateX(10px);
  width: 0px;
  position: relative;
  overflow: hidden;
  .content_wrapper {
    width: 280px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
  h3 {
    text-align: center;
    font-size: 1.3rem;
    padding: 8px;
  }
  .tab_switcher {
    width: 95%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 10px;
    // border-bottom-right-radius: 15px;
    border-radius: 15px;
    overflow: hidden;
    .switcher {
      background: rgba(255, 255, 255, 0.158);
      border-radius: 15px;
      padding: 5px;
      padding-right: 12px;
      padding-left: 12px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.274);
      }
    }
    .activeSwitcher {
      background: var(--accentColor);
      pointer-events: none;
    }
  }

  .tracks_wrapper {
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
    height: 86%;
  }
  .downloadedTracks {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    padding-left: 10px;
  }
  .pending_tracks {
    padding-left: 10px;
  }
}
.showDownloadWidget {
  height: 0%;
  transform: translateX(0%);
}
.widgetToggleBt {
  position: fixed;
  bottom: -12.5%;
  right: 5%;
  transform: translate(-40%, -50%);
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
  }
}
</style>