<template>
  <div class="Settings blurred_bg blur40">
    <!-- <h1 id="SettingsTitle" style="font-size: 1.6rem; margin-top: 5px">
      Settings
    </h1>
    <base-button
      @click.native="UIcontrollerToggleProperty('showSettings')"
      :icon="require('@/RendererProcess/assets/images/x.svg')"
      extraClass="modalClose"
      :small="true"
      :transparent="true"
    /> -->
    <div class="widget_header">
      <h1 class="widget_title">Settings</h1>
      <base-button
        @click.native="UIcontrollerToggleProperty('showSettings')"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        extraClass="widget_close shrink_icon circle"
        :small="true"
      />
    </div>
    <main>
      <section>
        <article class="bg1">
          <h4>Library 💿</h4>
          <div class="folderBoxWrapper">
            <div
              v-for="folder in settings.foldersToScan"
              :key="folder"
              class="folderBox bg1"
            >
              <div>
                <p>{{ folder.replace(/(.*)[\/\\]/, "") }}</p>
                <p style="font-family: roboto-thin; font-size: 0.9rem">
                  {{ folder }}
                </p>
              </div>
              <base-button
                @click.native="removeFromScannedFolders(folder)"
                :icon="require('@/RendererProcess/assets/images/x.svg')"
                extraClass="shrink_icon circle"
                :small="true"
              />
            </div>
          </div>
          <div class="uselessWrapper">
            <base-button
              @click.native="addFolder"
              text="Add Folder"
              :block="true"
              :active="true"
            />
          </div>
        </article>
        <article class="bg1">
          <div class="settingBox">
            <h4>Default Tab 🚪</h4>
            <ul class="grid3 gap20">
              <div
                v-for="tab in tabs"
                :key="tab.name"
                @click="
                  setSettingValue({
                    property: 'defaultTab',
                    newValue: tab.name,
                  })
                "
                :class="[
                  settings.defaultTab == tab.name ? 'defaultTab' : '',
                  'tabDiv',
                  'bg2',
                ]"
              >
                <img class="icon" :src="tab.icon" />
                <p>{{ tab.name }}</p>
              </div>
            </ul>
          </div>
        </article>
        <article class="bg1">
          <h4>Accent Color 🖌</h4>
          <ul class="grid5 gap10">
            <div
              v-for="(color, index) in accentColors"
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_' + index,
                })
              "
              :style="{ background: color }"
              :key="color"
              class="colorDiv"
            ></div>
          </ul>
        </article>
      </section>
      <section>
        <article class="bg1">
          <h4>Theme 🎨</h4>
          <ul class="grid2 gap20">
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'fancy' })"
              :class="[settings.theme == 'fancy' ? 'activeSetting' : '', 'bg2']"
            >
              <p>Fancy dancy 🍷</p>
            </div>
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'dark' })"
              :class="[settings.theme == 'dark' ? 'activeSetting' : '', 'bg2']"
            >
              <p>Fake Black 🏴</p>
            </div>
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'black' })"
              :class="[settings.theme == 'black' ? 'activeSetting' : '', 'bg2']"
            >
              <p>Utter Black 🏴‍☠️</p>
            </div>
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'light' })"
              :class="[settings.theme == 'light' ? 'activeSetting' : '', 'bg2']"
            >
              <p>Eye Killer 👁‍🗨</p>
            </div>
          </ul>
        </article>
        <div class="grid2">
          <article class="bg1">
            <h3 class="mb5">Shortcuts ✂</h3>
            <div class="pb5 mb5 border_split">
              <p class="text-small-0">Pause and Play</p>
              <pre class="text-small-1">Space🔘</pre>
            </div>
            <div class="pb5 mb5 border_split">
              <p class="text-small-0">Next and Previous Track</p>
              <pre class="text-small-1">Arrows ◀▶   </pre>
            </div>
            <div class="pb5 mb5 border_split">
              <p class="text-small-0">Search Tracks</p>
              <pre class="text-small-1">Tab 🧈</pre>
            </div>
          </article>
          <article class="bg1">
            <h3 class="mb5">About 🐲</h3>
            <div class="infos">
              <div class="pb5 border_split mb5">
                <p class="text-small-0">App Version 💽</p>
                <p class="text-small-1">{{ appVersion }}</p>
              </div>
              <!-- <div class="pb5 border_split mb5">
              <p class="text-small-0">Made with 🤍 By</p>
              <p class="text-small-1">Patrick Waweru</p>
            </div> -->
              <div class="pb5 border_split mb5">
                <p class="text-small-0">Twitter🐦</p>
                <a
                  target="_blank"
                  class="text-small-1"
                  href="https://twitter.com/PnTX10"
                  >@PnTX10</a
                >
              </div>
              <div class="">
                <p class="text-small-0">Email📬</p>
                <a
                  target="_blank"
                  class="text-small-1"
                  href="https://mail.google.com"
                  >pntx200@gmail.com</a
                >
              </div>
            </div>
          </article>
        </div>
        <div class="grid2 gap10 pa10 border_split">
          <div
            @click="
              setSettingValue({
                property: 'desktopNotifications',
                newValue: !settings.desktopNotifications,
              })
            "
            :class="[
              settings.desktopNotifications ? 'activeBtn' : '',
              'switch bg1',
            ]"
          >
            <p>Notifications💬</p>
            <p v-if="settings.desktopNotifications">On</p>
            <p v-if="!settings.desktopNotifications">Off</p>
          </div>
          <div
            @click="toggleVideoSupport"
            :class="[settings.videoSupport ? 'activeBtn' : '', 'switch bg1']"
          >
            <p>Video Support ß</p>
            <p v-if="settings.videoSupport">On</p>
            <p v-if="!settings.videoSupport">Off</p>
          </div>
        </div>
        <div class="grid2 gap10 pa10">
          <div @click="checkForUpdate" class="switch bg1">
            <p>Check for Update 🚀</p>
          </div>
          <div class="switch bg1">
            <a target="_blank" href="https://t.me/flbmusiccommunity">
              <p>Join us on Telegram 🦅</p>
            </a>
          </div>
          <div class="switch bg1">
            <a target="_blank" href="https://flbmusic.kampsite.co/">
              <p>Request a Feature 💎</p>
            </a>
          </div>
          <div class="switch bg1">
            <a target="_blank" href="https://t.me/flbmusiccommunity">
              <p>Report a Bug 🐜</p>
            </a>
          </div>
        </div>
      </section>
      <section style="border: none">
        <div class="grid2 gap10"></div>
      </section>
    </main>
  </div>
</template>

<script>
import { sendMessageToNode } from "@/RendererProcess/utilities/index";
import { mapMutations } from "vuex";
import { ipcRenderer } from "electron";
import homeIcon from "@/RendererProcess/assets/images/home.svg";
import tracksIcon from "@/RendererProcess/assets/images/music_note.svg";
import playlistsIcon from "@/RendererProcess/assets/images/playlist.svg";
import albumIcon from "@/RendererProcess/assets/images/album.svg";
import artistIcon from "@/RendererProcess/assets/images/user.svg";
import folderIcon from "@/RendererProcess/assets/images/folderNormal.svg";
import BaseButton from "../BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
  data() {
    return {
      appVersion: "0.0.1",
      tabs: [
        { name: "Home", icon: homeIcon },
        { name: "Tracks", icon: tracksIcon },
        { name: "Playlists", icon: playlistsIcon },
        { name: "Artists", icon: artistIcon },
        { name: "Albums", icon: albumIcon },
        { name: "Folders", icon: folderIcon },
      ],
      accentColors: [
        "#0066ff",
        "#7A86CB",
        "#BA68C6",
        "#FD8B64",
        "#ACD580",
        "#FCD450",
        "#4DB6AC",
        "#EE6390",
        "#E57375",
        "#FF8A66",
      ],
    };
  },
  computed: {
    settings() {
      return this.$store.state.SettingsManager.settings;
    },
  },
  methods: {
    ...mapMutations(["setSettingValue", "UIcontrollerToggleProperty"]),
    addFolder() {
      sendMessageToNode("addScanFolder", "");
    },
    removeFromScannedFolders(path) {
      sendMessageToNode("removeFromScannedFolders", path);
    },
    resetApp() {
      localStorage.removeItem("downloadedArtists");
      localStorage.removeItem("lyrics");
      sendMessageToNode("resetApp");
    },
    checkForUpdate() {
      console.log("Checking");
      sendMessageToNode("checkForUpdate");
    },
    toggleVideoSupport() {
      this.setSettingValue({
        property: "videoSupport",
        newValue: !this.settings.videoSupport,
      });
      console.log(this.settings.videoSupport);
      sendMessageToNode("toggleVideoSupport");
    },
  },
  mounted() {
    ipcRenderer.send("requestVersion");
    ipcRenderer.on("appVersion", (e, version) => {
      this.appVersion = version;
    });
  },
};
</script>

<style lang="scss">
.Settings {
  position: fixed;
  overflow: hidden;
  top: 40px;
  left: 10px;
  height: 90%;
  width: 97%;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.315);
  border-radius: 20px;
  padding: 10px;
  main {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 10px;
    section {
      border-right: 1px solid white;
      height: 90vh;

      p {
        font-family: roboto-light;
      }
      .folderBoxWrapper {
        max-height: 140px;
        overflow: hidden;
        overflow-y: scroll;
        padding: 10px;
        padding-bottom: 0px;
        padding-top: 0px;
      }
      .uselessWrapper {
        padding: 15px;
        padding-top: 0px;
        padding-bottom: 0px;
      }
    }
    article {
      margin: 10px;
      padding: 10px;
      border-radius: 20px;
      overflow: hidden;
      h4 {
        text-align: center;
        margin-bottom: 10px;
        font-size: 1.2rem;
      }
      .folderBox {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
      }
      ul {
        div {
          justify-self: center;
          height: 50px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 15px;
          cursor: pointer;
        }
      }
    }
  }
  h1 {
    text-align: center;
  }
  h3 {
    margin-top: 10px;
    text-align: center;
  }
  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    padding: 5px;
    padding-left: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    border-radius: 0px;
    cursor: pointer;
    &:hover {
      background-color: #ffffff1e;
      border-radius: 20px;
      margin: 5px;
    }
  }
  .activeSetting {
    background: var(--accentColor) !important;
  }
  .shortcut {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding-bottom: 5px;
    font-family: roboto-light;
    pre {
      background: rgba(0, 0, 0, 0.24);
      padding: 5px;
      border-radius: 8px;
    }
  }
  .info-group {
    padding-bottom: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.39);
    font-family: roboto-light;
    font-size: var(--baseFontSize);
    p {
      font-size: 0.9rem;
    }
  }
}
.colorDiv {
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  &:hover {
    transform: scale(1.1);
  }
}
.tabDiv {
  width: 70px !important;
  padding: 10px;
  &:hover {
    img {
      transform: translateY(10px) scale(1.3);
    }
    p {
      transform: translateY(20px) scale(0);
    }
  }
  p {
    font-family: roboto-thin;
  }
  img {
    width: 25px;
  }
}
.defaultTab {
  background: var(--accentColor) !important;
  img {
    transform: translateY(10px) scale(1.3);
  }
  p {
    transform: translateY(20px) scale(0);
  }
}
</style>
