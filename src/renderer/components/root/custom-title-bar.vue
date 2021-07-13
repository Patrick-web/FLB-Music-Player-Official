<template>
  <div class="customTitleBar bg1">
    <div class="leftSide">
      <!-- <img id="logo" src="@img/Logopng" /> -->
      <p>Melody Music</p>
    </div>
    <div class="ctrls">
      <div class="ctrl" @click="sendMessage('minimize')">
        <base-icon class="icon" icon="caret-down" weight="regular" />
      </div>
      <div class="ctrl" @click="sendMessage('maximize')">
        <base-icon class="icon" icon="caret-up" weight="regular" />
      </div>
      <div id="closeWindow" class="ctrl" @click="sendMessage('closeWindow')">
        <base-icon class="icon" icon="x" />
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessageToNode } from '@/renderer/utils/index';

export default {
  name: 'CustomTitleBar',

  methods: {
    sendMessage(msg) {
      sendMessageToNode(msg);
    }
  }
};
</script>
<style scoped lang="scss">
.miniMode {
  .customTitleBar {
    opacity: 0;
  }
  .ctrls {
    pointer-events: none;
  }
}
.customTitleBar {
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  padding-top: 0px;
  -webkit-app-region: drag;
  position: relative;
  z-index: 100;
  .leftSide {
    display: flex;
    align-items: center;
    margin-top: 5px;
    #logo {
      width: 15px;
      margin-right: -2px;
    }
    p {
      font-family: inherit;
      font-size: 0.9rem;
    }
  }
  .ctrls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    -webkit-app-region: no-drag;
    margin-bottom: -5px;
    margin-right: 5px;
    .ctrl {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      padding-right: 15px;
      padding-left: 15px;
      cursor: pointer;
      img {
        width: 15px;
        align-self: center;
      }
    }
    .ctrl:hover {
      background: rgba(255, 255, 255, 0.193);
    }
    #closeWindow:hover {
      background: red;
    }
  }
}
</style>
