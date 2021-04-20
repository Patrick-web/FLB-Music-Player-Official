<template>
  <div class="Tabswitcher">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      :class="[currentPodcastTab === tab.name ? 'activeTab' : '', 'tabBtn bg2']"
      @click="routeTo(tab)"
      :id="tab.name"
    >
      <img :src="tab.icon" class="icon" alt="" />
      <p>{{ tab.name }}</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

import homeIcon from "@/RendererProcess/assets/images/home.svg";
import heartIcon from "@/RendererProcess/assets/images/heart.svg";
import downloadIcon from "@/RendererProcess/assets/images/cloud-download.svg";
export default {
  data() {
    return {
      tabs: [
        { name: "Discover", path: "/discover", icon: homeIcon },
        { name: "Subscriptions", path: "/subscriptions", icon: heartIcon },
        { name: "Downloads", path: "/downloads", icon: downloadIcon },
      ],
    };
  },
  computed: {
    currentPodcastTab() {
      return this.$store.state.UIController.UIProperties.currentPodcastsTab;
    },
  },
  methods: {
    ...mapMutations(["UIcontrollerSetPropertyValue"]),
    routeTo(tab) {
      if (tab.path !== this.$route.path) this.$router.push(tab.path);
      this.UIcontrollerSetPropertyValue({
        property: "currentPodcastsTab",
        newValue: tab.name,
      });
    },
  },
};
</script>

<style>
</style>