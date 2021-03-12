<template>
	<div class="sideNav" :class="[isCollapsed ? 'collapsed' : '', 'sideNav']">
		<div>
			<div
				style="width:30px;padding:5px"
				@click="toggleSideNavEpansion"
				class="sideNav-group"
				id="menuIcon"
			>
				<img src="@/assets/images/menu.svg" alt />
			</div>
			<div
				class="sideNav-group active-sideNav-group"
				@click="switchTo($event, 'localMusic')"
			>
				<router-link to="/">
					<img title="My Music" src="@/assets/images/music.svg" alt />
					<p v-if="!isCollapsed">My Music</p>
				</router-link>
			</div>
			<div class="sideNav-group" @click="switchTo($event, 'deezer')">
				<router-link to="/deezer">
					<img
						title="Deezer"
						class="whiten"
						src="@/assets/images/deezer.svg"
						alt
					/>
					<p v-if="!isCollapsed">Deezer</p>
				</router-link>
			</div>
			<div class="sideNav-group">
				<a>
					<span v-if="!isCollapsed">Coming Soon</span>
					<img
						title="Podcasts"
						class="whiten"
						src="@/assets/images/podcasts.svg"
						alt
					/>
					<p v-if="!isCollapsed">Podcasts</p>
				</a>
			</div>
		</div>
		<div>
			<div
				@click="UIcontrollerToggleProperty('showSettings')"
				class="sideNav-group"
			>
				<a>
					<img
						title="Settings"
						class="whiten"
						src="@/assets/images/settings.svg"
						alt
					/>
					<p v-if="!isCollapsed">Settings</p>
				</a>
			</div>
			<div @click="refresh" class="sideNav-group">
				<a>
					<img
						title="Refresh"
						src="@/assets/images/refresh.svg"
						alt
						id="refreshLib"
						class="animated infinite"
					/>
					<p v-if="!isCollapsed">Refresh</p>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	import { sendMessageToNode } from "@/Utils/frontEndUtils";
	import { mapGetters, mapMutations } from "vuex";
	// import Importer from "./Importer.vue";
	export default {
		name: "SideNav",
		data() {
			return {
				isCollapsed: false,
			};
		},
		computed: {
			...mapGetters(["UIcontroller"]),
		},
		methods: {
			...mapMutations([
				"loadPreviouslyAddedTracks",
				"UIcontrollerToggleProperty",
			]),
			switchTo(e, target) {
				document
					.querySelector(".active-sideNav-group")
					.classList.remove("active-sideNav-group");
				e.currentTarget.classList.add("active-sideNav-group");
				console.log(target);
			},
			toggleSideNavEpansion() {
				this.isCollapsed = !this.isCollapsed;
				if (this.isCollapsed) {
					document.querySelector("#centralArea_tabs").style.width = "70vw";
				} else {
					document.querySelector("#centralArea_tabs").style.width = "61.5vw";
				}
			},
			refresh() {
				document.querySelector("#refreshLib").classList.add("rotateOut");
				setTimeout(() => {
					document.querySelector("#refreshLib").classList.remove("rotateOut");
				}, 4000);
				sendMessageToNode("refresh", "");
			},
		},
	};
</script>

<style lang="scss">
	.playingPaneLoaded {
		.sideNav {
			height: 78.5vh;
		}
	}
	.collapsed {
		min-width: 50px !important;
		width: 60px !important;
		#menuIcon {
			transform: translateX(5px);
		}
	}
	.sideNav {
		background: rgba(255, 255, 255, 0.083);
		height: 93vh;
		padding-bottom: 5px;
		min-width: 180px;
		width: 180px;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-right: 10px;
		margin-left: 10px;
		margin-top: 10px;
		overflow: hidden;
		.sideNav-group {
			border-radius: 15px;
			margin: 5px;
			// border-radius: 10px;
			a {
				padding: 10px;
				display: grid;
				grid-template-columns: 1fr 3fr;
				align-items: center;
				justify-content: center;
				border-left: 0px solid var(--accentColor);
				position: relative;
			}
			p {
				text-align: left;
				font-size: 1rem;
			}
			span {
				position: absolute;
				right: 0px;
				top: 0px;
				font-size: 0.6rem;
				background: var(--accentColor);
				padding: 2px 5px 2px 5px;
				border-radius: 10px;
			}
		}
		.sideNav-group:hover {
			cursor: pointer;
			background: rgba(255, 255, 255, 0.144);
		}
		.active-sideNav-group {
			background: var(--accentColor);
		}
		.active-sideNav-group:hover {
			background: var(--accentColor);
		}
		img {
			width: 30px;
		}
		.activeFeatureIndicator {
			position: absolute;
			top: 12.5%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: 0.2s ease-in-out;
			background: var(--accentColor);
			border-radius: 50%;
			width: 40px;
			height: 40px;
		}
		.tabActive {
			.v-tooltip {
				display: none;
			}
			filter: hue-rotate(280deg);
		}
	}
	@media (max-width: 900px) {
		.sideNav {
			min-width: 60px;
			width: 60px;
			.sideNav-group {
				p {
					display: none;
				}
				span {
					display: none;
				}
			}
		}
	}
</style>
