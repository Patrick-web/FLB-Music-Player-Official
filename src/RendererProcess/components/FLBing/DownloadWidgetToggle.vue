<template>
  <div class="toggleDownloadWidget">
    <div v-if="downloadQueue.length == 0">
      <base-button
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        @click.native="toggleWidget"
        v-if="widgetIsVisible"
        extraClass="shrink_icon"
      />
      <base-button
        :icon="require('@/RendererProcess/assets/images/cloud-download.svg')"
        @click.native="toggleWidget"
        v-else
      />
    </div>
    <base-button
      :icon="require('@/RendererProcess/assets/images/cloud-download.svg')"
      @click.native="toggleWidget"
      v-else
      :text="downloadQueue.length.toString()"
      extraClass="animated pulse infinite slower"
    />
  </div>
</template>

<script>
import BaseButton from "../BaseComponents/BaseButton.vue";
export default {
  computed: {
    downloadQueue() {
      return this.$store.state.BingDownloadManager.pendingDownloads;
    },
  },
  data() {
    return {
      widgetIsVisible: false,
    };
  },
  components: { BaseButton },
  methods: {
    toggleWidget() {
      this.widgetIsVisible = !this.widgetIsVisible;
      document.querySelector(".FLBing").classList.toggle("widgetVisible");
    },
  },
};
</script>

<style lang="scss">
.toggleDownloadWidget {
  position: fixed;
  z-index: 50;
  top: 35px;
  right: 5px;
  button {
    background: var(--accentColor);
    transform: scale(0.8);
    &:hover {
      background: var(--accentColor) !important;
    }
  }
}
</style>