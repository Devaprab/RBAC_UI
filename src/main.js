import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router.js';
import store from './store/index.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";

loadFonts()

const app = createApp(App)
  app.use(vuetify);
  app.use(router);
  app.use(store);
  router.isReady().then(function() {
    app.mount('#app');
  })