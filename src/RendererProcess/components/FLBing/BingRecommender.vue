<template>
  <div class="BingRecommender">
    <div
      v-if="deezerRecommendedArtists.length == 0"
      class="centerContents fade_to_7"
    >
      <p v-if="appIsOnline" class="text-thin">Loading Recommendations...</p>
      <div class="centerContents" v-else style="font-family: roboto-thin">
        <p class="text-thin">Could not fetch Recommendations ⚠</p>
        <p class="text-thin">Check your Internet Connection 📶</p>
      </div>
    </div>
    <div class="artistRecommendations">
      <div
        class="recommend bg1"
        v-for="recommend in deezerRecommendedArtists"
        :key="recommend.sourceArtist"
      >
        <div class="recommend_title flex center-v">
          <p>Similar artists to</p>
          <h1>🎙{{ recommend.sourceArtist }}🎙</h1>
        </div>

        <div class="flex_auto contentsWrapper">
          <ArtistCard
            v-on:selectedArtist="bubbleArtist"
            v-for="artist in recommend.similarArtists"
            :key="artist.id"
            :artistInfo="artist"
          />
        </div>
      </div>
    </div>
    <div class="trackRecommendations"></div>
  </div>
</template>

<script>
import { shuffleArray } from "@/sharedUtilities";
import ArtistCard from "./BingArtistCard.vue";
export default {
  components: {
    ArtistCard,
  },
  computed: {
    playStats() {
      return this.$store.state.StatsManager.stats.playStats;
    },
    allTracks() {
      return this.$store.state.TabsManager.tabsData.addedTracks;
    },
    appIsOnline() {
      return this.$store.state.appIsOnline;
    },
  },
  data() {
    return {
      selectedArtists: ["ikson", "ruth b", "alessia cara"],
      mapperRecommendedArtists: [],
      deezerRecommendedArtists: [],
    };
  },
  methods: {
    bubbleArtist(artistData) {
      this.$emit("selectedRecommendedArtist", artistData);
    },
    generateArtistsToSearchFor() {
      const allArtists = this.allTracks.map((track) => track.defaultArtist);
      this.selectedArtists = shuffleArray(new Set(allArtists));
      setTimeout(() => {
        this.fetchRecommendedArtists();
      }, 1000);
    },
    fetchRecommendedArtists() {
      this.selectedArtists.forEach((selectedArtist) => {
        fetch(
          `https://www.music-map.com/${selectedArtist.replace(/\s/g, "+")}`,
          {
            method: "GET",
            redirect: "follow",
          }
        )
          .then((response) => response.text())
          .then((html) => {
            // console.log("Getting reccomendations for " + selectedArtist);
            if (html.match(/Aaaargh woah 404/) != null) return;
            const artists = html
              .match(/<a href.*<\/a>/g)
              .map((result) => result.match(/>.*</)[0].replace(/>|</g, ""));
            const artistObj = {
              name: selectedArtist,
              similarArtists: shuffleArray(artists).slice(0, 10),
            };
            this.mapRecommendedArtistsToDeezer(artistObj);
          })
          .catch((error) => console.log("error", error));
      });
    },
    mapRecommendedArtistsToDeezer(artistObj) {
      const recommend = {
        sourceArtist: artistObj.name,
        similarArtists: [],
      };
      artistObj.similarArtists.forEach((similarArtist) => {
        fetch(`https://api.deezer.com/search?q=artist:"${similarArtist}"`, {
          method: "GET",
          redirect: "follow",
        })
          .then((response) => response.text())
          .then((result) => {
            if (!JSON.parse(result).data) return;

            const similarArtistObj = JSON.parse(result)
              .data.map((track) => track.artist)
              .filter((foundArtist) => foundArtist.name == similarArtist)[0];
            if (similarArtistObj) {
              recommend.similarArtists.push(similarArtistObj);
              const index = this.deezerRecommendedArtists.findIndex(
                (existingRecommend) =>
                  existingRecommend.sourceArtist == recommend.sourceArtist
              );
              if (index >= 0) {
                this.deezerRecommendedArtists[index].similarArtists =
                  recommend.similarArtists;
              } else {
                this.deezerRecommendedArtists.push(recommend);
              }
            }
          })
          .catch((error) => console.log("error", error));
      });
      //   console.log(this.deezerRecommendedArtists);
    },
  },
  mounted() {
    this.generateArtistsToSearchFor();
    window.addEventListener("online", () => {
      this.generateArtistsToSearchFor();
    });
  },
};
</script>

<style lang="scss">
.BingRecommender {
  max-height: 450px;
  transform: translateY(40px);
  width: 150%;
  overflow: hidden;
  overflow-y: scroll;
  .recommend {
    border-radius: 15px;
    padding: 10px;
    margin: 10px;
    .recommend_title {
      p {
        font-size: 1.2rem;
        transform: translateY(2px);
      }
      h1 {
        font-size: 1.3rem;
      }
    }
  }
}
</style>