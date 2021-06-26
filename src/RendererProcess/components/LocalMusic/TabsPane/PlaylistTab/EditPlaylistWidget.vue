<template>
  <div class="editPlForm blurred_bg blur20">
    <input
      class="inputElem"
      type="text"
      v-model="newPlaylistName"
      placeholder="New Playlist Name"
    />
    <base-button
      v-if="newPlaylistName"
      @click.native="emitNewPlaylistName"
      text="Save"
    />
    <base-button @click.native="closeWidget" text="Cancel" />
  </div>
</template>

<script>
import BaseButton from "@/RendererProcess/components/BaseComponents/BaseButton.vue";
export default {
  components: {
    BaseButton,
  },
  data() {
    return {
      newPlaylistName: "",
    };
  },
  methods: {
    closeWidget() {
      this.$emit("closeWidget");
    },
    emitNewPlaylistName() {
      this.$emit("newPlaylistName", this.newPlaylistName);
    },
  },
};
</script>

<style lang="scss">
.editPlForm {
  position: absolute;
  border-radius: 20px;
  bottom: 50px;
  right: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  input {
    width: 90%;
  }
}
</style>