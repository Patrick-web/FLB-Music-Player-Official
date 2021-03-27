<template>
	<div class="LyricsContainer">
		<div v-if="!playingTrackLyrics" class="loadingArea center-content">
			<div class="loadingIndicator"></div>
		</div>
    <div v-if="!playingTrackLyrics" class="center-content">
    <p>Make Sure You Internet Connetion to Use this Feature</p>
    </div>
		<div class="lyrics">
			<p v-for="(verse, index) in playingTrackLyrics" :key="index">
        <pre>
				{{ verse }}
        </pre>
			</p>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	computed: {
		...mapState(["playingTrackLyrics"]),
	},
};
</script>

<style lang="scss">
.LyricsContainer {
	position: relative;
	overflow: hidden;
	height: 600px;
	overflow-y: scroll;
	.lyrics {
		position: absolute;
		font-family: roboto-light;
		text-align: left;
		padding: 10px;
		p {
			background: rgba(255, 255, 255, 0.111);
			padding: 10px;
			width:250px;
			margin-bottom: 10px;
			margin-left: -10px;
			line-height: 1.5rem;
      pre{
        white-space: pre-wrap; 
      }
		}
		// width: 100px;
	}
}
</style>
