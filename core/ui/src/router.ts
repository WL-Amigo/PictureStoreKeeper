import { createRouter, createWebHashHistory } from 'vue-router';
import AlbumSelector from './views/AlbumSelector.vue';
import MainMenu from './views/MainMenu.vue';
import AlbumSettings from './views/AlbumSettings.vue';
import { PictureArrangerPage } from './views/PictureArranger';
import DirSelectorBeforeArrange from './views/DirSelectorBeforeArrange.vue';
import DirSelectorBeforeGallery from './views/DirSelectorBeforeGallery.vue';
import Gallery from './views/Gallery.vue';

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
      component: PictureArrangerPage,
    },
    {
      path: '/album/:albumId/gallery/',
      name: 'directory-selector-before-gallery',
      component: DirSelectorBeforeGallery,
    },
    {
      path: '/album/:albumId/gallery/:dirId',
      name: 'gallery',
      component: Gallery,
    },
  ],
});
