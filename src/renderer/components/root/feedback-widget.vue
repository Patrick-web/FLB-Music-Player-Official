<template>
  <div class="feedback_widget widget blurred_bg blur20 max-h-80 bottom10">
    <div class="widget_header">
      <h1 class="widget_title">Feedback</h1>
      <base-button
        icon="x"
        extra-class="widget_close shrink_icon circle shrink8"
        :small="true"
        @click.native="UIcontrollerToggleProperty('showFeedbackWidget')"
      />
    </div>
    <div class="flex-col border_split mb10">
      <p class="mb10 text-light">Report an Issue 🐜</p>
      <input
        v-model="issue.title"
        placeholder="Title"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
      />
      <textarea
        v-model="issue.description"
        placeholder="Description"
        rows="5"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
      />
      <base-button :block="true" text="Send" class="mb10" />
    </div>
    <div class="flex-col">
      <p class="mb10 text-light">Request a Feature 💎</p>
      <input
        v-model="request.title"
        placeholder="Title"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
      />
      <textarea
        v-model="request.description"
        placeholder="Description"
        rows="5"
        type="text"
        class="inputElem mb10 min-w-90 pr10 max-w-90"
      />
      <base-button :block="true" text="Send" class="mb10" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'FeedbackWidget',

  data() {
    return {
      issue: {
        title: '',
        description: ''
      },
      request: {
        title: '',
        description: ''
      }
    };
  },
  methods: {
    ...mapMutations(['UIcontrollerToggleProperty'])
  }
};
</script>

<style></style>
