<template>
	<div class="Tabswitcher">
		<p
			:class="[currentTab === 'Tracks' ? 'activeTab' : '']"
			@click="routeTo($event, 'Tracks')"
			id="Tracks"
		>
			<router-link to="/">Tracks</router-link>
		</p>
		<p
			:class="[currentTab === 'Playlists' ? 'activeTab' : '']"
			@click="routeTo($event, 'Playlists')"
			id="Playlists"
		>
			<router-link to="/playlists">Playlists</router-link>
		</p>
		<p
			:class="[currentTab === 'Recents' ? 'activeTab' : '']"
			@click="routeTo($event, 'Recents')"
			id="Recents"
		>
			<router-link to="/recents">Recents</router-link>
		</p>
		<p
			:class="[currentTab === 'Albums' ? 'activeTab' : '']"
			@click="routeTo($event, 'Albums')"
			id="Albums"
		>
			<router-link to="/albums">Albums</router-link>
		</p>
		<p
			:class="[currentTab === 'Artists' ? 'activeTab' : '']"
			@click="routeTo($event, 'Artists')"
			id="Artists"
		>
			<router-link to="/artists">Artists</router-link>
		</p>
		<p
			:class="[currentTab === 'Folders' ? 'activeTab' : '']"
			@click="routeTo($event, 'Folders')"
			id="Folders"
		>
			<router-link to="/folders">Folders</router-link>
		</p>
	</div>
</template>

<script lang="js">
import { mapMutations, mapState } from "vuex";
export default {
  name: "TabSwitcher",
  computed: {
    ...mapState(["currentTab"]),
  },
  methods: {
    ...mapMutations(["switchTab", "deSelectGroup","clearSelectedTracks"]),
    routeTo(e,tab) {
      this.switchTab(tab);
      this.deSelectGroup();
      e.currentTarget.querySelector('a').click()
	this.clearSelectedTracks();
	document.querySelector("#centralArea_tabs").classList.remove("multiSelectMode");
    },
  },
};
</script>

<style lang="scss">
.traditionalLayout {
	.Tabswitcher {
		width: 60%;
		margin: auto;
		.indicator {
			width: 100px;
		}
	}
}
.Tabswitcher {
	display: flex;
	justify-content: center;
	position: relative;
	overflow: hidden;
	z-index: 10;
	padding: 10px;
	p {
		background: rgba(255, 255, 255, 0.083);
		margin-right: 5px;
		margin-left: 5px;
		text-align: center;
		position: relative;
		z-index: 2;
		padding: 5px;
		padding-top: 7px;
		color: white;
		border-radius: 20px;
		min-width: 100px;
		cursor: pointer;
		transition: 0.2s ease;
		font-family: roboto-light;
		font-size: 1rem;
		border-bottom: 3px solid rgba(0, 132, 255, 0);
	}
	p:hover {
		background: rgba(255, 255, 255, 0.144);
	}
	.activeTab {
		background: var(--accentColor);
		font-family: roboto;
	}
	.activeTab:hover {
		background: var(--accentColor);
	}
}
// @media (max-width: 700px) {
//   .Tabswitcher {
//     display: none;
//   }
// }
</style>
