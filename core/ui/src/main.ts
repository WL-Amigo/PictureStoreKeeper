import Vue from 'vue';
import './main.css';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import VueCompositionApi from '@vue/composition-api';
import { AlbumAPIService } from './services/AlbumAPIService';
import { DirectoryAPIService } from './services/DirectoryAPIService';
import { MoveAPIService } from './services/MoveAPIService';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

// initialize services
const Host = process.env.VUE_APP_API_HOST || window.location.origin;
const AlbumAPIServiceInst = new AlbumAPIService(Host);
const DirectoryAPIServiceInst = new DirectoryAPIService(Host);
const MoveAPIServiceInst = new MoveAPIService(Host);

new Vue({
  router,
  store,
  render: h => h(App),
  provide: {
    AlbumAPIService: AlbumAPIServiceInst,
    DirectoryAPIService: DirectoryAPIServiceInst,
    MoveAPIService: MoveAPIServiceInst,
  },
}).$mount('#app');
