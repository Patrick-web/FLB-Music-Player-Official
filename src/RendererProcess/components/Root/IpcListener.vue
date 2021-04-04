<template>
  <div></div>
</template>
<script>
import { ipcRenderer } from "electron";
import { mapActions, mapMutations } from "vuex";
import { removeDuplicates } from "@/sharedUtilities";
export default {
  methods: {
    ...mapMutations([
      "addTrack",
      "updateTrack",
      "deleteTrack",
      "restoreTracks",
      "restoreRecentlyPlayed",
      "restorePlaylists",
      "restoreSettings",
      "setMostPlayedTracks",
      "popNotification",
      "setDownloadedArtistInfo",
    ]),
    ...mapActions([
      "generateAlbumsData",
      "generateArtistsData",
      "generateFoldersData",
      "sortTracks",
      "removeSelectedTracksFromAppState",
      "fetchArtistsInfo",
      "getLyrics",
    ]),
  },
  mounted() {
    ipcRenderer.send("initializeSettings");
    ipcRenderer.send("initializeApp");
    ipcRenderer.on("newTrack", (e, newTrack) => {
      this.addTrack(newTrack);
    });
    ipcRenderer.on("updatedTrack", (e, updatedTrack) => {
      this.updateTrack(updatedTrack);
    });
    ipcRenderer.on("deleteComplete", (e, pathToTrack) => {
      this.deleteTrack(pathToTrack);
    });
    ipcRenderer.on("processedFiles", (e, tracks) => {
      this.hideOnboard = true;
      this.restoreTracks(tracks);
      this.generateAlbumsData();
      this.generateArtistsData();
      this.generateFoldersData();
      if (navigator.onLine) {
        this.fetchArtistsInfo();
        this.getLyrics();
      }
    });
    ipcRenderer.on("mostPlayedTracks", (e, tracks) => {
      this.setMostPlayedTracks(tracks);
    });
    ipcRenderer.on("recentlyPlayed", (e, tracks) => {
      this.restoreRecentlyPlayed(tracks);
    });
    ipcRenderer.on("userPlaylists", (e, playlists) => {
      this.restorePlaylists(playlists);
    });
    ipcRenderer.on("userSettings", (e, payload) => {
      this.restoreSettings(payload);
    });
    ipcRenderer.on("foldersToScan", (e, folders) => {
      this.setScannedFolders(folders);
    });
    ipcRenderer.on("removeSelectedTracks", () => {
      this.removeSelectedTracksFromAppState();
    });
    ipcRenderer.on("playFirstTrack", () => {
      this.playFirstTrack();
    });
    ipcRenderer.on("parsingDone", () => {
      this.generateAlbumsData();
      this.generateArtistsData();
      this.generateFoldersData();
      this.sortTracks("dateAdded");
      this.hideOnboard = true;
      this.popNotification();
    });
    ipcRenderer.on("parsingProgress", (e, [currentIndex, total]) => {
      if (currentIndex == 100) {
        this.hideOnboard = true;
      }
    });
    const dbInfo = localStorage.getItem("downloadedArtists");
    let downloadedArtists = [];
    if (dbInfo) {
      downloadedArtists = JSON.parse(dbInfo);
    }
    ipcRenderer.on("downloadedArtistPictureInfo", (e, payload) => {
      downloadedArtists.push(payload);
      downloadedArtists = removeDuplicates(downloadedArtists, "name");
      localStorage.setItem(
        "downloadedArtists",
        JSON.stringify(removeDuplicates(downloadedArtists, "name"))
      );
      this.setDownloadedArtistInfo(downloadedArtists);
    });
    window.addEventListener("online", () => {
      this.getLyrics();
      this.fetchArtistsInfo();
    });
  },
};
</script>