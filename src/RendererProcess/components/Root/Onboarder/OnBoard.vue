<template>
  <div class="onboard">
    <transition
      enter-active-class="animated slideInRight faster"
      leave-active-class="animated slideOutLeft faster"
    >
      <div class="slide" v-if="currentSlide == 1">
        <img
          id="lamma"
          src="@/RendererProcess/assets/images/lamma.gif"
          alt=""
        />
        <div class="intro">
          <h1>Welcome To FLB Music</h1>
          <p>Beauty🌹, Simplicity📃, Functionality🏹</p>
        </div>
        <button @click="goToSlide2" id="jamBt" class="bt_active iconBt">
          <img src="@/RendererProcess/assets/images/arrow_back.svg" alt="" />
        </button>
      </div>
      <div class="slide" v-if="currentSlide == 2">
        <article>
          <h2>Add your Music Folders</h2>
          <br />
          <div class="folderBoxWrapper">
            <div
              v-for="folder in settings.foldersToScan"
              :key="folder"
              class="folderBox"
            >
              <div>
                <p>{{ folder.replace(/(.*)[\/\\]/, "") }}</p>
                <p style="font-family: roboto-thin; font-size: 0.9rem">
                  {{ folder }}
                </p>
              </div>
              <button
                @click="removeFromScannedFolders(folder)"
                title="Remove folder"
                class="iconBt dangerBt"
              >
                <img
                  style="width: 15px"
                  src="@/RendererProcess/assets/images/x.svg"
                  alt=""
                />
              </button>
            </div>
          </div>
          <button class="bt_active" style="max-width: 200px" @click="addFolder">
            <h3>Add another Folder</h3>
          </button>
        </article>
        <button @click="initialize" id="jamBt" class="bt_active iconBt">
          <img src="@/RendererProcess/assets/images/arrow_back.svg" alt="" />
        </button>
      </div>
      <div class="slide" v-if="currentSlide == 3">
        <h1 class="slideTitle">{{ msgToUser }}</h1>
        <h3 style="position: absolute; bottom: 100px; z-index: 2">
          Tip {{ tips[currentTip] }}
        </h3>
        <img
          id="loadingCat"
          src="@/RendererProcess/assets/images/cat.gif"
          alt=""
        />
        <button
          v-if="showOnboardCloseBt"
          @click="closeOnBoard"
          id="jamBt"
          class="bt_active iconBt"
        >
          <img src="@/RendererProcess/assets/images/arrow_back.svg" alt="" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { sendMessageToNode } from "@/RendererProcess/utilities/index";
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      currentSlide: 1,
      currentTip: 0,
      fraction: "0/0",
      tips: [
        "✨✨ Right click on any track to see more options ✨✨",
        "🪓🪓 Drag tracks in the queue to reorder them 🪓🪓",
        "📐📐 Make sure to check out the settings 📐📐",
        "📑📑 FLB comes with lyrics support 📑📑",
      ],
      msgToUser: "Great! Am loading your music",
      showOnboardCloseBt: false,
    };
  },
  computed: {
    settings() {
      return this.$store.state.SettingsManager.settings;
    },
    addedTracks() {
      return this.$store.state.TabsManager.tabsData.addedTracks;
    },
  },
  methods: {
    ...mapMutations([
      "updateSetting",
      "restoreSettings",
      "UIcontrollerToggleProperty",
    ]),
    goToSlide2() {
      this.currentSlide = 2;
      setInterval(() => {
        if (this.currentTip == 2) {
          this.currentTip = 0;
        } else {
          this.currentTip += 1;
        }
      }, 3000);
      setTimeout(() => {
        this.showOnboardCloseBt = true;
        this.msgToUser = "You can go on while I finish up 🤖";
      }, 10000);
    },
    addFolder() {
      sendMessageToNode("addScanFolder", "");
    },
    removeFromScannedFolders(path) {
      sendMessageToNode("removeFromScannedFolders", path);
    },
    initialize() {
      ipcRenderer.send("getFirstTracks");
      this.currentSlide = 3;
    },
    closeOnBoard() {
      this.$emit("closeOnBoard");
    },
  },
  mounted() {
    ipcRenderer.on("parsingProgress", (e, [currentIndex, total]) => {
      this.fraction = `${currentIndex}/${total}`;
    });
    ipcRenderer.on("userSettings", (e, payload) => {
      console.log(payload);
      console.log("User Settings Received");
      this.restoreSettings(payload);
    });
    ipcRenderer.send("initializeSettings");
    setTimeout(() => {
      if (this.addedTracks.length > 0) {
        this.$emit("closeOnBoard");
      }
    }, 500);
  },
};
</script>

<style lang="scss">
.onboard {
  position: fixed;
  top: 30px;
  width: 100vw;
  height: 96vh;
  background: rgba(0, 0, 0, 0.555);
  backdrop-filter: blur(40px);
  left: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .intro {
    p {
      text-align: center;
      transform: translateY(20px);
      font-family: roboto-thin;
    }
  }
  .folderBoxWrapper {
    max-height: 180px;
    overflow: hidden;
    overflow-y: scroll;
    padding: 10px;
    padding-bottom: 0px;
  }
  .slide {
    position: relative;
    background: rgba(0, 0, 0, 0.397);
    display: flex;
    border-radius: 80px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 70%;
    width: 60%;
    .slideTitle {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
    #onboard1 {
      width: 60vw;
      margin-top: -30px;
    }
    #lamma {
      position: absolute;
      top: 0px;
      left: 50%;
      border-radius: 20%;
      transform: translate(-50%, -50%);
      width: 150px;
      filter: invert(1);
    }
    #loadingCat {
      position: absolute;
      top: 70px;
      // z-index: -1;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      border-radius: 50%;
      // filter: invert(1);
    }
    #jamBt {
      width: 220px;
      right: 0%;
      top: 50%;
      transform: translateX(50%) translateY(-50%) rotate(180deg) scale(1.5);
      border-radius: 40px;
      bottom: 0px;
      position: absolute;
      display: flex;
      justify-content: center;
      background: rgb(0, 132, 255) !important;
    }
    #jamBt:hover {
      background: rgb(0, 102, 255) !important;
      border-radius: 10px;
    }
    #parseProgress {
      position: absolute;
      bottom: 10px;
      width: 90%;
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: center;
    }
  }
  article {
    width: 40vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    .folderBox {
      background: rgba(97, 97, 97, 0.178);
      padding: 10px 0px 10px 10px;
      border-radius: 20px;
      width: 400px;
      display: grid;
      align-items: center;
      grid-template-columns: 7fr 1fr;
      margin-bottom: 2px;
      button {
        margin-top: 0px;
      }
    }
    ul {
      p {
        background: rgba(0, 0, 0, 0.282);
        margin-bottom: 1px;
        padding: 5px;
        font-family: roboto-light;
        cursor: pointer;
      }
      p:hover {
        border-radius: 5px;
        padding-left: 10px;
        margin: 5px;
      }
      .activeSetting {
        padding-left: 10px;
        border-radius: 5px;
        margin: 5px;
        background: #0062ff !important;
      }
    }
  }
}
</style>
