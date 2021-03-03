<template>
	<div class="QueuedTracks animated faster disable__options">
		<!-- <p
      style="text-align:center;margin-top:250px;padding:10px;font-family:roboto-light"
      v-if="customQueue.length == 0"
    >
      Queue is Empty. Right click on a track to add it to the queue
    </p> -->
		<div class="QueuedTracksWrapper">
			<button
				class="dangerBt"
				style="margin-bottom:10px"
				@click="clearCustomQueue"
				v-if="customQueue.length !== 0"
			>
				Clear Queue
			</button>
			<draggable
				v-model="customQueue"
				ghost-class="ghost"
				@start="drag = true"
				@end="drag = false"
			>
				<transition-group
					enter-active-class="animated  lightSpeedIn faster"
					leave-active-class="animated hinge fast"
				>
					<div
						v-for="(track, index) in customQueue"
						:key="track.fileLocation"
						class="queuedTrack"
						@click.stop="playQueuedTrack($event, index, track)"
					>
						<h3>{{ track.defaultTitle }}</h3>
						<p>{{ track.defaultArtist }}</p>
						<img
							@click.stop="removeTrackFromQueue(index)"
							src="@/assets/images/x.svg"
							alt=""
						/>
					</div>
				</transition-group>
			</draggable>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import draggable from "vuedraggable";
export default {
	data() {
		return {
			queue: [],
		};
	},
	components: {
		draggable,
	},
	computed: {
		// ...mapState(["customQueue", "UIcontroller"]),
		customQueue: {
			get() {
				return this.$store.state.customQueue;
			},
			set(value) {
				this.$store.commit("updateCustomQueue", value);
			},
		},
	},
	methods: {
		...mapMutations([
			"setPlayingTrack",
			"removeTrackFromQueue",
			"UIcontrollerToggleProperty",
			"clearCustomQueue",
		]),
		playQueuedTrack(e, index, track) {
			const trackBox = e.currentTarget;
			trackBox.classList.add("playingTrack");
			this.setPlayingTrack(track);
			this.removeTrackFromQueue(index);
			document.querySelector("audio").muted = false;
		},
	},
};
</script>

<style lang="scss">
.QueuedTracks {
	height: 85vh;
	width: 100%;
	overflow: hidden;
	overflow-x: scroll;
	.queuedTrack {
		position: relative;
		background: rgba(0, 0, 0, 0.247);
		padding: 10px;
		border-radius: 10px;
		margin-bottom: 10px;
		margin-right: 10px;
		cursor: pointer;
		h3 {
			font-family: roboto;
			font-weight: 500;
			font-size: 1rem;
		}
		p {
			font-family: roboto-thin;
			font-size: 0.9rem;
		}
		img {
			position: absolute;
			top: 50%;
			right: 15px;
			transform: translateY(-50%) scale(0);
			width: 10px;
			padding: 5px;
			background: crimson;
			border-radius: 5px;
		}
		img:hover {
			transform: translateY(-50%) scale(1.2) !important;
		}
	}
	.ghost {
		background: rgba(255, 255, 255, 0.349);
	}
	.queuedTrack:hover {
		background: rgba(255, 255, 255, 0.158);
		img {
			transform: translateY(-50%) scale(1);
		}
	}
	.playingtrack {
		z-index: 1;
		margin-top: 0px;
		box-shadow: none;
		.info {
			padding-left: 5px !important;
		}
		.cover {
			transform: scale(0.8);
			box-shadow: none;
			box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.123);
		}
		.options {
			display: none;
		}
		.unQueueIcon {
			display: none;
		}
	}
}
</style>
