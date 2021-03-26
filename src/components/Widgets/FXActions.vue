<template>
  <div v-if="bulkSelected.length > 0" class="FxModeActions">
    <div v-if="!selectedAction" class="actionsSelect">
      <h1>Select Action</h1>
      <div @click="switchToAction('Delete Selected Files?')" class="action">
        <img src="@/assets/images/trash-bin-outline.svg" alt="" />
        <p>Delete from Computer</p>
      </div>
      <div @click="switchToAction('Tag Changer')" class="action">
        <img
          style="width: 15px; margin-right: 13px"
          src="@/assets/images/pen.svg"
          alt=""
        />
        <p>Change Tags</p>
      </div>
      <div @click="switchToAction('Merge Selected Audio?')" class="action">
        <img src="@/assets/images/merge.svg" alt="" />
        <p>Merge to One</p>
      </div>
      <div @click="switchToAction('Select Output File Type')" class="action">
        <img style="width: 22px" src="@/assets/images/convert.svg" alt="" />
        <p>Convert</p>
      </div>
      <div @click="switchToAction('Select Playlist')" class="action">
        <img src="@/assets/images/playlist_add.svg" alt="" />
        <p>Add To Playlist</p>
      </div>
      <div @click="addBulkToQueue" class="action">
        <img src="@/assets/images/queue-music.svg" alt="" />
        <p>Add To Queue</p>
      </div>
    </div>
    <div v-if="selectedAction" class="actionContainer">
      <img
        @click="selectedAction = ''"
        id="actionBackBt"
        src="@/assets/images/back.svg"
        alt=""
      />
      <h3>{{ selectedAction }}</h3>
      <br />
      <div
        v-if="selectedAction == 'Select Output File Type'"
        class="fx_converter"
      >
        <div class="types">
          <div
            v-for="type in fileTypes"
            :key="type"
            @click="selectFileType($event, type)"
            class="fileType"
          >
            {{ type }}
          </div>
        </div>
        <button @click="bulkConvert"><h3>Convert</h3></button>
      </div>
      <div v-if="selectedAction == 'Select Playlist'" class="fx_playlistAdder">
        <p
          @click="addToBulkPlaylist(playlist.name)"
          v-for="playlist in playlists"
          :key="playlist.name"
          class="playlistName"
        >
          {{ playlist.name }}
        </p>
      </div>

      <div
        v-if="selectedAction == 'Delete Selected Files?'"
        class="fx_deleteConfirmation"
      >
        <div class="confirmationBts">
          <button @click="bulkDelete"><h3>Yes</h3></button>
          <button class="dangerBt"><h3>Cancel</h3></button>
        </div>
      </div>

      <div v-if="selectedAction == 'Tag Changer'" class="fx_tagWriter">
        <div class="tags">
          <div class="tag">
            <div class="center-content">
              <img id="coverArtTag" width="100px" alt="" />
            </div>
            <button @click="importCover" id="selectCoverArt">
              <p>Import Common Album Art</p>
            </button>
          </div>
          <div class="tag">
            <p>Album</p>
            <input v-model="tagAlbum" class="inputElem" type="text" />
          </div>
          <div class="tag">
            <p>Artist</p>
            <input v-model="tagArtist" class="inputElem" type="text" />
          </div>
          <button @click="bulkTagWrite"><h3>Save Changes</h3></button>
        </div>
      </div>

      <div v-if="selectedAction == 'Merge Selected Audio?'" class="fx_merger">
        <div class="confirmationBts">
          <p>Enter output file name</p>
          <input class="inputElem" type="text" v-model="outputFileName" />
          <button @click="bulkMerge" v-if="outputFileName">
            <h3>Merge</h3>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["bulkSelected", "playlists"]),
  },
  data() {
    return {
      selectedAction: null,
      selectedTracks: null,
      outputFileName: null,
      tagCover: null,
      tagArtist: null,
      tagAlbum: null,
      fileTypes: ["mp3", "wav", "ogg", "m4a"],
      selectedFileType: null,
    };
  },
  methods: {
    ...mapMutations([
      "addToQueue",
      "selectATrack",
      "addSelectedTracksToPlaylist",
      "removeFromAddedTracks",
    ]),
    switchToAction(title) {
      this.selectedAction = title;
    },
    selectFileType(e, type) {
      if (document.querySelector(".selectedType")) {
        document
          .querySelector(".selectedType")
          .classList.remove("selectedType");
      }
      e.currentTarget.classList.add("selectedType");
      this.selectedFileType = type;
    },
    addBulkToQueue() {
      this.bulkSelected.forEach((track) => {
        this.addToQueue(track);
      });
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: "Tracks added to queue",
      });
      document.querySelector(".queueTabIcon").click();
    },
    addToBulkPlaylist(playlist) {
      this.bulkSelected.forEach((track) => {
        this.selectATrack(track);
        this.addSelectedTracksToPlaylist(playlist);
      });
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: `Tracks added to ${playlist} playlist`,
      });
    },
    bulkConvert() {
      this.bulkSelected.forEach((track) => {
        electron.ipcRenderer.send("convertFile", {
          path: track.path.replace("file://", ""),
          outputFileType: this.selectedFileType,
        });
      });
      this.selectedAction = "";
    },
    bulkDelete() {
      this.selectedAction = "";
      this.selectedTracks = Array.from(
        document.querySelectorAll(".bulkSelected")
      ).map((track) => parseInt(track.getAttribute("id")));
      this.selectedTracks.forEach((trackIndex) => {
        this.removeFromAddedTracks(trackIndex);
      });
      this.bulkSelected.forEach((track) => {
        setTimeout(() => {
          electron.ipcRenderer.send("deleteFile", track.path);
        }, 1500);
      });
    },
    bulkTagWrite() {
      let tags = {};
      if (this.tagCover) {
        tags["APIC"] = this.tagCover;
      }
      if (this.tagArtist) {
        tags["artist"] = this.tagArtist;
      }
      if (this.tagAlbum) {
        tags["album"] = this.tagAlbum;
      }
      this.bulkSelected.forEach((track) => {
        setTimeout(() => {
          const data = {
            path: track.path.replace("file://", ""),
            tags: tags,
          };
          console.log(tags);
          if (Object.keys(data.tags).length !== 0) {
            electron.ipcRenderer.send("updateTags", data);
          }
        }, 1000); //tag write takes time
      });
      this.selectedAction = "";
    },
    importCover() {
      electron.ipcRenderer.send("importCoverArt");
    },
    bulkMerge() {
      electron.ipcRenderer.send("mergeFiles", [
        this.bulkSelected.map((track) => track.path.replace("file://", "")),
        this.outputFileName,
      ]);
      this.selectedAction = "";
    },
  },
  mounted() {
    electron.ipcRenderer.on("importedCoverArt", (e, data) => {
      document.querySelector("#coverArtTag").src = data;
      this.tagCover = data;
    });
    if (navigator.onLine) {
      electron.ipcRenderer.send("downloadBinaries");
    }
  },
};
</script>

<style lang="scss">
.FxModeActions {
  position: absolute;
  z-index: 30;
  padding: 10px;
  top: 20%;
  right: 10%;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 50px black;
  border: 1px solid rgba(255, 255, 255, 0.315);
  border-radius: 20px;
  overflow: hidden;
  h1,
  h3 {
    text-align: center;
  }
  input {
    background: rgba(255, 255, 255, 0.116);
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.13);
    outline: none;
    padding: 5px;
    margin-top: 5px;
    width: 100%;
  }
  p {
    font-family: roboto-light;
  }
  #actionBackBt {
    position: absolute;
    width: 20px;
    margin-top: 2px;
    padding: 2px;
    background: rgb(0, 0, 0);
    border-radius: 10px;
    cursor: pointer;
  }
  #actionBackBt:hover {
    filter: invert(1);
  }
  .actionContainer {
    position: relative;
  }
  .action {
    display: flex;
    align-items: center;
    padding: 10px;
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    cursor: pointer;
    img {
      width: 20px;
      margin-right: 10px;
    }
  }
  .action:hover {
    background-color: #ffffff1e;
    border-radius: 20px;
    margin: 5px;
  }
  .fx_tagWriter {
    .tags {
      .tag {
        margin-bottom: 10px;
      }
    }
  }
  .fx_converter {
    .types {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }
    .fileType {
      background: rgba(0, 0, 0, 0.39);
      padding: 15px;
      height: 50px;
      border-radius: 30px;
      text-align: center;
      cursor: pointer;
    }
    .fileType:hover {
      background: #0062ff;
    }
    .selectedType {
      background: #0062ff;
      cursor: default;
    }
  }
}
</style>
