<template>
  <div class="home">
    <div class="stats">
      <div class="stats_title">
        <h1>Library Stats</h1>
      </div>
      <div class="statsWrapper">
        <div @click="routeTo('/tracks')" class="statCard">
          <h2>{{ tabsData.addedTracks.length }}</h2>
          <p>Tracks</p>
          <img
            style="opacity: 40%"
            src="@/RendererProcess/assets/images/music_note.svg"
            alt=""
          />
        </div>
        <div @click="routeTo('/albums')" class="statCard">
          <h2>{{ tabsData.albums.length }}</h2>
          <p>Albums</p>
          <img
            style="opacity: 40%"
            src="@/RendererProcess/assets/images/album.svg"
            alt=""
          />
        </div>
        <div @click="routeTo('/artists')" class="statCard">
          <h2>{{ tabsData.artists.length }}</h2>
          <p>Artists</p>
          <img
            style="width: 30px"
            src="@/RendererProcess/assets/images/FLBDefaultArtistPic.png"
            alt=""
          />
        </div>
        <div @click="routeTo('/folders')" class="statCard">
          <h2>{{ tabsData.folders.length }}</h2>
          <p>Folders</p>
          <img src="@/RendererProcess/assets/images/folder.svg" alt="" />
        </div>
      </div>
    </div>
    <hr />
    <div class="stats">
      <div class="stats_title">
        <h1>Daily Mashups</h1>
      </div>
      <div class="statsWrapper">
        <MixCard
          v-for="mix in mixes"
          :key="mix.name"
          :cardTitle="mix.name"
          :cardContent="mix.info"
          :tracks="mix.tracks"
        />
        <div style="margin: 10px; font-size: 0.8rem; font-family: roboto-thin">
          * More Daily Mashups will come as you keep on listening *
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import { MixGenerator } from "@/RendererProcess/utilities/MixGenerator";
import MixCard from "@/RendererProcess/components/LocalMusic/TabsPane/HomeTab/MixCard.vue";
export default {
  components: { MixCard },
  computed: {
    ...mapState(["TabsManager"]),
    tabsData() {
      return this.$store.state.TabsManager.tabsData;
    },
    mostPlayedTracks() {
      return this.$store.state.StatsManager.stats.mostPlayedTracks;
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
    ]),
    ...mapActions(["getLyrics"]),
    routeTo(tab) {
      if (tab !== this.$route.path) this.$router.push(tab);
    },
  },
  mounted() {
    const mixGen = new MixGenerator(
      this.mostPlayedTracks,
      this.tabsData.addedTracks,
      this.tabsData.recentlyPlayedTracks
    );
    this.mixes = mixGen.allMixes;
    console.log(this.mixes);
  },
};
</script>

<style lang="scss">
.light_theme {
  .home {
    .statCard {
      filter: invert(1);
    }
    img {
      filter: invert(1);
    }
  }
}
.home {
  .stats {
    margin-top: 10px;
    margin-bottom: 10px;
    .stats_title {
      padding: 5px;
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
      background: linear-gradient(var(--accentColor), var(--accentColorLight));
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
        font-size: 1rem;
        font-family: roboto-light;
      }
      h2,
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .statCard:hover {
      background: linear-gradient(
        150deg,
        var(--accentColor),
        var(--accentColorLight)
      );
      border-top-left-radius: 30px;
      border-bottom-right-radius: 30px;
    }
  }
  .mostPlayed {
    display: initial;
    position: relative;
    height: 90px;
    overflow: hidden;
    .statTrack {
      background: rgba(255, 255, 255, 0.068);
      border-radius: 10px;
      padding: 10px;
      width: 200px;
      min-width: 200px;
      cursor: pointer;
      h2 {
        margin-bottom: 10px;
        font-size: 1rem;
      }
      p {
        font-size: 1rem;
        font-family: roboto-light;
      }
      h2,
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .statTrack:hover {
      background: rgba(255, 255, 255, 0.116);
    }
    #slideWrapper {
      position: absolute;
      left: 0;
      top: 0px;
      display: flex;
      align-items: center;
      gap: 15px;
      width: 200%;
    }
    .slideBt {
      opacity: 0;
    }
    #slideWrapper:hover {
      .slideBt {
        opacity: 1;
      }
    }
    #slideBackwards {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
    }
    #slideForwards {
      z-index: 2;
      position: absolute;
      top: 10px;
      right: 10px;
      transform: rotate(180deg);
    }
  }
  .mostPlayed:hover {
    .slideBt {
      opacity: 1;
    }
  }
}
</style>
