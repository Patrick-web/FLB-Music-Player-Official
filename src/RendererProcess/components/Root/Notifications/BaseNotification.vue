<template>
  <div
    @click="popNotification"
    :class="[currentNotification.type, 'notificationCard']"
  >
    <div class="notification_body">
      <h4>{{ currentNotification.title }}</h4>
      <p v-if="currentNotification.subTitle">
        {{ currentNotification.subTitle }}
      </p>
    </div>
    <img
      class="closeNotification"
      src="@/RendererProcess/assets/images/x.svg"
    />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      currentNotification: this.notification,
    };
  },
  methods: {
    ...mapMutations(["popNotification"]),
  },
  mounted() {
    setTimeout(() => {
      if (this.notification.type !== "persist") {
        this.popNotification();
      }
    }, 3000);
    ipcRenderer.on("parsingProgress", (e, [currentIndex, total]) => {
      this.currentNotification.subTitle = `${currentIndex}/${total}`;
    });
  },
  props: {
    notification: Object,
  },
};
</script>

<style lang="scss">
.notificationCard {
  border-radius: 10px;
  margin: 10px;
  max-width: 300px;
  cursor: pointer;
  display: flex;
  align-items: center;
  h4 {
    font-family: roboto-light;
    font-size: 0.9rem;
  }
  p {
    font-family: roboto-thin;
    font-size: 0.8rem;
  }
  .notification_body {
    padding: 10px;
  }
  .closeNotification {
    width: 12px;
    margin-right: 10px;
  }
  .closeNotification:hover {
    transform: scale(1.2);
  }
}
.normal {
  background: var(--accentColor);
}
.danger {
  background: crimson;
}
.warning {
  background: orangered;
}
</style>
