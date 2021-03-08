<template>
	<div class="Settings">
		<h1 id="SettingsTitle">Settings</h1>
		<p class="modalClose" @click="UIcontrollerToggleProperty('showSettings')">
			<img src="@/assets/images/x.svg" alt="" />
		</p>
		<main>
			<section>
				<h3>Library</h3>
				<article>
					<div
						v-for="folder in settings.foldersToScan"
						:key="folder"
						class="folderBox"
					>
						<div>
							<p>{{ folder.replace(/(.*)[\/\\]/, "") }}</p>
							<p style="font-family:roboto-thin;font-size:0.9rem">
								{{ folder }}
							</p>
						</div>
						<button
							@click="removeFromScannedFolders(folder)"
							title="Remove folder"
							class="iconBt dangerBt"
						>
							<img style="width:15px" src="@/assets/images/x.svg" alt="" />
						</button>
					</div>
					<button class="bt_active" @click="addFolder">
						<h2>Add Folder</h2>
					</button>
				</article>
				<article>
					<div
						@click="updateSetting(['includeVideo', !settings.includeVideo])"
						class="switch"
					>
						<p>Include Videos (experimental)</p>
						<p v-if="settings.includeVideo">On</p>
						<p v-if="!settings.includeVideo">Off</p>
					</div>
				</article>
				<article>
					<div class="settingBox">
						<h4>Default Tab</h4>
						<ul>
							<p
								@click="updateSetting(['defaultTab', 'Tracks'])"
								:class="[
									settings.defaultTab == 'Tracks' ? 'activeSetting' : '',
								]"
							>
								Tracks
							</p>
							<p
								@click="updateSetting(['defaultTab', 'Artists'])"
								:class="[
									settings.defaultTab == 'Artists' ? 'activeSetting' : '',
								]"
							>
								Artists
							</p>
							<p
								@click="updateSetting(['defaultTab', 'Albums'])"
								:class="[
									settings.defaultTab == 'Albums' ? 'activeSetting' : '',
								]"
							>
								Albums
							</p>
							<p
								@click="updateSetting(['defaultTab', 'Folders'])"
								:class="[
									settings.defaultTab == 'Folders' ? 'activeSetting' : '',
								]"
							>
								Folders
							</p>
							<p
								@click="updateSetting(['defaultTab', 'Playlists'])"
								:class="[
									settings.defaultTab == 'Playlists' ? 'activeSetting' : '',
								]"
							>
								Playlists
							</p>
						</ul>
					</div>
				</article>
				<article>
					<button @click="clearLibrary" class="dangerBt">
						<h2>Clear Library</h2>
					</button>
				</article>
			</section>
			<section>
				<h3>Look and Feel</h3>
				<article>
					<h4>Theme {{ settings.theme }}</h4>
					<ul>
						<p
							@click="updateSetting(['theme', 'fancy'])"
							:class="[settings.theme == 'fancy' ? 'activeSetting' : '']"
						>
							Fancy
						</p>
						<p
							@click="updateSetting(['theme', 'dark'])"
							:class="[settings.theme == 'dark' ? 'activeSetting' : '']"
						>
							Dark
						</p>
						<!-- <p
							@click="updateSetting(['theme', 'light'])"
							:class="[settings.theme == 'light' ? 'activeSetting' : '']"
						>
							Light
						</p> -->
					</ul>
				</article>
				<article>
					<h4>Accent Color</h4>
					<ul>
						<p
							@click="updateSetting(['accentColor', 'accent_blue'])"
							:class="[
								settings.accentColor == 'accent_blue' ? 'activeSetting' : '',
							]"
						>
							Blue
						</p>
						<p
							@click="updateSetting(['accentColor', 'accent_orange'])"
							:class="[
								settings.accentColor == 'accent_orange' ? 'activeSetting' : '',
							]"
						>
							Orange
						</p>
						<p
							@click="updateSetting(['accentColor', 'accent_purple'])"
							:class="[
								settings.accentColor == 'accent_purple' ? 'activeSetting' : '',
							]"
						>
							Purple
						</p>
						<p
							@click="updateSetting(['accentColor', 'accent_magenta'])"
							:class="[
								settings.accentColor == 'accent_magenta' ? 'activeSetting' : '',
							]"
						>
							Magenta
						</p>
						<p
							@click="updateSetting(['accentColor', 'accent_white'])"
							:class="[
								settings.accentColor == 'accent_white' ? 'activeSetting' : '',
							]"
						>
							White
						</p>
					</ul>
				</article>
				<article>
					<div
						@click="
							updateSetting([
								'desktopNotifications',
								!settings.desktopNotifications,
							])
						"
						class="switch"
					>
						<p>Desktop Notifications</p>
						<p v-if="settings.desktopNotifications">On</p>
						<p v-if="!settings.desktopNotifications">Off</p>
					</div>
				</article>
			</section>
			<section style="border:none">
				<article>
					<h3>Shortcuts</h3>
					<div class="shortcut">
						<p>Pause/Play</p>
						<pre>Space</pre>
					</div>
					<div class="shortcut">
						<p>Next Track</p>
						<pre>Right Arrow</pre>
					</div>
					<div class="shortcut">
						<p>Previous Track</p>
						<pre>Left Arrow</pre>
					</div>
					<div class="shortcut">
						<p>Volume</p>
						<pre>Up / Down Arrow</pre>
					</div>
					<div class="shortcut">
						<p>Search Tracks</p>
						<pre>Tab</pre>
					</div>
					<div class="shortcut">
						<p>Reload App</p>
						<pre>Ctrl + R</pre>
					</div>
				</article>
				<article>
					<h3>About</h3>
					<div class="infos">
						<div class="info-group">
							<div class="it">App Version</div>
							<div class="i">{{ appVersion }}</div>
						</div>
						<div class="info-group">
							<div class="it">Made with 🤍 By</div>
							<div class="i">Patrick Waweru</div>
						</div>
						<div class="info-group">
							<div class="it">Follow Me on Twitter 🐦</div>
							<a target="_blank" href="https://twitter.com/PnTX10" class="i"
								>@PnTX10</a
							>
						</div>
						<div class="info-group">
							<div class="it">Email Me 📬</div>
							<a target="_blank" href="https://mail.google.com" class="i"
								>pntx200@gmail.com</a
							>
						</div>
						<div class="info-group">
							<div class="it">
								🦧 Don't be shy, go ahead and contact me. Am bored🤭
							</div>
						</div>
					</div>
				</article>
			</section>
		</main>
	</div>
</template>

<script>
import { sendMessageToNode } from "@/Utils/frontEndUtils";
import { mapMutations, mapState } from "vuex";
import { ipcRenderer } from "electron";
export default {
	data() {
		return {
			appVersion: "0.0.1",
		};
	},
	computed: {
		...mapState(["scannedFolders", "settings"]),
	},
	methods: {
		...mapMutations(["updateSetting", "UIcontrollerToggleProperty"]),
		addFolder() {
			sendMessageToNode("addScanFolder", "");
			setTimeout(() => {
				sendMessageToNode("refresh", "");
				document.querySelector("#refreshLib").classList.add("rotateOut");
				setTimeout(() => {
					document.querySelector("#refreshLib").classList.remove("rotateOut");
				}, 4000);
			}, 100000);
		},
		removeFromScannedFolders(path) {
			sendMessageToNode("removeFromScannedFolders", path);
		},
		clearLibrary() {
			sendMessageToNode("resetApp");
		},
	},
	mounted() {
		ipcRenderer.send("requestVersion");
		ipcRenderer.on("appVersion", (e, version) => {
			this.appVersion = version;
		});
	},
};
</script>

<style lang="scss">
.Settings {
	position: fixed;
	background-color: rgba(0, 0, 0, 0.301);
	backdrop-filter: blur(10px);
	overflow: hidden;
	top: 0px;
	right: 0px;
	height: 100%;
	z-index: 50;
	#SettingsTitle {
		margin: 10px;
	}
	main {
		display: grid !important;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 10px;
		width: 100%;
		section {
			border-right: 1px solid white;
			height: 90vh;
			h3 {
				margin-bottom: 10px;
			}
			article {
				margin: 10px;
				margin-bottom: 20px;
				background: rgba(255, 255, 255, 0.062);
				padding: 10px;
				border-radius: 10px;
				h4 {
					text-align: center;
					margin-bottom: 10px;
				}
				.folderBox {
					background: rgba(255, 255, 255, 0.096);
					padding: 10px;
					margin-bottom: 10px;
					border-radius: 20px;
					display: flex;
					justify-content: space-between;
					button {
						margin-top: 0px;
					}
				}
				ul {
					p {
						background: rgba(255, 255, 255, 0.096);
						margin-bottom: 1px;
						padding: 5px;
						font-family: roboto-light;
						cursor: pointer;
					}
					p:hover {
						border-radius: 5px;
						padding-left: 10px;
						margin: 5px;
					}
					.activeSetting {
						padding-left: 10px;
						border-radius: 5px;
						margin: 5px;
						background: var(--accentColor) !important;
					}
				}
			}
		}
	}
	h1 {
		text-align: center;
	}
	h3 {
		margin-top: 10px;
		text-align: center;
	}
	.setting {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 20px;
		padding: 5px;
		padding-left: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.192);
		border-radius: 0px;
		cursor: pointer;
		p {
			font-family: roboto-light;
			margin-right: 5px;
		}
	}
	.setting:hover {
		background-color: #ffffff1e;
		border-radius: 20px;
		margin: 5px;
	}
	.shortcut {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.192);
		padding-bottom: 5px;
		font-family: roboto-light;
		pre {
			background: rgb(0, 0, 0);
			padding: 5px;
			border-radius: 8px;
		}
	}
	.info-group {
		padding-bottom: 5px;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 10px;
		font-size: 1.2em;
		border-bottom: 1px solid rgba(255, 255, 255, 0.39);
		.it {
			font-family: roboto-light;
			font-weight: 300;
			font-size: 0.9em;
		}
		.i {
			font-size: 0.8em;
			font-family: roboto-thin;
			font-weight: 300;
		}
	}
}
</style>
