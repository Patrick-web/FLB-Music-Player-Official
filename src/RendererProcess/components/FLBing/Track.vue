<template>
  <div class="bingTrack">
    <div class="info">
      <img class="coverArt" :src="trackInfo.albumArt" alt="" />
      <p style="font-family: roboto-light" class="trackTitle">
        {{ trackInfo.title }}
      </p>
      <p style="font-size: 0.9rem" @click="getArtistData" class="artist">
        {{ trackInfo.artist }}
      </p>
    </div>
    <div class="trackActions">
      <base-button
        @click.native="playPreview"
        :icon="require('@/RendererProcess/assets/images/play.svg')"
        :small="true"
      />
      <base-button
        @click.native="downloadTrack"
        :icon="require('@/RendererProcess/assets/images/save_alt.svg')"
        :small="true"
      />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapMutations } from "vuex";
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import { remappedDeezerTracks } from "@/RendererProcess/utilities";

export default {
  components: {
    BaseButton,
  },
  data() {
    return {
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
    ...mapMutations(["setPlayingTrack"]),
    playPreview() {
      fetch(
        `https://api.deezer.com/track/${this.trackInfo.id}`,
        this.requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          const remappedTrack = remappedDeezerTracks([res])[0];
          remappedTrack["defaultTitle"] = remappedTrack["title"];
          remappedTrack["defaultArtist"] = remappedTrack["artist"];
          console.log(remappedTrack);
          this.setPlayingTrack({
            track: remappedTrack,
            index: -10,
          });
        })
        .catch((error) => {
          document.body.classList.remove("loading");
          console.log("error", error);
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
    downloadTrack() {
      fetch(
        "https://apiflbdeezer.herokuapp.com/download/?id=533609232",
        this.requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const link = JSON.parse(result).link;
          fetch(link, this.requestOptions)
            .then((response) => response.text())
            .then((result) => ipcRenderer.send("downloadTrack", result))
            .catch((error) => console.log("error", error));
        })
        .catch((error) => console.log("error", error));
    },
  },
  props: {
    trackInfo: Object,
    overrideCoverArt: String,
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
    cursor: pointer;
  }
  .artist:hover {
    text-decoration: underline;
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
