<template>
  <div class="MixCard">
    <div class="cardTitle">
      <h2>{{ cardTitle }}</h2>
    </div>
    <img
      class="cover"
      :src="require('@/RendererProcess/assets/images/FLBDefaultCover.png')"
      alt=""
    />
    <button @click="playMix()" id="playMixBt" class="iconBt">
      <img src="@/RendererProcess/assets/images/playButton.svg" alt="" />
    </button>
    <div class="cardContent">
      <p>{{ cardContent }}</p>
      <div class="aesthetic">
        <span class="line"></span>
        <span class="elipse"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    cardTitle: String,
    cardContent: String,
    tracks: Array,
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "overWriteCustomQueue",
      "switchSidePaneTab",
    ]),
    playMix() {
      console.log("Playing mashup");
      this.setPlayingTrack({ track: this.tracks[0], index: 0 });
      this.overWriteCustomQueue(this.tracks);
      this.switchSidePaneTab("CustomQueue");
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
  cursor: pointer;
  margin-top: 10px;
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
    background: rgba(97, 97, 97, 0.178);
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    margin: auto;
    backdrop-filter: blur(10px);
    border-radius: 0px;
    display: flex;
    align-items: center;
    padding: 8px;
    justify-content: center;
    width: 79.7%;
    h2 {
      font-size: 1rem;
      font-family: roboto !important;
      font-weight: 300;
      text-align: center;
    }
  }
  .cardContent {
    position: absolute;
    bottom: 0;
    width: 78%;
    background: rgba(97, 97, 97, 0.178);
    backdrop-filter: blur(10px);
    font-size: 0.9rem;
    transform: translateY(50%);
    left: 0px;
    padding: 10px;
    p {
      font-family: roboto-light;
      font-size: 0.8rem;
      letter-spacing: 0.05rem;
    }
  }
  .cover {
    width: 87%;
    border-radius: 10px;
    opacity: 1;
  }
}
.MixCard:hover {
  .cardContent {
    border-radius: 20px;
    transform: scale(1.1) rotate(-5deg) translateY(50%);
  }
  button {
    background-color: var(--accentColor) !important;
  }
}
</style>