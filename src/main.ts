import Vue from 'vue';
import { pascalCase } from 'scule';
import vuedraggable from 'vuedraggable';
import VueVirtualScroller from 'vue-virtual-scroller';
import router from './renderer/router';
import store from './renderer/store';
import App from './App.vue';

const views = require.context(`./renderer/views`, true, /\.vue$/i);
const components = require.context(`./renderer/components`, true, /\.vue$/i);
loadComponents(components);
loadComponents(views);

Vue.component('draggable', vuedraggable);
Vue.use(VueVirtualScroller);

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: h => h(App)
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    app.$mount('#app');
  }, 1000);
});

function loadComponents(entities: any) {
  const mapper = (file: string) => {
    const { default: component } = entities(file);
    Vue.component(pascalCase(component.name), component);
  };
  entities.keys().map(mapper);
}
