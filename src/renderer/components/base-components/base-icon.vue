<template>
  <component
    :is="is"
    :size="size"
    :color="color"
    :weight="weight"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script>
import { pascalCase } from 'scule';
import {
  PhArrowClockwise,
  PhBookOpen,
  PhCaretDown,
  PhCaretLeft,
  PhCaretUp,
  PhClockClockwise,
  PhCloudArrowDown,
  PhCrop,
  PhDisc,
  PhFaders,
  PhFolderSimple,
  PhFunnelSimple,
  PhGearSix,
  PhHeart,
  PhHouse,
  PhListPlus,
  PhMicrophone,
  PhMusicNoteSimple,
  PhMusicNotesSimple,
  PhPencilSimple,
  PhPlay,
  PhPlaylist,
  PhQueue,
  PhRepeat,
  PhSelectionBackground,
  PhShuffle,
  PhSkipBack,
  PhSkipForward,
  PhSortAscending,
  PhTrashSimple,
  PhUser,
  PhX
} from 'phosphor-icons';

export default {
  name: 'BaseIcon',
  components: {
    PhDisc,
    PhCrop,
    PhPlay,
    PhHeart,
    PhQueue,
    PhHouse,
    PhRepeat,
    PhFaders,
    PhGearSix,
    PhCaretUp,
    PhPlaylist,
    PhListPlus,
    PhBookOpen,
    PhCaretLeft,
    PhCaretDown,
    PhMicrophone,
    PhFolderSimple,
    PhPencilSimple,
    PhFunnelSimple,
    PhSortAscending,
    PhCloudArrowDown,
    PhMusicNoteSimple,
    PhMusicNotesSimple,
    PhSelectionBackground,
    PhArrowClockwise,
    PhClockClockwise,
    PhSkipForward,
    PhTrashSimple,
    PhSkipBack,
    PhShuffle,
    PhUser,
    PhX
  },
  computed: {
    is() {
      return pascalCase(`ph-${this.icon}`);
    }
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    weight: {
      type: String,
      default: 'fill'
    },
    size: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: '#fff'
    }
  }
};
</script>
