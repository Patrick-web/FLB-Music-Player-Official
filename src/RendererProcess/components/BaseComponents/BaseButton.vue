<template>
  <button
    :style="{ backgroundColor: color }"
    :class="[
      icon && text ? 'btnWithIcon' : '',
      icon && !text ? 'iconBtn' : '',
      !icon && text ? 'plainBtn' : '',
      active ? 'activeBtn' : '',
      block ? 'blockBtn' : '',
      small ? 'smallBtn' : '',
      tiny ? 'tinyBtn' : '',
      extraClass,
      transparent ? 'transparentBt' : '',
      'bg2',
    ]"
  >
    <p v-if="text" class="btnText">{{ text }}</p>
    <img v-if="icon" :src="icon" class="btnIcon" />
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    icon: String,
    type: String,
    color: String,
    active: Boolean,
    block: Boolean,
    small: Boolean,
    tiny: Boolean,
    extraClass: String,
    transparent: Boolean,
  },
};
</script>

<style lang="scss">
button {
  cursor: pointer;
  font-family: roboto;
  border: none;
  transition: 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0);
  p {
    white-space: nowrap;
  }
  &:active {
    border: 1.5px solid rgb(255, 255, 255);
  }
}
.transparentBt {
  background: none !important;
}
.activeBtn {
  background: var(--accentColor) !important;
  &:hover {
    border: 1px solid var(--accentColor) !important;
  }
}
.blockBtn {
  width: 100%;
}
.plainBtn {
  padding: 5px;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 10px;
  height: 30px;
  p {
    font-size: 0.9rem;
    font-family: roboto-light;
  }
  &:hover {
    border-radius: 20px;
    background-color: var(--accentColor) !important;
  }
}
.iconBtn {
  height: 40px;
  width: 40px;
  border-radius: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 50%;
  }
  &:hover {
    border-radius: 50%;
    background-color: var(--accentColor) !important;
  }
}
.btnWithIcon {
  height: 30px;
  width: auto;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-around;
  border-radius: 10px;
  img {
    height: 50%;
  }
  p {
    font-size: 0.9rem;
    font-family: roboto-light;
  }
  &:hover {
    border-radius: 20px;
    background-color: var(--accentColor) !important;
  }
}
.smallBtn {
  transform: scale(0.8);
}
.tinyBtn {
  transform: scale(0.6);
}
</style>