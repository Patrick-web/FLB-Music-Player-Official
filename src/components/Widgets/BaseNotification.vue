<template>
	<div
		@click="popNotification"
		:class="[currentNotification.type, 'notificationCard']"
	>
		<h4>{{ currentNotification.title }}</h4>
		<p v-if="currentNotification.subTitle">
			{{ currentNotification.subTitle }}
		</p>
	</div>
</template>

<script>
	import { ipcRenderer } from "electron";
	import { mapActions } from "vuex";
	export default {
		data() {
			return {
				currentNotification: this.notification,
			};
		},
		methods: {
			...mapActions(["popNotification"]),
		},
		mounted() {
			setTimeout(() => {
				if (this.notification.type !== "persist") {
					this.popNotification();
				}
			}, 1500);
			ipcRenderer.on("parsingProgress", (e, [currentIndex, total]) => {
				this.currentNotification.subTitle = `${currentIndex}/${total}`;
			});
		},
		props: {
			notification: Object,
		},
	};
</script>

<style></style>
