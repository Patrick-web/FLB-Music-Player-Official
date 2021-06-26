import Vue from "vue";
import App from "./App.vue";
import router from "./RendererProcess/router";
import store from "./RendererProcess/store";
import VueVirtualScroller from 'vue-virtual-scroller'

Vue.use(VueVirtualScroller)

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
