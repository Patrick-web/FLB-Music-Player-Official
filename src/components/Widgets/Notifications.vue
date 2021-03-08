<template>
	<div class="Notifications">
		<transition-group
			enter-active-class="animated slideInDown extrafaster"
			leave-active-class="animated slideOutRight extrafaster"
		>
			<BaseNotification
				:key="index"
				v-for="(notification, index) in notifications"
				:notification="notification"
			/>
		</transition-group>
	</div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapActions, mapState } from "vuex";
import BaseNotification from "./BaseNotification.vue";
export default {
	data() {
		return {
			progressNotificationSent: false,
		};
	},
	components: { BaseNotification },
	computed: {
		...mapState(["notifications"]),
	},
	methods: {
		...mapActions(["pushNotification"]),
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
	.notificationCard {
		padding: 10px;
		border-radius: 10px;
		margin: 10px;
	}
	.persist {
		background: rgb(0, 132, 255);
	}
	.normal {
		background: rgb(0, 132, 255);
	}
	.danger {
		background: crimson;
	}
	.warning {
		background: orangered;
	}
}
</style>
