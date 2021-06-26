<template>
  <div class="Notifications">
    <transition-group
      enter-active-class="animated fadeInDown extrafaster"
      leave-active-class="animated fadeOutUp extrafaster"
    >
      <BaseNotification
        :key="notification.title"
        v-for="notification in notifications"
        :notification="notification"
      />
    </transition-group>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapMutations } from "vuex";
import BaseNotification from "./BaseNotification.vue";
export default {
  data() {
    return {
      progressNotificationSent: false,
    };
  },
  components: { BaseNotification },
  computed: {
    notifications() {
      return this.$store.state.NotificationManager.notifications;
    },
  },
  methods: {
    ...mapMutations(["pushNotification"]),
  },
  mounted() {
    ipcRenderer.on("normalMsg", (e, msg) =>
      this.pushNotification({
        title: msg,
        subTitle: null,
        type: "normal",
      })
    );
    ipcRenderer.on("errorMsg", (e, msg) =>
      this.pushNotification({
        title: msg,
        subTitle: null,
        type: "danger",
      })
    );
    ipcRenderer.on("parsingProgress", (e, [currentIndex, total]) => {
      if (!this.progressNotificationSent) {
        this.progressNotificationSent = true;
        this.pushNotification({
          title: "Adding tracks",
          subTitle: `${currentIndex}/${total}`,
          type: "persist",
        });
      }
    });
  },
};
</script>

<style lang="scss">
.Notifications {
  position: fixed;
  z-index: 100;
  right: 0;
}
</style>
