<template>
  <div class="bingTrack">
    <div class="info">
      <img class="coverArt" :src="trackInfo.album.cover" alt="" />
      <p style="font-family: roboto-light" class="trackTitle">
        {{ trackInfo.title }}
      </p>
      <p style="font-size: 0.9rem" @click="getArtistData" class="artist">
        {{ trackInfo.artist.name }}
      </p>
    </div>
    <div class="trackActions">
      <base-button
        @click.native="playPreview"
        :icon="require('@/RendererProcess/assets/images/play.svg')"
        :small="true"
      />
      <base-button
        @click.native="getTrackDownloadURL"
        :icon="require('@/RendererProcess/assets/images/save_alt.svg')"
        :small="true"
        :loading="isBeingDownloaded"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import { ipcRenderer } from "electron";

export default {
  components: {
    BaseButton,
  },
  computed: {
    isBeingDownloaded() {
      return this.$store.state.BingDownloadManager.pendingDownloads.findIndex(
        (track) => track.id === this.trackInfo.id
      ) == -1
        ? false
        : true;
    },
  },
  data() {
    return {
      downloadURL: "",
      artistData: {
        name: null,
        cover: null,
        tracks: [],
        albums: [],
      },
      requestOptions: {
        method: "GET",
        redirect: "follow",
      },
    };
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "setTrackDownloadURL",
      "addTrackToPendingDownloads",
      "updatePendingTrackState",
      "removeTrackFromPendingDownloads",
    ]),
    playPreview() {
      const remappedTrack = {};
      remappedTrack["defaultTitle"] = this.trackInfo.title;
      remappedTrack["defaultArtist"] = this.trackInfo.artist.name;
      remappedTrack["album"] = this.trackInfo.album.title;
      remappedTrack["albumArt"] = this.trackInfo.album.cover;
      remappedTrack["previewURL"] = this.trackInfo.preview;
      console.log(remappedTrack);
      this.setPlayingTrack({
        track: remappedTrack,
        index: -10,
      });
    },
    getArtistData() {
      fetch(
        `https://api.deezer.com/artist/${this.trackInfo.artist_id}`,
        this.requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.artistData.name = JSON.parse(result).name;
          this.artistData.cover = JSON.parse(result).picture_big;
          fetch(
            `https://api.deezer.com/artist/${this.trackInfo.artist_id}/top?limit=50`,
            this.requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              this.artistData.tracks = JSON.parse(result).data;
            })
            .catch((error) => console.log("error", error));
          fetch(
            `https://api.deezer.com/artist/${this.trackInfo.artist_id}/albums`,
            this.requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              this.artistData.albums = JSON.parse(result).data;
              this.setBingArtistInfo(this.artistData);
              document.body.classList.remove("loading");
            })
            .catch((error) => console.log("error", error));
        })
        .catch((error) => {
          document.body.classList.remove("loading");
          console.log("error", error);
        });
    },
    updateDownloadQueue() {
      const downloadTrack = {
        ...this.trackInfo,
        progress: 0,
        downloadURL: "",
        state: "Getting Download Link...",
      };
      this.addTrackToPendingDownloads(downloadTrack);
    },
    getTrackDownloadURL() {
      if (
        !document
          .querySelector(".BingDownloadsWidget")
          .classList.contains("showDownloadWidget")
      ) {
        document.querySelector(".widgetToggleBt").click();
      }

      this.updateDownloadQueue();
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const searchQuery = `${encodeURI(
        this.trackInfo.title.replace(/(")|(\/)|(\\)|(\.)|(,)|(\))|(\()/g, "")
      )} ${encodeURI(
        this.trackInfo.artist.name.replace(
          /(")|(\/)|(\\)|(\.)|(,)|(\))|(\()/g,
          ""
        )
      )}`;
      fetch(
        `https://thearq.tech/deezer?query=${searchQuery}&count=1`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          if (JSON.parse(result) == "list index out of range") {
            this.updatePendingTrackState({
              id: this.trackInfo.id,
              stateCode: "Download Link Not Found 💀",
            });
            return;
          }
          console.log(JSON.parse(result));
          const targetTrack = JSON.parse(result)[0];
          this.downloadURL = targetTrack.url;
          this.setTrackDownloadURL({
            id: this.trackInfo.id,
            url: this.downloadURL,
          });
          this.sendTrackForDownload();
        })
        .catch((error) => {
          this.updatePendingTrackState({
            id: this.trackInfo.id,
            stateCode: "Please Check Your Internet Connection",
          });
        });
    },
    sendTrackForDownload() {
      const tags = {
        title: this.trackInfo.title.replace(/(")|(\/)/g, ""),
        artist: this.trackInfo.artist.name,
        album: this.trackInfo.album.title,
        APIC: this.trackInfo.album.cover_big,
      };
      const artistInfo = {
        name: this.trackInfo.artist.name,
        picture: this.trackInfo.artist.picture,
      };
      ipcRenderer.send("downloadBingTrack", {
        trackURL: this.downloadURL,
        trackID: this.trackInfo.id,
        tags,
        artistInfo,
      });
    },
  },
  props: {
    trackInfo: Object,
  },
};
</script>

<style lang="scss">
.bingTrack {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.377);
  .info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  p {
    font-size: 0.95rem;
    font-family: roboto-thin;
  }
  .coverArt {
    width: 35px;
  }
  .trackBt {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0);
    padding: 5px;
    border-radius: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 10px;
  }
  .artist {
    font-size: 1em;
  }
  .trackActions {
    display: flex;
  }
}
.track:hover {
  cursor: default !important;
  .trackBt:hover {
    cursor: pointer;
    border: 1px solid rgb(255, 255, 255);
  }
}
</style>