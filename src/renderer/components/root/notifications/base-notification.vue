<template>
  <div
    :class="[currentNotification.type, 'notificationCard']"
    @click="popNotification"
  >
    <div class="notification_body">
      <h4>{{ currentNotification.title }}</h4>
      <p v-if="currentNotification.subTitle">
        {{ currentNotification.subTitle }}
      </p>
    </div>
    <base-icon
      class="closeNotification"
      icon="x"
    />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapMutations } from 'vuex';

export default {
  name: 'BaseNotification',

  data() {
    return {
      currentNotification: this.notification
    };
  },
  methods: {
    ...mapMutations(['popNotification'])
  },
  mounted() {
    setTimeout(() => {
      if (this.notification.type !== 'persist') {
        this.popNotification();
      }
    }, 3000);
    ipcRenderer.on('parsingProgress', (e, [currentIndex, total]) => {
      this.currentNotification.subTitle = `${currentIndex}/${total}`;
    });
  },
  props: {
    notification: Object
  }
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
  background: var(--accentColor, #0066ff);

  h4 {
    font-family: inherit;
    font-size: 0.9rem;
  }
  p {
    font-family: inherit;
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
  background: var(--accentColor, #0066ff);
}
.danger {
  background: crimson !important;
}
.warning {
  background: orangered !important;
}
</style>
