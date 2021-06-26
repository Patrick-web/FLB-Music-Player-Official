<template>
  <div @click="openPodcast()" class="groupCard podCard">
    <base-button
      text="Subscribe"
      :icon="require('@/RendererProcess/assets/images/heart.svg')"
      extraClass="pod_sub_bt"
    />
    <img
      class="coverArt"
      src="@/RendererProcess/assets/images/FLBDefaultCover.png"
    />
    <div class="groupedCard_info">
      <p class="groupedInfo_title">
        {{ podcast.name }}
      </p>
      <p class="groupedInfo_subtitle">Podcast source</p>
    </div>
  </div>
</template>

<script>
import BaseButton from "../BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
  methods: {
    openPodcast() {
      console.log("opening");
    },
  },
  props: {
    podcast: Object,
  },
};
</script>

<style lang="scss">
.podCard {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  .coverArt {
    border-radius: 15px;
  }
  .pod_sub_bt {
    position: absolute;
    top: 15px;
    left: 15px;
    backdrop-filter: blur(10px);
    gap: 0px;
    p {
      max-width: 0px;
      opacity: 0;
    }
  }
  &:hover {
    .pod_sub_bt {
      gap: 5px;
      p {
        opacity: 1;
        max-width: 100px;
      }
    }
  }
}
</style>