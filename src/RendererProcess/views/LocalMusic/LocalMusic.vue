<template>
  <div class="LocalMusic">
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <PlaylistWidget v-if="showPlaylistWidget" />
      <TagEditor v-if="showTagEditor" :targetTrack="selectedTrack" />
    </transition>
    <main>
      <section id="tabsArea">
        <TrackContextMenu v-on:targetTrack="setTagEditorTrack" />
        <TabsPaneHeader />
        <TabSwitcher />
        <router-view />
      </section>
      <SidePane v-on:targetTrack="setTagEditorTrack" />
    </main>
  </div>
</template>

<script>
import TabsPaneHeader from "@/RendererProcess/components/LocalMusic/TabsPane/Header/TabsPaneHeader.vue";
import TabSwitcher from "@/RendererProcess/components/LocalMusic/TabsPane/TabSwitcher.vue";
import SidePane from "@/RendererProcess/components/LocalMusic/SidePane/SidePane";
import TagEditor from "@/RendererProcess/components/LocalMusic/SidePane/TagEditor";
import TrackContextMenu from "@/RendererProcess/components/Root/Track/TrackContextMenu";
import PlaylistWidget from "@/RendererProcess/components/LocalMusic/Widgets/PlaylistWidget";
import { ipcRenderer } from "electron";

export default {
  data() {
    return {
      selectedTrack: null,
    };
  },
  computed: {
    showPlaylistWidget() {
      return this.$store.state.UIController.UIProperties.showPlaylistWidget;
    },
    showTagEditor() {
      return this.$store.state.UIController.UIProperties.showTagEditor;
    },
  },
  components: {
    TabsPaneHeader,
    TabSwitcher,
    SidePane,
    PlaylistWidget,
    TagEditor,
    TrackContextMenu,
  },
  methods: {
    setTagEditorTrack(track) {
      this.selectedTrack = track;
    },
  },
  mounted() {
    document.querySelector(".LocalMusic").addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const filePaths = Array.from(event.dataTransfer.files).map(
        (file) => file.path
      );
      console.log("Dropped ", filePaths[0]);
      ipcRenderer.send("processDroppedFiles", filePaths);
    });
    document.querySelector(".LocalMusic").addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  },
};
</script>
<style lang="scss">
.playingPaneLoaded {
  .LocalMusic {
    margin-bottom: 110px;
  }
}
.light_theme {
  .LocalMusic {
    filter: invert(1);
  }
}
.LocalMusic {
  main {
    display: flex;
    height: 100%;
    #tabsArea {
      height: 97%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 60vw;
      max-width: 70vw;
      width: 61.5vw;
      margin-right: 10px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.083);
    }
  }
}
@media (max-width: 900px) {
  .LocalMusic {
    #tabsArea {
      width: 87vw !important;
      max-width: 87vw !important;
    }
  }
}
</style>
