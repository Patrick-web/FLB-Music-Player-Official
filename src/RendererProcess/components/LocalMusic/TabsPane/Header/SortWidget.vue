<template>
  <div class="sortOption actionBt">
    <button
      @click="showSortOptions = !showSortOptions"
      :class="[showSortOptions ? 'bt_active' : '', 'btWithIcon']"
      title="Sort Tracks"
      style="min-width: 70px"
    >
      <p>Sort</p>
      <img
        id="sortIcon"
        src="@/RendererProcess/assets/images/sort.svg"
        alt=""
      />
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
        <!-- <p class="param" @click.stop="sortBy($event, 'duration')">Length</p> -->
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
    position: absolute;
    bottom: -150px;
    border-radius: 15px;
    right: -6px;
    width: auto !important;
    height: auto;
    padding: 0;
    backdrop-filter: blur(20px) !important;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.267);
    overflow: hidden;
    .param {
      padding: 5px;
      margin: 5px;
      width: 60px;
      text-align: center;
      font-family: roboto-thin;
      backdrop-filter: blur(10px) !important;
      cursor: pointer;
    }
    .param:hover {
      background-color: #ffffff13;
      border-radius: 20px;
    }
    .selectedParam {
      background: #0062ff;
      border-radius: 20px;
    }
    .selectedParam:hover {
      border-radius: 20px;
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
