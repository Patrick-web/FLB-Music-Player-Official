<template>
  <div></div>
</template>
<script>
import { ipcRenderer } from "electron";
import { mapActions, mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations([
      "addTrack",
      "restoreTracks",
      "restoreRecentlyPlayed",
      "restorePlaylists",
      "restoreSettings",
      "setMostPlayedTracks",
      "popNotification",
    ]),
    ...mapActions([
      "generateAlbumsData",
      "generateArtistsData",
      "generateFoldersData",
      "sortTracks",
      "removeSelectedTracksFromAppState",
    ]),
  },
  mounted() {
    ipcRenderer.send("initializeSettings");
    ipcRenderer.send("initializeApp");
    ipcRenderer.on("newTrack", (e, newTrack) => {
      this.addTrack(newTrack);
      console.log("Adding " + newTrack.fileName);
    });
    ipcRenderer.on("processedFiles", (e, tracks) => {
      this.hideOnboard = true;
      this.restoreTracks(tracks);
      this.generateAlbumsData();
      this.generateArtistsData();
      this.generateFoldersData();
    });
    ipcRenderer.on("mostPlayedTracks", (e, tracks) => {
      this.setMostPlayedTracks(tracks);
    });
    ipcRenderer.on("recentlyPlayed", (e, tracks) => {
      console.log(tracks);
      this.restoreRecentlyPlayed(tracks);
    });
    ipcRenderer.on("userPlaylists", (e, playlists) => {
      this.restorePlaylists(playlists);
      ("restoreSettings");
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

    window.addEventListener("online", () => {
      console.log("online");
    });
  },
};
</script>