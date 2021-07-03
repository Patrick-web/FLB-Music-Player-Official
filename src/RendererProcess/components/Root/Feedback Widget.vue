<template>
  <div class="feedback_widget widget blurred_bg blur20 max-h-80 bottom10">
    <div class="widget_header">
      <h1 class="widget_title">Feedback</h1>
      <base-button
        @click.native="UIcontrollerToggleProperty('showFeedbackWidget')"
        :icon="require('@/RendererProcess/assets/images/x.svg')"
        extraClass="widget_close shrink_icon circle shrink8"
        :small="true"
      />
    </div>
    <div class="flex-col border_split mb10">
      <p class="mb10 text-light">Report an Issue 🐜</p>
      <input
        placeholder="Title"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
        v-model="issue.title"
      />
      <textarea
        placeholder="Description"
        rows="5"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
        v-model="issue.description"
      />
      <base-button :block="true" text="Send" class="mb10" />
    </div>
    <div class="flex-col">
      <p class="mb10 text-light">Request a Feature 💎</p>
      <input
        placeholder="Title"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
        v-model="request.title"
      />
      <textarea
        placeholder="Description"
        rows="5"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
        v-model="request.description"
      />
      <base-button :block="true" text="Send" class="mb10" />
    </div>
  </div>
</template>

<script>
import BaseButton from "../BaseComponents/BaseButton.vue";
import { mapMutations } from "vuex";

export default {
  components: { BaseButton },
  data() {
    return {
      issue: {
        title: "",
        description: "",
      },
      request: {
        title: "",
        description: "",
      },
    };
  },
  methods: {
    ...mapMutations(["UIcontrollerToggleProperty"]),
  },
};
</script>

<style>
</style>