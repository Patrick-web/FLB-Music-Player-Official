<template>
  <div class="Discover">
    <button
      class="tool"
      @click="reloadWebview"
      data-tip="Reload Deezer"
      id="refreshWebview"
    >
      <img
        class="animated infinite fast"
        src="@/RendererProcess/assets/images/refresh.svg"
        alt=""
      />
    </button>
    <webview
      src="https://www.deezer.com/"
      useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
      disablewebsecurity
      style="height: 95%; width: 100%"
    >
    </webview>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["pushNotification"]),
    reloadWebview() {
      document.querySelector("webview").reload();
      document.querySelector("#refreshWebview img").classList.add("rotateOut");
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
    background: rgba(10, 10, 10, 0.329);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    top: 20px;
    transform: translateY(-50%);
  }
  #refreshWebview:hover {
    background: #0062ff;
  }
}
</style>
