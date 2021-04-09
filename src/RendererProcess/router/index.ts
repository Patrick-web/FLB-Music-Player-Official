import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LocalMusic from "../views/LocalMusic/LocalMusic.vue";
import FLBing from '../views/FLBing.vue'
import Deezer from "../views/Deezer.vue";
import Spotify from "../views/Spotify.vue";
import HomeTab from "../views/LocalMusic/Tabs/HomeTab.vue";
import TracksTab from "../views/LocalMusic/Tabs/TracksTab.vue";
import RecentsTab from "../views/LocalMusic/Tabs/RecentsTab.vue";
import ArtistsTab from "../views/LocalMusic/Tabs/ArtistsTab.vue";
import AlbumsTab from "../views/LocalMusic/Tabs/AlbumsTab.vue";
import FoldersTab from "../views/LocalMusic/Tabs/FoldersTab.vue";
import PlaylistsTab from "../views/LocalMusic/Tabs/PlaylistsTab.vue";

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
	{
		path: "/flbing",
		component: FLBing,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
