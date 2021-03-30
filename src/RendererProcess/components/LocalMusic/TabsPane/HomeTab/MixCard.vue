<template>
  <div class="MixCard">
    <div class="cardTitle">
      <div class="flex flexBetween">
        <h2>{{ cardTitle }}</h2>
        <button @click="playMix" class="btWithIcon mix_playBt">
          <img src="@/RendererProcess/assets/images/playButton.svg" />
          <p>Play Mashup</p>
        </button>
      </div>
      <p>{{ cardContent }}</p>
    </div>
    <OverLayedTracks :tracks="tracks" />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import OverLayedTracks from "./OverLayedTracks.vue";
export default {
  components: { OverLayedTracks },
  props: {
    cardTitle: String,
    cardContent: String,
    tracks: Array,
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "overWriteCustomQueue",
      "UIcontrollerSetPropertyValue",
    ]),
    playMix() {
      console.log("Playing mashup");
      this.setPlayingTrack({ track: this.tracks[0], index: 0 });
      const tracksCopy = [...this.tracks];
      this.overWriteCustomQueue(tracksCopy);
      this.UIcontrollerSetPropertyValue({
        property: "currentSidePaneTab",
        newValue: "CustomQueue",
      });
    },
  },
};
</script>

<style lang="scss">
.light_theme {
  .MixCard {
    .cardContent,
    .cardTitle {
      background: black;
    }
  }
}
.MixCard {
  position: relative;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.041);
  padding: 10px;
  border-radius: 20px;
  #playMixBt {
    position: absolute;
    top: 50%;
    left: 45%;
    transform: translate(-50%, -50%);
    img {
      margin-top: 2px;
    }
  }
  .cardTitle {
    z-index: 3;
    margin: auto;
    border-radius: 0px;
    h2 {
      font-family: roboto-light;
      font-size: 1.1rem;
      font-weight: 800;
      margin-bottom: 5px;
    }
    p {
      font-family: roboto-thin;
      font-size: 0.9rem;
      letter-spacing: 0.05rem;
    }
  }

  .cover {
    width: 150px;
    border-radius: 10px;
    opacity: 1;
  }
}
.MixCard:hover {
  .mix_playBt {
    background-color: var(--accentColorLight);
  }
}
</style>