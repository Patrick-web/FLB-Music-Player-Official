<template>
  <div class="sideNav bg2" :class="[isCollapsed ? 'collapsed' : '', 'sideNav']">
    <div>
      <div
        :class="[
          currentPage === 'My Music' ? 'active-sideNav-group' : '',
          'sideNav-group',
        ]"
        @click="switchPage('My Music')"
      >
        <router-link to="/">
          <img
            class="icon"
            title="My Music"
            src="@/RendererProcess/assets/images/music.svg"
            alt
          />
          <p v-if="!isCollapsed">My Music</p>
        </router-link>
      </div>
      <div
        :class="[
          currentPage === 'FLBing' ? 'active-sideNav-group' : '',
          'sideNav-group',
        ]"
        id="FLBing"
        @click="switchPage('FLBing')"
      >
        <router-link to="/flbing">
          <img
            title="FLBing"
            class="icon"
            src="@/RendererProcess/assets/images/meld.svg"
          />
          <p v-if="!isCollapsed">FLBing</p>
        </router-link>
      </div>
    </div>
    <div>
      <div
        @click="UIcontrollerToggleProperty('showSettings')"
        class="sideNav-group"
      >
        <a>
          <img
            title="Settings"
            class="icon"
            src="@/RendererProcess/assets/images/settings.svg"
            alt
          />
          <p v-if="!isCollapsed">Settings</p>
        </a>
      </div>
      <div @click="refresh" class="sideNav-group">
        <a>
          <img
            title="Refresh"
            src="@/RendererProcess/assets/images/refresh.svg"
            alt
            id="refreshLib"
            class="animated infinite icon"
          />
          <p v-if="!isCollapsed">Refresh</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessageToNode } from "@/RendererProcess/utilities/index";
import { mapMutations } from "vuex";
export default {
  name: "SideNav",
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    currentPage() {
      return this.$store.state.UIController.UIProperties.currentPage;
    },
  },
  methods: {
    ...mapMutations([
      "UIcontrollerToggleProperty",
      "UIcontrollerSetPropertyValue",
    ]),
    switchPage(page) {
      this.UIcontrollerSetPropertyValue({
        property: "currentPage",
        newValue: page,
      });
    },
    refresh() {
      document.querySelector("#refreshLib").classList.add("rotateOut");
      setTimeout(() => {
        document.querySelector("#refreshLib").classList.remove("rotateOut");
      }, 4000);
      sendMessageToNode("refresh", "");
    },
  },
};
</script>

<style lang="scss">
.sideNav {
  min-width: 180px;
  width: 180px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
  overflow: hidden;
  .sideNav-group {
    border-radius: 15px;
    margin: 8px;
    // border-radius: 10px;
    a {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr 3fr;
      align-items: center;
      justify-content: center;
      border-left: 0px solid var(--accentColor);
      position: relative;
    }
    p {
      text-align: left;
      font-size: var(--baseFontSize);
    }
    span {
      position: absolute;
      left: 10px;
      bottom: -10px;
      font-size: 0.6rem;
      background: var(--accentColor);
      padding: 2px 5px 2px 5px;
      border-radius: 10px;
    }
  }
  .sideNav-group:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
  }
  .active-sideNav-group {
    background: var(--accentColor);
  }
  .active-sideNav-group:hover {
    background: var(--accentColor);
  }
  img {
    width: 25px;
  }
  .activeFeatureIndicator {
    position: absolute;
    top: 12.5%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.2s ease-in-out;
    background: var(--accentColor);
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  .tabActive {
    .v-tooltip {
      display: none;
    }
    filter: hue-rotate(280deg);
  }
}
@media (max-width: 900px) {
  .sideNav {
    min-width: 60px;
    width: 60px;
    .sideNav-group {
      p {
        display: none;
      }
      span {
        display: none;
      }
    }
  }
}
</style>
