<template lang="html">
  <div class='tab bg1' v-show='isActive'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Tab",
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
};
</script>

<style lang="css">
</style>
