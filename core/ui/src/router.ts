import { createRouter, createWebHashHistory } from 'vue-router';
import AlbumSelector from './views/AlbumSelector.vue';
import MainMenu from './views/MainMenu.vue';
import AlbumSettings from './views/AlbumSettings.vue';
import PictureArranger from './views/PictureArranger.vue';
import DirSelectorBeforeArrange from './views/DirSelectorBeforeArrange.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'album-selector',
      component: AlbumSelector,
    },
    {
      path: '/album/:albumId',
      name: 'main-menu',
      component: MainMenu,
    },
    {
      path: '/album/:albumId/settings',
      name: 'album-settings',
      component: AlbumSettings,
    },
    {
      path: '/album/:albumId/arrange/',
      name: 'directory-selector-before-arrange',
      component: DirSelectorBeforeArrange,
    },
    {
      path: '/album/:albumId/arrange/:dirId',
      name: 'arrange',
      component: PictureArranger,
    },
  ],
});
