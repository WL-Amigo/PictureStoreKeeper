import Vue from 'vue'
import Router from 'vue-router'
import AlbumSelector from './views/AlbumSelector.vue'
import MainMenu from './views/MainMenu.vue'
import AlbumSettings from './views/AlbumSettings.vue'
import PictureArranger from './views/PictureArranger.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'album-selector',
      component: AlbumSelector
    },
    {
      path: '/album/:id',
      name: 'main-menu',
      component: MainMenu
    },
    {
      path: '/album/:id/settings',
      name: 'album-settings',
      component: AlbumSettings
    },
    {
      path: '/album/:id/arrange',
      name: 'arrange',
      component: PictureArranger
    }
  ]
})
