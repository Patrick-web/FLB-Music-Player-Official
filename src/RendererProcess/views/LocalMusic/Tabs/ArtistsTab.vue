<template>
  <div class="tab ArtistsTab groupedContentTab">
    <TrackCard v-if="0" />
    <div v-if="artists.length == 0" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div v-if="!selectedGroup" class="groupCards grid_auto">
      <ArtistCard
        v-for="artist in artists"
        :key="artist.name"
        :artist="artist"
      />
    </div>
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <div v-if="selectedGroup" class="selectedGroup">
        <div class="sliverBar">
          <div class="sliverBarFooter">
            <div class="groupedCard_info">
              <p class="groupedInfo_title">
                {{ selectedGroup.name }}
              </p>
              <p
                @click="goToArtist(selectedGroup.tracks.artist)"
                class="groupedInfo_subtitle"
              >
                {{ selectedGroup.tracks.artist }}
              </p>
            </div>
            <div class="sliverBarActions">
              <base-button
                @click.native="playAll"
                :icon="require('@/RendererProcess/assets/images/playnext.svg')"
                text="Play All"
              />
              <base-button
                @click.native="addTracksToQueue"
                :icon="
                  require('@/RendererProcess/assets/images/queue-music.svg')
                "
                text="Add To Queue"
              />
            </div>
          </div>

          <base-button
            @click.native="deSelectGroup"
            :icon="require('@/RendererProcess/assets/images/back.svg')"
            id="backToUnfilteredItems"
          />
          <img
            v-if="artistPicture"
            class="coverArt roundImage"
            :src="artistPicture"
          />
          <letter-card v-else :text="selectedGroup.name" />
          <img
            v-if="artistPicture"
            class="coverArt"
            :src="artistPicture"
            alt=""
            id="blurred"
          />
        </div>
        <div class="cardsWrapper">
          <div class="grid2 gap20">
            <div class="artistAlbums">
              <div class="sectionHeading">
                <p>Albums</p>
                <div class="line"></div>
                <p>{{ removeDuplicateAlbums(selectedGroup.albums).length }}</p>
              </div>
              <div class="grid2 content">
                <AlbumCard
                  v-for="album in removeDuplicateAlbums(selectedGroup.albums)"
                  :album="album"
                  :hideArtist="true"
                  :key="album.name"
                />
              </div>
            </div>

            <div class="artistTracks">
              <div class="sectionHeading">
                <p style="margin-left: -10px">Tracks</p>
                <div class="line"></div>
                <p>{{ selectedGroup.tracks.length }}</p>
              </div>
              <div class="content">
                <TrackCard
                  v-for="(track, index) in selectedGroup.tracks"
                  :key="track.path"
                  :index="index"
                  :source="track"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import ArtistCard from "@/RendererProcess/components/LocalMusic/TabsPane/ArtistTab/ArtistCard.vue";
import AlbumCard from "@/RendererProcess/components/LocalMusic/TabsPane/AlbumsTab/AlbumCard.vue";
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
import { removeDuplicates } from "@/sharedUtilities";
import LetterCard from "@/RendererProcess/components/LocalMusic/TabsPane/ArtistTab/LetterCard.vue";
export default {
  data() {
    return {
      card: TrackCard,
      lastScrollTop: 0,
    };
  },
  methods: {
    ...mapMutations([
      "addSelectedTrackToCustomQueue",
      "addToSelectedTracks",
      "UIcontrollerSetPropertyValue",
      "clearSelectedTracks",
      "selectGroup",
      "deSelectGroup",
      "setPlayingTrack",
      "overWriteCustomQueue",
      "pushNotification",
      "setDownloadedArtistInfo",
    ]),
    ...mapActions(["generateArtistsData"]),
    addTracksToQueue() {
      this.UIcontrollerSetPropertyValue({
        property: "currentSidePaneTab",
        newValue: "Queue",
      });
      this.clearSelectedTracks();
      this.selectedGroup.tracks.forEach((track) => {
        this.addToSelectedTracks(track);
      });
      this.addSelectedTrackToCustomQueue();
      this.pushNotification({
        title: "Tracks addded to the queue",
        subTitle: null,
        type: "normal",
      });
    },
    playAll() {
      this.setPlayingTrack({ track: this.selectedGroup.tracks[0], index: 0 });
      this.overWriteCustomQueue(this.selectedGroup.tracks);
      this.pushNotification({
        title: "Playing all tracks from",
        subTitle: this.selectedGroup.name,
        type: "normal",
      });
    },
    goToAlbum(album) {
      document.querySelector("#Albums").click();
      this.selectGroup(album);
      this.query = "";
    },
    goToArtist() {
      document.querySelector("#Artists").click();
      this.findAndGoToArtist(this.artist.name);
    },
    removeDuplicateAlbums(arr) {
      return removeDuplicates(arr, "name");
    },
  },
  computed: {
    artists() {
      return this.$store.state.TabsManager.tabsData.artists;
    },
    selectedGroup() {
      return this.$store.state.TrackSelector.selectedGroup;
    },
    artistPicture() {
      return (
        this.$store.state.TabsManager.downloadedArtistPictures.filter(
          (artistPicInfo) => artistPicInfo.name == this.selectedGroup.name
        )[0]?.pathToPicture || false
      );
    },
  },
  components: {
    ArtistCard,
    TrackCard,
    AlbumCard,
    BaseButton,
    LetterCard,
  },
  mounted() {
    this.generateArtistsData();
    const dbInfo = localStorage.getItem("downloadedArtists");
    let downloadedArtists = [];
    if (dbInfo) {
      downloadedArtists = JSON.parse(dbInfo);
      this.setDownloadedArtistInfo(downloadedArtists);
    }
  },
};
</script>

<style lang="scss">
.playingPaneLoaded {
  .cardsWrapper {
    height: 60% !important;
  }
}
.ArtistsTab {
  .sliverBar {
    .LetterCard {
      transform: translateY(40px);
      h1 {
        font-size: 7rem;
      }
    }
  }
  .cardsWrapper {
    overflow-y: hidden !important;
    height: 60%;
    .grid2 {
      height: 100%;
    }
  }
  .artistTracks,
  .artistAlbums {
    height: 100%;
    .content {
      height: 31vh;
      overflow: hidden;
      overflow-y: scroll;
      position: relative;
      padding: 10px;
    }
  }
}
</style>
