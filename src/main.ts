import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import { ipcRenderer } from 'electron';

import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import './assets/index.scss';

createApp(App).use(store, key).use(router).mount('#app');

const vuexData = localStorage.getItem('vuex') as string;
if (vuexData) {
  store.replaceState(Object.assign({}, store.state, JSON.parse(vuexData)));
}

ipcRenderer.on('before-quit', () => {
  localStorage.setItem('vuex', JSON.stringify(store.state));
});

window.addEventListener('pagehide', () => {
  localStorage.setItem('vuex', JSON.stringify(store.state));
})
