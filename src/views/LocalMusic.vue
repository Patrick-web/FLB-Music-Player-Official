<template>
	<div class="LocalMusic">
		<transition
			enter-active-class="animated fadeInUp extrafaster"
			leave-active-class="animated fadeOutDown extrafaster"
		>
			<PlaylistWidget v-if="UIcontroller.showPlaylistWidget" />
			<Settings v-if="UIcontroller.showSettings" />
			<TagEditor
				v-if="UIcontroller.showTagEditor"
				:targetTrack="selectedTrack"
			/>
		</transition>
		<main>
			<section id="centralArea_tabs">
				<TrackOptions v-on:targetTrack="setTagEditorTrack" />
				<TitleArea />
				<TabSwitcher />
				<router-view />
			</section>
			<SidePane v-on:targetTrack="setTagEditorTrack" />
		</main>
	</div>
</template>

<script>
import TitleArea from "@/components/RootComponents/TitleArea.vue";
import TabSwitcher from "@/components/RootComponents/TabSwitcher.vue";
import SidePane from "@/components/SidePane/SidePane.vue";
import PlaylistWidget from "@/components/Widgets/PlaylistWidget";
import Settings from "@/components/Widgets/Settings";
import TrackOptions from "@/components/Widgets/TrackOptions.vue";
import TagEditor from "@/components/Widgets/TagEditor.vue";
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
export default {
	data() {
		return {
			selectedTrack: null,
		};
	},
	components: {
		TitleArea,
		TabSwitcher,
		SidePane,
		PlaylistWidget,
		Settings,
		TrackOptions,
		TagEditor,
	},
	methods: {
		setTagEditorTrack(track) {
			this.selectedTrack = track;
		},
	},
	computed: {
		...mapState(["UIcontroller"]),
	},
	mounted() {
		document.querySelector(".LocalMusic").addEventListener("drop", (event) => {
			event.preventDefault();
			event.stopPropagation();
			const filePaths = Array.from(event.dataTransfer.files).map(
				(file) => file.path
			);
			console.log("Dropped ", filePaths[0]);
			ipcRenderer.send("processDroppedFiles", filePaths);
		});
		document.querySelector(".LocalMusic").addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	},
};
</script>
<style lang="scss">
.playingPaneLoaded {
	.LocalMusic {
		main {
			#centralArea_tabs {
				height: 76.5vh;
			}
		}
	}
}
.LocalMusic {
	main {
		display: flex;
		#centralArea_tabs {
			min-width: 60vw;
			max-width: 70vw;
			width: 60vw;
			margin-right: 10px;
			padding: 10px;
			border-radius: 20px;
			margin-top: 10px;
			background: rgba(255, 255, 255, 0.083);
		}
	}
}
@media (max-width: 900px) {
	.SidePane {
		display: none;
	}
	.LocalMusic {
		#centralArea_tabs {
			width: 87vw !important;
			max-width: 87vw !important;
		}
	}
}
</style>
