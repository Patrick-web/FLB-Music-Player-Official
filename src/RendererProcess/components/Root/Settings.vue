<template>
  <div class="Settings">
    <h1 id="SettingsTitle">Settings</h1>
    <p class="modalClose" @click="UIcontrollerToggleProperty('showSettings')">
      <img src="@/RendererProcess/assets/images/x.svg" alt="" />
    </p>
    <main>
      <section>
        <article>
          <h4>Library</h4>
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
          <button
            style="max-width: 380px; margin-left: 10px"
            class="bt_active"
            @click="addFolder"
          >
            <h2>Add Folder</h2>
          </button>
        </article>
        <article>
          <div class="settingBox">
            <h4>Default Tab</h4>
            <ul>
              <div
                @click="
                  setSettingValue({ property: 'defaultTab', newValue: 'Home' })
                "
                :class="[settings.defaultTab == 'Home' ? 'activeSetting' : '']"
              >
                <p>Home</p>
              </div>
              <div
                @click="
                  setSettingValue({
                    property: 'defaultTab',
                    newValue: 'Tracks',
                  })
                "
                :class="[
                  settings.defaultTab == 'Tracks' ? 'activeSetting' : '',
                ]"
              >
                <p>Tracks</p>
              </div>
              <div
                @click="
                  setSettingValue({
                    property: 'defaultTab',
                    newValue: 'Artists',
                  })
                "
                :class="[
                  settings.defaultTab == 'Artists' ? 'activeSetting' : '',
                ]"
              >
                <p>Artists</p>
              </div>
              <div
                @click="
                  setSettingValue({
                    property: 'defaultTab',
                    newValue: 'Albums',
                  })
                "
                :class="[
                  settings.defaultTab == 'Albums' ? 'activeSetting' : '',
                ]"
              >
                <p>Albums</p>
              </div>
              <div
                @click="
                  setSettingValue({
                    property: 'defaultTab',
                    newValue: 'Folders',
                  })
                "
                :class="[
                  settings.defaultTab == 'Folders' ? 'activeSetting' : '',
                ]"
              >
                <p>Folders</p>
              </div>
              <div
                @click="
                  setSettingValue({
                    property: 'defaultTab',
                    newValue: 'Playlists',
                  })
                "
                :class="[
                  settings.defaultTab == 'Playlists' ? 'activeSetting' : '',
                ]"
              >
                <p>Playlists</p>
              </div>
            </ul>
          </div>
        </article>
        <article>
          <h4>Accent Color</h4>
          <ul>
            <div
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_blue',
                })
              "
              :class="[
                settings.accentColor == 'accent_blue' ? 'activeSetting' : '',
              ]"
            >
              <p>Blue</p>
            </div>
            <div
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_orange',
                })
              "
              :class="[
                settings.accentColor == 'accent_orange' ? 'activeSetting' : '',
              ]"
            >
              <p>Orange</p>
            </div>
            <div
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_purple',
                })
              "
              :class="[
                settings.accentColor == 'accent_purple' ? 'activeSetting' : '',
              ]"
            >
              <p>Purple</p>
            </div>
            <div
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_magenta',
                })
              "
              :class="[
                settings.accentColor == 'accent_magenta' ? 'activeSetting' : '',
              ]"
            >
              <p>Magenta</p>
            </div>
            <div
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_cyan',
                })
              "
              :class="[
                settings.accentColor == 'accent_cyan' ? 'activeSetting' : '',
              ]"
            >
              <p>Cyan</p>
            </div>
            <div
              @click="
                setSettingValue({
                  property: 'accentColor',
                  newValue: 'accent_white',
                })
              "
              :class="[
                settings.accentColor == 'accent_white' ? 'activeSetting' : '',
              ]"
            >
              <p>Grey</p>
            </div>
          </ul>
        </article>
      </section>
      <section>
        <article>
          <h4>Theme</h4>
          <ul>
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'fancy' })"
              :class="[settings.theme == 'fancy' ? 'activeSetting' : '']"
            >
              <p>Fancy</p>
            </div>
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'dark' })"
              :class="[settings.theme == 'dark' ? 'activeSetting' : '']"
            >
              <p>Dark</p>
            </div>
            <div
              @click="setSettingValue({ property: 'theme', newValue: 'light' })"
              :class="[settings.theme == 'light' ? 'activeSetting' : '']"
            >
              <p>Light</p>
            </div>
          </ul>
        </article>
        <article>
          <div
            @click="
              setSettingValue([
                'desktopNotifications',
                !settings.desktopNotifications,
              ])
            "
            class="switch"
          >
            <p>Desktop Notifications</p>
            <p v-if="settings.desktopNotifications">On</p>
            <p v-if="!settings.desktopNotifications">Off</p>
          </div>
        </article>
        <article>
          <button @click="resetApp" class="dangerBt">
            <h2>Reset FLB 😵</h2>
          </button>
        </article>
        <article>
          <h3>Shortcuts</h3>
          <div class="shortcut">
            <p>Pause/Play</p>
            <pre>Space</pre>
          </div>
          <div class="shortcut">
            <p>Next Track</p>
            <pre>Right Arrow</pre>
          </div>
          <div class="shortcut">
            <p>Previous Track</p>
            <pre>Left Arrow</pre>
          </div>
          <div class="shortcut">
            <p>Volume</p>
            <pre>Up / Down Arrow</pre>
          </div>
          <div class="shortcut">
            <p>Search Tracks</p>
            <pre>Tab</pre>
          </div>
          <div class="shortcut">
            <p>Reload App</p>
            <pre>Ctrl + R</pre>
          </div>
        </article>
      </section>
      <section style="border: none">
        <article>
          <h3>About</h3>
          <div class="infos">
            <div class="info-group">
              <div class="it">App Version</div>
              <div class="i">{{ appVersion }}</div>
            </div>
            <div class="info-group">
              <div class="it">Made with 🤍 By</div>
              <div class="i">Patrick Waweru</div>
            </div>
            <div class="info-group">
              <div class="it">Twitter 🐦</div>
              <a target="_blank" href="https://twitter.com/PnTX10" class="i"
                >@PnTX10</a
              >
            </div>
            <div class="info-group">
              <div class="it">Email 📬</div>
              <a target="_blank" href="https://mail.google.com" class="i"
                >pntx200@gmail.com</a
              >
            </div>
            <div class="info-group">
              <p class="it">🦧 Don't be shy, go ahead and contact me.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import { sendMessageToNode } from "@/RendererProcess/utilities/index";
import { mapMutations } from "vuex";
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      appVersion: "0.0.1",
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
      sendMessageToNode("resetApp");
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
  background-color: rgba(0, 0, 0, 0.445);
  backdrop-filter: blur(20px);
  overflow: hidden;
  top: 0px;
  right: 0px;
  height: 100%;
  width: 100vw;
  z-index: 50;
  #SettingsTitle {
    margin: 10px;
  }
  main {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    width: 100%;
    section {
      border-right: 1px solid white;
      height: 90vh;
      article {
        margin: 10px;
        margin-bottom: 20px;
        background: rgba(255, 255, 255, 0.062);
        padding: 10px;
        border-radius: 10px;
        .folderBoxWrapper {
          max-height: 140px;
          overflow: hidden;
          overflow-y: scroll;
          padding: 10px;
          padding-bottom: 0px;
          padding-top: 0px;
        }
        h4 {
          text-align: center;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }
        .folderBox {
          background: rgba(255, 255, 255, 0.096);
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          button {
            margin-top: 0px;
          }
        }
        ul {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          div {
            justify-self: center;
            background: rgba(255, 255, 255, 0.096);
            height: 50px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            cursor: pointer;
          }
          div:hover {
            background: var(--accentColorLight);
          }
          .activeSetting {
            background: var(--accentColor) !important;
          }
          .activeSetting:hover {
            background: var(--accentColor);
          }
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
    p {
      font-family: roboto-light;
      margin-right: 5px;
    }
  }
  .setting:hover {
    background-color: #ffffff1e;
    border-radius: 20px;
    margin: 5px;
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
      background: rgb(0, 0, 0);
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.39);
    .it {
      font-family: roboto-light;
      font-weight: 300;
      font-size: 0.9em;
    }
    .i {
      font-size: 0.8em;
      font-family: roboto-thin;
      font-weight: 300;
    }
  }
}
</style>
