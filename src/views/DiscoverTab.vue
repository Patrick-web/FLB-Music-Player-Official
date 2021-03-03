<template>
  <div v-if="currentTab == 'discoverTab'" class="tab discoverTab">
    <Deezer />
    <!-- <Spotify /> -->
  </div>
</template>

<script>
import Deezer from "@/components/Deezer.vue";
import { mapGetters, mapMutations } from "vuex";
import Spotify from "../Spotify.vue";

export default {
  computed: {
    ...mapGetters(["currentTab"]),
  },
  components: {
    Deezer,
    Spotify,
  },
};
</script>

<style>
.discoverTab {
  padding-bottom: 0px !important;
}
</style>
