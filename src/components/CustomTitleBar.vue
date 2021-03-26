<template>
  <div class="customTitleBar">
    <div class="leftSide">
      <img id="logo" src="@/assets/images/FLB Logo.png" alt="" />
      <p>FLB Music</p>
    </div>
    <div class="ctrls">
      <div class="ctrl" @click="sendMessage('minimize')">
        <img src="@/assets/images/windowMinimize.svg" alt="" />
      </div>
      <div @click="sendMessage('maximize')" class="ctrl">
        <img
          style="width: 12px"
          src="@/assets/images/windowMaximize.svg"
          alt=""
        />
      </div>
      <div id="closeWindow" @click="sendMessage('closeWindow')" class="ctrl">
        <img style="width: 12px" src="@/assets/images/windowClose.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessageToNode } from "@/Utils/SharedUtilityFunctions";
export default {
  methods: {
    sendMessage(msg) {
      sendMessageToNode(msg);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.customTitleBar {
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.083);
  padding: 5px;
  padding-top: 0px;
  -webkit-app-region: drag;
  .leftSide {
    display: flex;
    align-items: center;
    margin-top: 5px;
    #logo {
      width: 15px;
      margin-right: 5px;
      transform: scale(0.7);
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
