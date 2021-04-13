<template>
  <div class="TagEditor">
    <p class="modalClose" @click="UIcontrollerToggleProperty('showTagEditor')">
      <img src="@/RendererProcess/assets/images/x.svg" alt="" />
    </p>
    <div class="centerContents">
      <h1 class="modalTitle">Tag Editor</h1>
    </div>
    <div class="trackTags">
      <div class="centerContents">
        <img id="coverArtTag" :src="targetTrack.albumArt" alt="" />
        <p style="margin-top: 10px" v-if="!targetTrack.albumArt">
          No Album Art
        </p>
        <div class="grid2 gap10 tag">
          <base-button @click.native="importCover" text="Import Picture" />
          <base-button
            @click.native="searchAlbumArt = true"
            text="Search Online"
          />
        </div>
      </div>
      <div class="tag">
        <p>Current Title : {{ targetTrack.title || "unknown" }}</p>
        <input
          placeholder="New Title"
          v-model="newTitle"
          id="titleTag"
          class="inputElem"
        />
      </div>
      <div class="tag">
        <p>Current Artist : {{ targetTrack.artist || "unknown" }}</p>
        <input
          placeholder="New Artist"
          v-model="newArtist"
          class="inputElem"
          id="artistTag"
        />
      </div>
      <div class="tag">
        <p>Current Album : {{ targetTrack.album }}</p>
        <input
          placeholder="New Album"
          v-model="newAlbum"
          class="inputElem"
          id="albumTag"
        />
      </div>
      <div v-if="searchAlbumArt" class="possibleCovers">
        <p>Album Art Search</p>
        <div class="centerContents">
          <input
            type="text"
            v-model="query"
            @keyup.enter="searchImage"
            class="inputElem"
            placeholder="Search"
          />
          <button @click="searchImage"><h2>Search</h2></button>
        </div>
        <div
          v-if="possibleAlbumArt.length == 0 && searching"
          class="loadingArea"
        >
          <div class="loadingIndicator"></div>
        </div>
        <div class="possibles">
          <img
            v-for="cover in possibleAlbumArt"
            :key="cover.url"
            :src="cover.url"
            alt=""
            @click="selectCover(cover.url)"
          />
        </div>
      </div>
    </div>
    <div class="tag">
      <div class="animated faster">
        <base-button
          :active="true"
          :block="true"
          @click.native="saveChanges"
          text="Save Changes"
        />
      </div>
    </div>
    <p style="margin: 10px">File Name : {{ targetTrack.fileName }}</p>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapMutations } from "vuex";
import gis from "g-i-s";
import BaseButton from "../../BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
  data() {
    return {
      possibleAlbumArt: [],
      selectedCover: "",
      isOnline: false,
      newTitle: "",
      newAlbum: "",
      newArtist: "",
      newAlbumArt: "",
      query: "",
      cover: "",
      searchAlbumArt: false,
      searching: false,
    };
  },
  computed: {
    playingTrack() {
      return this.$store.state.PlaybackManger.playingTrackInfo.track;
    },
  },
  methods: {
    ...mapMutations(["UIcontrollerToggleProperty"]),
    selectCover(url) {
      this.selectedCover = url;
      document.querySelector("#coverArtTag").src = url;
    },
    importCover() {
      ipcRenderer.send("importCoverArt");
    },
    saveChanges() {
      const newAlbumArt = document.querySelector("#coverArtTag");
      let newAlbumArtSrc;
      if (newAlbumArt) {
        newAlbumArtSrc = newAlbumArt.src;
      }
      const tags = {};
      if (this.newTitle) {
        tags["title"] = this.newTitle;
      }
      if (this.newArtist) {
        tags["artist"] = this.newArtist;
      }
      if (this.newAlbum) {
        tags["album"] = this.newAlbum;
      }
      if (newAlbumArtSrc && this.targetTrack.albumArt != newAlbumArtSrc) {
        tags.APIC = newAlbumArtSrc;
      }
      const data = {
        track: this.targetTrack,
        tagChanges: tags,
      };
      if (Object.keys(data.tagChanges).length !== 0) {
        this.$emit("changedTags", data);
        ipcRenderer.send("updateTags", data);
      }
      this.UIcontrollerToggleProperty("showTagEditor");
    },
    searchImage() {
      this.possibleAlbumArt = [];
      this.searching = true;
      gis(this.query, (error, results) => {
        console.log("logging results");
        if (error) {
          console.log(error);
        } else {
          if (results.length > 1) {
            this.possibleAlbumArt = results.slice(0, 10);
          }
        }
      });
    },
  },
  mounted() {
    ipcRenderer.on("importedCoverArt", (e, data) => {
      document.querySelector("#coverArtTag").src = data;
    });
    window.addEventListener("online", () => {
      this.isOnline = true;
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  },
  props: {
    targetTrack: Object,
  },
};
</script>

<style lang="scss">
.TagEditor {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.315);
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
  padding: 10px;
  top: 40px;
  right: 0%;
  z-index: 50;
  width: 270px;
  color: white;

  p {
    font-family: roboto-thin;
    margin-bottom: 5px;
  }
  #coverArtTag {
    width: 140px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .tag {
    padding: 10px;
  }

  .bt {
    padding: 5px;
    margin-bottom: 10px;
    padding-top: 8px;
    width: 100%;
    text-align: center;
    border-radius: 20px;
    font-size: 1.2em;
    font-family: roboto;
    transition: 0.2s ease;
    background: rgba(255, 255, 255, 0.055);
    cursor: pointer;
  }
  p:hover {
    border-radius: 12px;
  }
  .possibleCovers {
    padding: 10px;
    position: absolute;
    left: -2px;
    top: 0px;
    transform: translateX(-100%);
    background-color: rgb(22, 22, 22);
    width: 100%;
    .possibles {
      margin-top: 10px;
      max-height: 440px;
      overflow: hidden;
      overflow-y: scroll;
    }
    img {
      width: 100%;
      cursor: pointer;
    }
    img:hover {
      transform: scale(0.9);
    }
  }
}
</style>
