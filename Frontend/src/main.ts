import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import { AlbumAPIService } from './services/AlbumAPIService';
import { DirectoryAPIService } from './services/DirectoryAPIService';
import { MoveAPIService } from './services/MoveAPIService';

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

// initialize services
const Host = 'http://localhost:1323/';
const AlbumAPIServiceInst = new AlbumAPIService(Host);
const DirectoryAPIServiceInst = new DirectoryAPIService(Host);
const MoveAPIServiceInst = new MoveAPIService(Host);

new Vue({
  router,
  store,
  render: h => h(App),
  provide: {
    "AlbumAPIService": AlbumAPIServiceInst,
    "DirectoryAPIService": DirectoryAPIServiceInst,
    "MoveAPIService": MoveAPIServiceInst,
  }
}).$mount('#app');
