<template>
  <div class="bingSearchBar">
    <input
      id="bingSearch"
      v-model="query"
      placeholder="Search and Download Music"
      type="text"
      class="BigSearch inputElem"
      @keyup.enter="sendSearchQuery"
    >
    <p
      id="bingEnter"
      style="opacity: 0"
      @click="sendSearchQuery"
    />
    <base-button
      v-if="searchIsComplete"
      id="clearResultsIcon"
      icon="x"
      title="Clear Results"
      @click.native="clearSearch"
    />
    <div
      v-if="searchInProgress && !searchIsComplete"
      id="fetchIndicator"
      class="loadingIndicator"
    />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';

  export default {
    name: 'BingSearchBar',

    props: {
      searchIsComplete: Boolean,
      searchInProgress: Boolean
    },
    data() {
      return {
        query: ''
      };
    },
    computed: {
      appIsOnline() {
        return this.$store.state.appIsOnline;
      }
    },
    methods: {
      ...mapMutations(['pushNotification']),
      sendSearchQuery() {
        if (!this.query) return;
        if (!this.appIsOnline) {
          this.pushNotification({
            title: `No internet connection detected`,
            subTitle: null,
            type: 'danger'
          });
          return;
        }
        this.$emit('searchQuery', this.query);
      },
      clearSearch() {
        console.log('object');
        this.$emit('clearSearch');
        this.query = '';
      }
    }
  };
</script>

<style lang="scss">
  .bingSearchBar {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .BigSearch {
      width: 60%;
      border-radius: 40px;
      outline: none;
      border: none;
      background: rgba(255, 255, 255, 0.103);
      font-size: 1.2em;
      font-family: inherit;
      padding: 10px;
    }
    #clearResultsIcon {
      position: absolute;
      right: 19.5%;
      bottom: 2px;
      cursor: pointer;
      z-index: 4;
      transform: scale(0.8);
      border-radius: 50%;
      img {
        transform: scale(0.8);
      }
    }
    #fetchIndicator {
      position: absolute;
      right: -15px;
      top: 0px;
      transform: scale(0.8) translateX(40px) translateY(-10px);
      opacity: 0.7;
    }
  }
</style>
