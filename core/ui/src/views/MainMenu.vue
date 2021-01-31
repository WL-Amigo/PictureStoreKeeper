<template>
  <div class="container mx-auto py-8 px-2 h-auto lg:h-screen lg:flex lg:flex-col lg:justify-center">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <menu-link :to="{ name: 'directory-selector-before-arrange', params: { albumId: id } }">
        <folder class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">画像を整理する</span>
      </menu-link>
      <menu-link :to="{ name: 'album-settings', params: { albumId: id } }">
        <settings class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">設定</span>
      </menu-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FolderIcon from '@/components/icons/TablerIcons/Folder.vue';
import SettingsIcon from '@/components/icons/TablerIcons/Settings.vue';
import MainMenuLink from './partials/MainMenu/MainMenuLink.vue';
import { useAlbumIdFromUrl } from '@/compositions/Album';

export default defineComponent({
  components: {
    'menu-link': MainMenuLink,
    folder: FolderIcon,
    settings: SettingsIcon,
  },
  setup() {
    const id = useAlbumIdFromUrl();

    return {
      id,
    };
  },
});
</script>
