<template>
  <div class="LocalMusic">
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <PlaylistWidget v-if="showPlaylistWidget" />
      <TagEditor v-if="showTagEditor" :targetTrack="selectedTrack" />
    </transition>
    <transition
      enter-active-class="animated fadeInUp extrafaster"
      leave-active-class="animated fadeOutDown extrafaster"
    >
      <ImageSearch v-if="showImageSearcher" />
    </transition>
    <main>
      <section
        :class="[multiSelectOn ? 'multiSelectMode' : '', 'bg2']"
        id="tabsArea"
      >
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
import ImageSearch from "@/RendererProcess/components/LocalMusic/Widgets/ImageSearch.vue";

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
    showImageSearcher() {
      return this.$store.state.UIController.UIProperties.showImageSearcher;
    },
    multiSelectOn() {
      return this.$store.state.UIController.UIProperties.multiSelectMode;
    },
  },
  components: {
    TabsPaneHeader,
    TabSwitcher,
    SidePane,
    PlaylistWidget,
    TagEditor,
    TrackContextMenu,
    ImageSearch,
  },
  methods: {
    setTagEditorTrack(track) {
      this.selectedTrack = track;
    },
  },
  mounted() {
    const tabsArea = document.querySelector("#tabsArea");
    tabsArea.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const filePaths = Array.from(event.dataTransfer.files).map(
        (file) => file.path
      );
      ipcRenderer.send("processDroppedFiles", filePaths);
    });
    tabsArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // document.body.classList.add("droppingAFile");
    });
    // tabsArea.addEventListener("dragleave", () => {
    //   document.body.classList.remove("droppingAFile");
    // });
  },
};
</script>
<style lang="scss">
@import "@/RendererProcess/assets/sass/mixins.scss";
.droppingAFile {
  .LocalMusic {
    main {
      #tabsArea {
        &::before {
          display: flex;
        }
      }
    }
  }
}
.LocalMusic {
  height: 100%;
  width: 100%;
  main {
    height: 100%;
    display: flex;
    #tabsArea {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 10px;
      height: 97%;
      width: 80%;
      margin-right: 10px;
      border-radius: 20px;
      &::before {
        content: "💧Drop it, Right Here 🛒";
        position: absolute;
        z-index: 100;
        border-radius: 15px;
        font-size: 2rem;
        @include center-flex;
        display: none;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        @include blur-bg(20px);
        cursor: copy;
        // pointer-events: none;
      }
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
