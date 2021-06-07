<template>
  <div class="onboard">
    <transition
      enter-active-class="animated slideInRight faster"
      leave-active-class="animated slideOutLeft faster"
    >
      <div class="slide" v-if="currentSlide == 1">
        <img id="lamma" src="@/RendererProcess/assets/images/lamma.gif" />
        <div class="intro">
          <h1>Welcome To FLB Music</h1>
          <p>Beauty🌹, Simplicity📃, Functionality🏹</p>
        </div>
        <base-button
          @click.native="goToSlide2"
          id="jamBt"
          :icon="require('@/RendererProcess/assets/images/arrow_back.svg')"
          :active="true"
        />
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
              <base-button
                :icon="require('@/RendererProcess/assets/images/x.svg')"
                :active="true"
                @click.native="removeFromScannedFolders(folder)"
              />
            </div>
          </div>
          <div style="width: 75%; margin-top: 10px">
            <base-button
              :active="true"
              @click.native="addFolder"
              text="Add another Folder"
              :block="true"
            />
          </div>
        </article>
        <base-button
          @click.native="initialize"
          id="jamBt"
          :icon="require('@/RendererProcess/assets/images/arrow_back.svg')"
          :active="true"
        />
      </div>
      <div class="slide" v-if="currentSlide == 3">
        <h1 class="slideTitle">{{ msgToUser }}</h1>
        <h3 style="position: absolute; bottom: 100px; z-index: 2">
          Tip {{ tips[currentTip] }}
        </h3>
        <img id="loadingCat" src="@/RendererProcess/assets/images/cat.gif" />
        <base-button
          v-if="showOnboardCloseBt"
          @click.native="closeOnBoard"
          id="jamBt"
          :icon="require('@/RendererProcess/assets/images/arrow_back.svg')"
          :active="true"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { sendMessageToNode } from "@/RendererProcess/utilities/index";
import { ipcRenderer } from "electron";
import BaseButton from "../../BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
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
    ...mapMutations(["updateSetting"]),
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
      right: 0%;
      top: 50%;
      transform: translateX(50%) translateY(-50%) rotate(180deg) scale(1.5);
      bottom: 0px;
      position: absolute;
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
