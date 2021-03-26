<template>
  <div class="Tabswitcher">
    <p
      :class="[$route.path === '/' ? 'activeTab' : '']"
      @click="routeTo('/')"
      id="Home"
    >
      Home
    </p>

    <p
      :class="[$route.path === '/tracks' ? 'activeTab' : '']"
      @click="routeTo('/tracks')"
      id="Tracks"
    >
      Tracks
    </p>
    <p
      :class="[$route.path === '/playlists' ? 'activeTab' : '']"
      @click="routeTo('/playlists')"
      id="Playlists"
    >
      Playlists
    </p>
    <p
      :class="[$route.path === '/recents' ? 'activeTab' : '']"
      @click="routeTo('/recents')"
      id="Recents"
    >
      Recents
    </p>
    <p
      :class="[$route.path === '/albums' ? 'activeTab' : '']"
      @click="routeTo('/albums')"
      id="Albums"
    >
      Albums
    </p>
    <p
      :class="[$route.path === '/artists' ? 'activeTab' : '']"
      @click="routeTo('/artists')"
      id="Artists"
    >
      Artists
    </p>
    <p
      :class="[$route.path === '/folders' ? 'activeTab' : '']"
      @click="routeTo('/folders')"
      id="Folders"
    >
      Folders
    </p>
  </div>
</template>

<script lang="js">
	import { mapMutations } from "vuex";
	export default {
	name: "TabSwitcher",
	computed: {
      curentTab(){
        return this.$store.state.UIController.currentMainTab
      }
    },
    methods: {
      ...mapMutations(["deSelectGroup","clearSelectedTracks"]),
      routeTo(tab) {
        this.clearSelectedTracks()
        this.deSelectGroup()
        if(tab!==this.$route.path)
        this.$router.push(tab)
      },
    },
  }
</script>

<style lang="scss">
.traditionalLayout {
  .Tabswitcher {
    width: 60%;
    margin: auto;
    .indicator {
      width: 100px;
    }
  }
}
.light_theme {
  .Tabswitcher {
    .activeTab {
      filter: invert(1);
    }
  }
}
.Tabswitcher {
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  z-index: 10;
  padding: 10px;
  p {
    background: rgba(255, 255, 255, 0.083);
    margin-right: 5px;
    margin-left: 5px;
    text-align: center;
    position: relative;
    z-index: 2;
    padding: 3px;
    padding-top: 5px;
    color: white;
    border-radius: 20px;
    min-width: 70px;
    cursor: pointer;
    transition: 0.2s ease;
    font-size: 0.9rem;
    border-bottom: 3px solid rgba(0, 132, 255, 0);
    a {
      font-family: roboto-light;
    }
  }
  p:hover {
    background: rgba(255, 255, 255, 0.144);
  }
  .activeTab {
    background: var(--accentColor);
    font-family: roboto;
  }
  .activeTab:hover {
    background: var(--accentColor);
  }
}
// @media (max-width: 700px) {
//   .Tabswitcher {
//     display: none;
//   }
// }
</style>
