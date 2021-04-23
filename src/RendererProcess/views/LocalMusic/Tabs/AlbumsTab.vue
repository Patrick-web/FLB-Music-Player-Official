<template>
  <div class="tab groupedContentTab">
    <div v-if="albums.length == 0" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div v-if="!selectedGroup" class="groupCards grid_auto">
      <AlbumCard v-for="album in albums" :key="album.name" :album="album" />
    </div>
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <div v-if="selectedGroup" class="selectedGroup bg1">
        <base-button
          @click.native="deSelectGroup"
          :icon="require('@/RendererProcess/assets/images/back.svg')"
          id="backToUnfilteredItems"
        />
        <div class="sliverBar">
          <div class="sliverBarFooter">
            <div class="groupedCard_info">
              <p class="groupedInfo_title">
                {{ selectedGroup.name }}
              </p>
              <p
                @click="goToArtist(selectedGroup.artist)"
                title="Go To Artist"
                class="groupedInfo_subtitle"
                style="cursor: pointer"
              >
                {{ selectedGroup.artist }}
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
          <img
            class="coverArt"
            :src="selectedGroup.tracks[0].albumArt"
            alt=""
          />
          <img id="blurred" :src="selectedGroup.tracks[0].albumArt" alt="" />
        </div>
        <div class="cardsWrapper">
          <TrackCard
            v-for="(track, index) in selectedGroup.tracks"
            :key="track.path"
            :index="index"
            :source="track"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import TrackCard from "@/RendererProcess/components/Root/Track/TrackCard.vue";
import AlbumCard from "@/RendererProcess/components/LocalMusic/TabsPane/AlbumsTab/AlbumCard.vue";
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";

export default {
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
    ]),
    ...mapActions(["generateAlbumsData", "findAndGoToArtist"]),
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
        title: `Playing ${this.selectedGroup.name} album`,
        subTitle: null,
        type: "normal",
      });
    },
    goToArtist(artist) {
      document.querySelector("#Artists").click();
      this.findAndGoToArtist(artist);
    },
  },
  computed: {
    albums() {
      return this.$store.state.TabsManager.tabsData.albums;
    },
    selectedGroup() {
      return this.$store.state.TrackSelector.selectedGroup;
    },
  },
  components: {
    TrackCard,
    AlbumCard,
    BaseButton,
  },
  mounted() {
    this.generateAlbumsData();
  },
};
</script>

<style lang="scss"></style>
