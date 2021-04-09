<template>
  <div @click="getAlbumData" class="groupCard">
    <img class="coverArt" :src="albumInfo.cover" alt />
    <div class="groupedCard_info">
      <p class="groupedInfo_title">
        {{ albumInfo.title }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      albumData: {
        name: null,
        cover: null,
        tracks: [],
      },
    };
  },
  methods: {
    getAlbumData() {
      document.body.classList.add("loading");
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.deezer.com/album/${this.albumInfo.id}/tracks`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.albumData.name = this.albumInfo.title;
          this.albumData.cover = this.albumInfo.cover;
          this.albumData.tracks = JSON.parse(result).data;
          this.albumData.tracks.forEach((track) => {
            track["album_cover"] = this.albumData.cover;
          });
          this.$emit("selectedAlbum", this.albumData);
          document.body.classList.remove("loading");
        })
        .catch((error) => console.log("error", error));
    },
  },
  props: {
    albumInfo: Object,
  },
};
</script>

<style lang="scss">
.fetchingInProgress .squareCard {
  cursor: wait !important;
}
.squareCard {
  height: 200px;
  width: 200px;
  margin-right: 10px;
  overflow: hidden;
  transition: 0.4s ease;
  position: relative;
  .thumbnailArea {
    max-height: 11vw;
    // overflow: hidden;
    img {
      transform: rotate(0deg) scale(1);
      transition: transform 0.3s ease;
      width: 100%;
    }
  }
  .cardInfo {
    z-index: 3;
    padding: 8px;
    position: absolute;
    bottom: 0px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.521);
    backdrop-filter: blur(10px);
    h4 {
      font-family: roboto-light;
    }
  }
}
.squareCard:hover {
  cursor: pointer;
  .thumbnailArea {
    img {
      transform: rotate(5deg) scale(1.1);
    }
  }
}
#blurred {
  height: 52px;
  width: 100%;
  position: absolute;
  bottom: -20px;
  left: 0;
  filter: blur(10px);
  z-index: 1;
}
.expandCard {
  max-height: 800px;
  .expandArrow {
    transform: rotate(0deg);
  }
  .cardInfo {
    .infoContent {
      max-height: 800px;
    }
  }
}
</style>
