<template>
  <div class="customTitleBar bg1">
    <div class="leftSide">
      <img id="logo" src="@/RendererProcess/assets/images/Logo.png" alt="" />
      <p>LB Music</p>
    </div>
    <div class="ctrls">
      <div class="ctrl" @click="sendMessage('minimize')">
        <img
          class="icon"
          src="@/RendererProcess/assets/images/windowMinimize.svg"
          alt=""
        />
      </div>
      <div @click="sendMessage('maximize')" class="ctrl">
        <img
          class="icon"
          style="width: 12px"
          src="@/RendererProcess/assets/images/windowMaximize.svg"
        />
      </div>
      <div id="closeWindow" @click="sendMessage('closeWindow')" class="ctrl">
        <img
          class="icon"
          style="width: 12px"
          src="@/RendererProcess/assets/images/windowClose.svg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessageToNode } from "@/RendererProcess/utilities/index";

export default {
  methods: {
    sendMessage(msg) {
      sendMessageToNode(msg);
    },
  },
};
</script>
<style scoped lang="scss">
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
      font-family: roboto-light;
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
