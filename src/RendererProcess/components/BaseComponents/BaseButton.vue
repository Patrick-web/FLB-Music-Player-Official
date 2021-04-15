<template>
  <button
    :style="{ backgroundColor: color || 'rgba(255, 255, 255, 0.1)' }"
    :class="[
      icon && text ? 'btnWithIcon' : '',
      icon && !text ? 'iconBtn' : '',
      !icon && text ? 'plainBtn' : '',
      active ? 'activeBtn' : '',
      block ? 'blockBtn' : '',
      small ? 'smallBtn' : '',
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
  },
};
</script>

<style lang="scss">
button {
  cursor: pointer;
  font-family: roboto;
  border: none;
  transition: 0.2s ease;
  background-color: rgba(255, 255, 255, 0.151);
  border: 1px solid rgba(255, 255, 255, 0);
  &:active {
    border: none !important;
    background: var(--accentColor) !important;
  }
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
</style>