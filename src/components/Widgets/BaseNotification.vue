<template>
	<div :class="[notification.type, 'notificationCard']">
		<h4>{{ notification.title }}</h4>
		<p v-if="notification.subTitle">{{ notification.subTitle }}</p>
	</div>
</template>

<script>
import { mapActions } from "vuex";
export default {
	methods: {
		...mapActions(["popNotification"]),
	},
	mounted() {
		setTimeout(() => {
			this.popNotification();
		}, 1500);
	},
	props: {
		notification: Object,
	},
};
</script>

<style></style>
