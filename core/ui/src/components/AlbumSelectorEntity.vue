<template>
  <div
    class="w-full px-4 py-2 flex flex-row items-center rounded bg-white hover:bg-gray-200 transition-colors duration-100 cursor-pointer group"
    @click="$emit('selected')"
  >
    <div class="flex-grow flex flex-row items-center">
      <album-icon class="w-20 h-20 mr-4" />
      <span class="text-xl">{{ label }}</span>
    </div>
    <div class="flex flex-row items-center">
      <div class="p-4">
        <arrow-right class="w-8 h-8" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AlbumIcon from './icons/FlaticonCom/Album.vue';
import ArrowRightSmallIcon from './icons/HeroIcons/ArrowRightSmall.vue';

export default defineComponent({
  name: 'AlbumSelectorEntity',
  emits: {
    selected: null,
  },
  components: {
    'album-icon': AlbumIcon,
    'arrow-right': ArrowRightSmallIcon,
  },
  props: {
    label: String,
  },
  setup() {
    return {};
  },
});
</script>
