<template>
  <div class="editPlForm">
    <input
      class="inputElem"
      type="text"
      v-model="newPlaylistName"
      placeholder="New Playlist Name"
    />
    <button
      style="margin-top: 10px; width: 100%"
      @click="emitNewPlaylistName"
      v-if="newPlaylistName"
    >
      <p>Save</p>
    </button>
    <button
      style="margin-top: 10px; width: 100%"
      class="dangerBt"
      @click="closeWidget"
    >
      Cancel
    </button>
  </div>
</template>

<script>
export default {
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
  background: rgba(255, 255, 255, 0.123);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 20px;
  bottom: 50px;
  height: 80px;
  right: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>