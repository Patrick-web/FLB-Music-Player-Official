<template>
  <div class="Discover">
    <base-button
      @click="reloadWebview"
      data-tip="Reload Deezer"
      id="refreshWebview"
      :icon="require('@/RendererProcess/assets/images/refresh.svg')"
    />
    <webview
      src="https://www.deezer.com/"
      useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
      disablewebsecurity
      style="height: 94%; width: 84vw"
    >
    </webview>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import BaseButton from "../components/BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
  methods: {
    ...mapMutations(["pushNotification"]),
    reloadWebview() {
      document.querySelector("webview").reload();
      document
        .querySelector("#refreshWebview img")
        .classList.add("animated rotateOut");
      setTimeout(() => {
        document
          .querySelector("#refreshWebview img")
          .classList.remove("rotateOut");
      }, 5000);
    },
  },
  mounted() {
    if (!navigator.onLine) {
      this.pushNotification({
        title: `No internet connection detected`,
        subTitle: null,
        type: "danger",
      });
    }
  },
};
</script>

<style lang="scss">
.Discover {
  height: 100vh;
  min-width: 93vw;
  display: flex;
  #refreshWebview {
    position: absolute;
    left: 50%;
    width: 40px;
    height: 40px;
    backdrop-filter: blur(10px);
    top: 20px;
    transform: translateY(-50%);
  }
  #refreshWebview:hover {
    background: #0062ff;
  }
}
</style>
