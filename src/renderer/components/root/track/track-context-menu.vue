<template>
  <div
    class="trackOptions blurred_bg blur10"
    @click="close"
  >
    <div
      class="option hideOnMultiSelectMode"
      @click.stop="playNext"
    >
      <base-icon icon="skip-forward" />
      <span>Play Next</span>
    </div>
    <div
      class="option"
      @click.stop="queueTrack"
    >
      <base icon="queue">
      <span>Add to Queue</span>
    </div>
    <div
      class="option"
      @click.stop="addToFavorites"
    >
      <base-icon icon="heart" />
      <span>Add to Favorites</span>
    </div>
    <div
      v-if="currentTab !== 'Playlists'"
      class="option"
      @click.stop="showPlaylistWidget"
    >
      <base-icon icon="list-plus" />
      <span>Add to Playlist</span>
    </div>
    <div
      v-if="currentTab === 'Playlists'"
      class="option"
      @click.stop="removeFromPlaylist"
    >
      <base-icon icon="x-circle" />
      <span>Remove from Playlist</span>
    </div>
    <div
      class="option"
      @click.stop="deleteSelectedTracks"
    >
      <base-icon icon="trash-simple" />
      <span>Delete Permanently</span>
    </div>
    <div
      class="option hideOnMultiSelectMode"
      @click.stop="showTagEditor"
    >
      <base-icon icon="pencil-simple" />
      <span>Edit Tags</span>
    </div>
  </div>
</template>

<script>
  import { sendMessageToNode } from '@/renderer/utils/index';
  import { mapMutations } from 'vuex';

  export default {
    name: 'TrackContextMenu',

    computed: {
      UIcontroller() {
        return this.$store.state.UIController.UIProperties;
      },
      selectedGroup() {
        return this.$store.state.TrackSelector.selectedGroup;
      },
      selectedTracks() {
        return this.$store.state.TrackSelector.selectedTracks;
      },
      currentTab() {
        return this.$store.state.UIController.UIProperties.currentMainTab;
      }
    },
    methods: {
      ...mapMutations([
        'addSelectedTracksToPlaylist',
        'deleteSelectedTrackFromPlaylist',
        'UIcontrollerToggleProperty',
        'UIcontrollerSetPropertyValue',
        'addToCustomQueue',
        'addSelectedTrackToCustomQueue',
        'setSelectedTrackToPlayNext',
        'clearSelectedTracks',
        'pushNotification'
      ]),
      queueTrack() {
        this.addSelectedTrackToCustomQueue();
        this.UIcontrollerSetPropertyValue({
          property: 'currentSidePaneTab',
          newValue: 'Queue'
        });
        this.pushNotification({
          title: 'Track(s) added to queue',
          subTitle: null,
          type: 'normal'
        });
        this.close();
      },
      playNext() {
        this.setSelectedTrackToPlayNext();
        this.pushNotification({
          title: `Playing that track Next`,
          subTitle: null,
          type: 'normal'
        });
        this.close();
      },
      close() {
        document.querySelector('.trackOptions').style.height = `0px`;
        this.UIcontrollerSetPropertyValue({
          property: 'multiSelectMode',
          newValue: false
        });
      },
      showPlaylistWidget() {
        if (!this.UIcontroller.showPlaylistWidget) {
          this.UIcontrollerToggleProperty('showPlaylistWidget');
        }
        const optionsWidget = document.querySelector('.trackOptions');
        const cordinates = {
          x: parseInt(
            window.getComputedStyle(optionsWidget).left.replace('px', '')
          ),
          y: parseInt(
            window.getComputedStyle(optionsWidget).top.replace('px', '')
          )
        };
        this.close();
      },
      removeFromPlaylist() {
        this.deleteSelectedTrackFromPlaylist();
        this.close();
        this.pushNotification({
          title: `Removed from Favorites ${this.selectedGroup.name}`,
          subTitle: `${this.selectedTracks[0].defaultTitle}`,
          type: 'danger'
        });
        this.clearSelectedTracks();
      },
      addToFavorites() {
        this.addSelectedTracksToPlaylist('Favorites');
        this.pushNotification({
          title: `Added to Favorites`,
          subTitle: `${this.selectedTracks[0].defaultTitle}`,
          type: 'normal'
        });
        this.close();
        this.clearSelectedTracks();
      },
      showTagEditor() {
        this.UIcontrollerToggleProperty('showTagEditor');
        this.$emit('targetTrack', this.selectedTracks[0]);
        this.close();
        this.clearSelectedTracks();
      },
      deleteSelectedTracks() {
        sendMessageToNode('deleteFiles', this.selectedTracks);
        this.close();
      }
    }
  };
</script>

<style lang="scss">
  .multiSelectMode {
    .trackOptions {
      height: 150px !important;
      .hideOnMultiSelectMode {
        display: none !important;
      }
    }
  }
  .trackOptions {
    position: fixed;
    top: 0px;
    z-index: 80;
    left: 10px;
    border-radius: 20px;
    width: 220px;
    height: 0px;
    overflow: hidden;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.597) !important;
    transition: 0.2s ease;
    .option {
      padding: 8px;
      padding-left: 10px;
      cursor: pointer;
      display: grid;
      grid-template-columns: 1fr 5fr;
      transition: 0.2s ease;
      span {
        font-family: inherit;
      }
      img {
        width: 20px;
      }
    }
    .option:hover {
      background-color: #ffffff1e;
      border-radius: 20px;
      margin: 5px;
    }
  }
</style>
