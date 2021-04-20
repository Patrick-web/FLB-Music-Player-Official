<template>
  <div class="PodHeader flex flex_between center-v">
    <input
      @keyup="search(searchQuery)"
      v-model="searchQuery"
      id="search"
      placeholder="Search"
      class="inputElem bg2"
    />
    <pod-tab-switcher />
  </div>
</template>

<script>
import PodTabSwitcher from "./PodTabSwitcher.vue";
export default {
  components: { PodTabSwitcher },
};
</script>

<style>
.PodHeader {
  transform: translateY(-10px);
}
</style>