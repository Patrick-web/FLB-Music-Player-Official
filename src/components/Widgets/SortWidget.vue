<template>
  <div class="sortOption actionBt">
    <button
      @click="showSortOptions = !showSortOptions"
      :class="[showSortOptions ? 'bt_active' : '', 'btWithIcon']"
      title="Sort Tracks"
      style="min-width: 70px"
    >
      <p>Sort</p>
      <img id="sortIcon" src="@/assets/images/sort.svg" alt="" />
    </button>
    <transition
      enter-active-class="animated extrafaster fadeInUp"
      leave-active-class="animated extrafaster fadeOutDown"
    >
      <section v-if="showSortOptions" class="sortParams">
        <p class="param" @click.stop="sortBy($event, 'defaultTitle')">Name</p>
        <p class="param" @click.stop="sortBy($event, 'defaultArtist')">
          Artist
        </p>
        <p class="param" @click.stop="sortBy($event, 'duration')">Length</p>
        <p class="param" @click.stop="sortBy($event, 'dateAdded')">Date</p>
        <p class="param" @click="toggleSortBy">Flip</p>
      </section>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      showSortOptions: false,
      ascending: false,
    };
  },
  methods: {
    ...mapMutations(["reverseAddedTracksArray"]),
    ...mapActions(["sortTracks", "toggleSortMode"]),
    toggleHiddenActions() {
      document
        .querySelector(".sortOption")
        .classList.toggle("showHiddenActions");
      document
        .querySelectorAll(".hiddenActions")
        .forEach((e) => e.classList.toggle("slideInUp"));
    },
    toggleSortBy() {
      this.ascending = !this.ascending;
      this.toggleSortMode();
    },
    sortBy(e, param) {
      if (document.querySelector(".selectedParam")) {
        document
          .querySelector(".selectedParam")
          .classList.remove("selectedParam");
      }
      e.currentTarget.classList.add("selectedParam");
      this.sortTracks(param);
    },
  },
};
</script>

<style lang="scss">
.flipped {
  transform: rotateY(180deg);
}
.sortOption {
  position: relative;
  .toggler {
    background: rgba(255, 255, 255, 0.083);
    display: flex;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
  }
  .toggler:hover {
    background: rgba(255, 255, 255, 0.144);
  }
  .sortParams {
    bottom: -160px;
    border-radius: 15px;
    right: -6px;
    position: absolute;
    width: 80px;
    backdrop-filter: blur(20px) !important;
    box-shadow: 0px 0px 50px black;
    background: rgba(29, 29, 29, 0.199);
    overflow: hidden;
    .param {
      padding: 5px;
      text-align: center;
      font-family: roboto-thin;
      backdrop-filter: blur(10px) !important;
      cursor: pointer;
    }
    .param:hover {
      background-color: #ffffff44;
      border-radius: 20px;
      margin: 5px;
      border: none;
    }
    .selectedParam {
      background: #0062ff;
    }
    .selectedParam:hover {
      background: #0062ff;
    }
  }
  .byDesc {
    #desc {
      display: block !important;
    }
    #asc {
      display: none !important;
    }
  }
  .sortMode:hover {
    background: #0062ff;
  }

  .sortMode {
    position: absolute;
    bottom: -230px;
    left: -5px;
    backdrop-filter: blur(10px);
    padding: 8px;
    border-radius: 10px;
    font-family: roboto-thin;
    p {
      display: none;
    }
    #desc {
      display: none;
    }
    #asc {
      display: block;
    }
  }
}
</style>
