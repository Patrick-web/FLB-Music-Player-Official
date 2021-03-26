import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LocalMusic from "../views/LocalMusic.vue";
import Deezer from "../views/Deezer.vue";
import Spotify from "../views/Spotify.vue";
import HomeTab from "../views/HomeTab.vue";
import TracksTab from "../views/TracksTab.vue";
import RecentsTab from "../views/RecentsTab.vue";
import ArtistsTab from "../views/ArtistsTab.vue";
import AlbumsTab from "../views/AlbumsTab.vue";
import FoldersTab from "../views/FoldersTab.vue";
import PlaylistsTab from "../views/PlaylistsTab.vue";
// import FLBing from '../views/FLBing.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/",
		component: LocalMusic,
		children: [
			{
				path: "/",
				component: HomeTab,
			},
			{
				path: "/tracks",
				component: TracksTab,
			},
			{
				path: "/recents",
				component: RecentsTab,
			},
			{
				path: "/artists",
				component: ArtistsTab,
			},
			{
				path: "/albums",
				component: AlbumsTab,
			},
			{
				path: "/folders",
				component: FoldersTab,
			},
			{
				path: "/playlists",
				component: PlaylistsTab,
			},
		],
	},
	{
		path: "/deezer",
		component: Deezer,
	},
	{
		path: "/spotify",
		component: Spotify,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
