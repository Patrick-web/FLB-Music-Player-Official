<template>
  <div class="TagEditor widget blurred_bg blur10">
    <div class="widget_header">
      <h1 class="widget_title">Tag Editor</h1>
      <base-button
        @click.native="UIcontrollerToggleProperty('showTagEditor')"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        extraClass="widget_close shrink_icon circle shrink8"
        :small="true"
      />
    </div>
    <div class="trackTags">
      <div class="tag flex-col center-a">
        <img id="coverArtTag" :src="'file://' + targetTrack.albumArt" />
        <p style="margin-top: 10px" v-if="!targetTrack.albumArt">
          No Album Art 🖼
        </p>
        <div class="grid2 gap10">
          <base-button @click.native="importCover" text="Import Picture" />
          <base-button
            @click.native="UIcontrollerToggleProperty('showImageSearcher')"
            text="Search Online"
          />
        </div>
      </div>
      <div class="tag bg1">
        <div class="flex-col gap10">
          <p>Title🖊</p>
          <p
            style="
              white-space: nowrap;
              text-overflow: ellipsis;
              max-height: 2ch;
              overflow: hidden;
            "
            class="text-small-1"
          >
            {{ targetTrack.title || "unknown" }}
          </p>
        </div>
        <input
          placeholder="New Title"
          v-model="newTitle"
          id="titleTag"
          class="inputElem"
        />
      </div>
      <div class="tag bg1">
        <div class="flex-col gap10">
          <p>Artist🎙</p>
          <p class="text-small-1">{{ targetTrack.artist || "unknown" }}</p>
        </div>
        <input
          placeholder="New Artist"
          v-model="newArtist"
          class="inputElem"
          id="artistTag"
        />
      </div>
      <div class="tag bg1">
        <div class="flex-col gap10">
          <p>Album🧊</p>
          <p class="text-small-1">{{ targetTrack.album }}</p>
        </div>
        <input
          placeholder="New Album"
          v-model="newAlbum"
          class="inputElem"
          id="albumTag"
        />
      </div>
    </div>
    <base-button
      :active="true"
      :block="true"
      @click.native="saveChanges"
      text="Save Changes"
    />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapMutations } from "vuex";
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
        tags.APIC = newAlbumArtSrc.replace("file:///", "");
        console.log(tags.APIC);
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
  border-radius: 20px;
  z-index: 50;
  width: 240px;
  color: white;

  p {
    font-family: roboto-thin;
    margin-bottom: 5px;
  }
  #coverArtTag {
    width: 100px;
    margin-bottom: 5px;
    border-radius: 15px;
    transform: translateX(50%);
  }
  .tag {
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 15px;
    input {
      width: 95%;
    }
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
}
</style>
