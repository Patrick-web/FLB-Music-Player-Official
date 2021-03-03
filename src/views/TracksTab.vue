<template>
	<div class="tab addedTracksTab">
		<div v-if="renderedTracks.length == 0" class="loadingArea">
			<div class="loadingIndicator"></div>
		</div>
		<virtual-list
			style="height: 70vh;overflow:hidden; overflow-y: scroll;"
			scrollable
			:data-key="'fileLocation'"
			:data-sources="renderedTracks"
			:data-component="card"
		/>
		<TrackCard v-if="0" />
	</div>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
import TrackCard from "@/components/Widgets/TrackCard.vue";
import { mapMutations, mapState } from "vuex";
export default {
	data() {
		return {
			card: TrackCard,
		};
	},
	computed: {
		...mapState(["renderedTracks"]),
	},
	methods: {
		...mapMutations(["updatePlayingQueue", "setRenderedTrack"]),
	},
	components: {
		TrackCard,
		VirtualList,
		// Player,
	},
};
</script>

<style lang="scss">
.fxMode {
	.fxModeToggle {
		background: rgb(109, 81, 90) !important;
	}
	#enterFxMode {
		display: none !important;
	}
	#exitFxMode {
		display: block !important;
	}
}
.addedTracksTab {
	position: relative;
	overflow: hidden !important;
	height: auto !important;
	.showHiddenActions {
		background: #0062ff !important;
		border-radius: 12px !important;
		.hiddenActions {
			display: block !important;
		}
	}
	.trackActions {
		position: sticky;
		background-color: rgba(0, 0, 0, 0.247);
		backdrop-filter: blur(10px);
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		padding: 10px;
		padding-right: 15px;
		padding-left: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
		.hiddenActions {
			display: none;
			box-shadow: 0px 0px 50px black;
		}
		#enterFxMode {
			display: block;
		}
		#exitFxMode {
			display: none;
		}
		.actionBt {
			background-color: rgba(0, 0, 0, 0.295);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px;
			border-radius: 40px;
			cursor: pointer;
		}
		.actionBt:hover {
			background-color: rgba(252, 252, 252, 0.089);
		}
	}
}
// @media (max-width: 900px) {
//   .addedTracksTab {
//     height: 100vh !important;
//   }
//   .trackActions {
//     display: none !important;
//   }
// }
</style>
