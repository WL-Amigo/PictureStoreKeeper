<template>
  <div class="container mx-auto py-8 px-2 h-auto lg:h-screen lg:flex lg:flex-col lg:justify-center">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2" v-if="id !== undefined">
      <MenuLink :to="{ name: 'directory-selector-before-arrange', params: { albumId: id } }">
        <Folder class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">画像を整理する</span>
      </MenuLink>
      <MenuLink :to="{ name: 'album-settings', params: { albumId: id } }">
        <Settings class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">設定</span>
      </MenuLink>
      <MenuLink :to="{ name: 'directory-selector-before-gallery', params: { albumId: id } }">
        <Photo class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">ギャラリー</span>
      </MenuLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Folder from '@/components/icons/TablerIcons/Folder.vue';
import Settings from '@/components/icons/TablerIcons/Settings.vue';
import MenuLink from './partials/MainMenu/MainMenuLink.vue';
import { useAlbumIdFromUrl } from '@/compositions/Album';
import Photo from '@/components/icons/TablerIcons/Photo.vue';

export default defineComponent({
  components: {
    MenuLink,
    Folder,
    Settings,
    Photo,
  },
  setup() {
    const id = useAlbumIdFromUrl();

    return {
      id,
    };
  },
});
</script>
