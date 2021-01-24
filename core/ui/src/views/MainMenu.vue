<template>
  <div class="container mx-auto py-8 px-2">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <menu-link :to="{ name: 'directory-selector-before-arrange', params: { id: id } }">
        <folder class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">画像を整理する</span>
      </menu-link>
      <menu-link :to="{ name: 'album-settings', params: { id: id } }">
        <settings class="w-24 h-24 text-primary-800 m-4" />
        <span class="text-xl">設定</span>
      </menu-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from '@vue/composition-api';
import { Album } from '../models/Album';
import FolderIcon from '@/components/icons/TablerIcons/Folder.vue';
import SettingsIcon from '@/components/icons/TablerIcons/Settings.vue';
import MainMenuLink from './partials/MainMenu/MainMenuLink.vue';

export default defineComponent({
  components: {
    'menu-link': MainMenuLink,
    folder: FolderIcon,
    settings: SettingsIcon,
  },
  setup() {
    const vm = getCurrentInstance();
    const id = computed(() => (vm !== null ? vm.proxy.$route.params['id'] : '(unknown)'));

    return {
      id,
    };
  },
});
</script>
