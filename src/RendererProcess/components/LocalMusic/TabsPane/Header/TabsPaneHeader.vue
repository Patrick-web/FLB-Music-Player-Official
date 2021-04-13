<template>
  <div class="Titlebar">
    <MultiSelectButton />
    <input
      @keyup="search(searchQuery)"
      v-model="searchQuery"
      id="search"
      placeholder="Search"
      class="inputElem"
    />
    <SortWidget />
    <SearchResults v-on:closeSearch="searchQuery = ''" v-if="searchQuery" />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import SortWidget from "./SortWidget.vue";
import SearchResults from "./SearchResults";
import MultiSelectButton from "./MultiSelectButton.vue";
export default {
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    ...mapMutations(["search"]),
  },
  components: {
    SortWidget,
    SearchResults,
    MultiSelectButton,
  },
};
</script>

<style lang="scss">
.searchingState {
  .magnifier {
    pointer-events: none;
    transform: scale(0) !important;
    filter: grayscale(1);
  }
}
.multiSelectMode {
  .multiSelect {
    background: #0062ff !important;
  }
}
.light_theme {
  .searchResults {
    background: black !important;
    border: none !important;
    box-shadow: 4px 4px 10px rgba(255, 255, 255, 0.322) !important;
  }
}
.Titlebar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 21;
  .multiSelect {
    background: rgba(255, 255, 255, 0.083);
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
  }
  .multiSelect:hover {
    max-width: 200px;
    background: rgba(255, 255, 255, 0.144);
  }
}

#search {
  padding: 5px;
  padding-left: 10px;
  font-size: var(--baseFontSize);
  border-radius: 20px;
  border: 1px solid transparent;
  outline: none;
  background: rgba(255, 255, 255, 0.083);
  color: white;
  width: 250px;
  font-family: roboto-light;
  transition: 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
}

#search:focus {
  border-radius: 10px;
  width: 300px;
  background: rgba(255, 255, 255, 0.083);
}
#search:hover {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.144);
  cursor: pointer;
}

.pageNames {
  height: 45px;
  color: white;
  overflow: hidden;
  h1 {
    font-family: roboto-thick;
    font-size: 2.4rem;
  }
}
.tabTitle {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: rgb(var(--base-one), var(--base-two), var(--base-three));
}
</style>
