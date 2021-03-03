<template>
	<div class="tab recentsTab">
		<TrackCard
			v-for="track in renderedTracks"
			:source="track"
			:key="track.fileLocation"
			:index="0"
		/>
	</div>
</template>
<script>
import { mapState } from "vuex";
import TrackCard from "@/components/Widgets/TrackCard.vue";

export default {
	data() {
		return {
			card: TrackCard,
		};
	},
	computed: {
		...mapState(["renderedTracks"]),
	},
	components: {
		TrackCard,
	},
};
</script>

<style>
.recentsTab {
	overflow: hidden;
	overflow-y: scroll;
	height: 70vh;
}
</style>
