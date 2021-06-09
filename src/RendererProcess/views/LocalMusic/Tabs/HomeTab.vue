<template>
  <div class="home">
    <div class="stats">
      <div class="stats_title">
        <h1>Library Stats</h1>
      </div>
      <div class="statsWrapper">
        <div @click="routeTo('Tracks')" class="statCard">
          <h2>{{ tabsData.addedTracks.length }}</h2>
          <p>Tracks</p>
          <img
            class="fade_to_7"
            src="@/RendererProcess/assets/images/music_note.svg"
          />
        </div>
        <div @click="routeTo('Albums')" class="statCard">
          <h2>{{ tabsData.albums.length }}</h2>
          <p>Albums</p>
          <img
            class="fade_to_7"
            src="@/RendererProcess/assets/images/album.svg"
          />
        </div>
        <div @click="routeTo('Artists')" class="statCard">
          <h2>{{ tabsData.artists.length }}</h2>
          <p>Artists</p>
          <img
            src="@/RendererProcess/assets/images/user.svg"
            class="fade_to_7"
          />
        </div>
        <div @click="routeTo('Folders')" class="statCard">
          <h2>{{ tabsData.folders.length }}</h2>
          <p>Folders</p>
          <img src="@/RendererProcess/assets/images/folder.svg" />
        </div>
      </div>
    </div>
    <hr />
    <div class="stats">
      <div class="stats_title">
        <h1>Daily Mixes</h1>
      </div>
      <div class="mixesWrapper">
        <MixCard
          v-for="mix in mixes"
          :key="mix.name"
          :cardTitle="mix.name"
          :cardContent="mix.info"
          :tracks="mix.tracks"
        />
        <div style="font-size: 0.8rem; font-family: roboto-thin">
          * More Daily Mashups will come as you keep on listening *
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { MixGenerator } from "@/RendererProcess/utilities/MixGenerator";
import MixCard from "@/RendererProcess/components/LocalMusic/TabsPane/HomeTab/MixCard.vue";
export default {
  components: { MixCard },
  computed: {
    tabsData() {
      return this.$store.state.TabsManager.tabsData;
    },
    playStats() {
      return this.$store.state.StatsManager.stats.playStats;
    },
  },
  data() {
    return {
      mixes: [],
    };
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "addToSelectedTracks",
      "clearSelectedTracks",
      "overWriteCustomQueue",
      "UIcontrollerSetPropertyValue",
    ]),
    routeTo(tab) {
      this.UIcontrollerSetPropertyValue({
        property: "currentMainTab",
        newValue: tab,
      });
      const path = tab == "Home" ? "/" : `/${tab}`;
      this.$router.push(path);
    },
  },
  mounted() {
    setTimeout(() => {
      const mixGen = new MixGenerator(
        this.playStats,
        this.tabsData.addedTracks,
        this.tabsData.recentlyPlayedTracks
      );
      this.mixes = mixGen.allMixes;
    }, 100);
  },
};
</script>

<style lang="scss">
.home {
  overflow: hidden;
  overflow-y: scroll;
  padding-right: 10px;
  .stats {
    margin-top: 10px;
    margin-bottom: 10px;
    .stats_title {
      // text-align: center;
      margin-left: 5px;
      margin-bottom: 10px;
    }
    h1 {
      font-size: 1.2rem;
      font-weight: 600;
    }
    .statsWrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 20px;
      align-items: center;
      justify-content: center;
    }
    .statCard {
      background: var(--accentColor);
      padding: 10px;
      width: 90%;
      max-width: 200px;
      align-self: center;
      justify-self: center;
      border-radius: 15px;
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
      img {
        position: absolute;
        width: 40px;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
      }
      h2 {
        margin-bottom: 10px;
        font-size: 1.1rem;
      }
      p {
        font-size: var(--baseFontSize);
        font-family: roboto-light;
      }
      h2,
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:hover {
        border-top-left-radius: 30px;
        border-bottom-right-radius: 30px;
      }
    }
  }
}
</style>
