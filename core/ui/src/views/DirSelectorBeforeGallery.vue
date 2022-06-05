<template>
  <div class="h-full w-full flex flex-col">
    <div class="container mx-auto py-8 px-2 flex-1">
      <h1 class="text-xl pb-2">閲覧したいフォルダを選んで下さい</h1>
      <dir-selector v-if="album" :album="album" @dir-selected="onSelected" />
    </div>
    <div class="flex flex-row justify-between">
      <div class="w-48 flex flex-row">
        <router-link
          :to="mainMenuRoute"
          class="flex flex-row items-center p-2 bg-white bg-opacity-0 hover:bg-opacity-100"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span>戻る</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAlbumDataWithUrlId } from '@/compositions/Album';
import { ChevronLeftIcon } from '@/components/icons/HeroIcons';
import { DirInAlbumSelector } from '@/components/DirInAlbumSelector';

export default defineComponent({
  components: {
    'dir-selector': DirInAlbumSelector,
    ChevronLeftIcon,
  },
  setup() {
    const router = useRouter();

    const { album, id: albumId } = useAlbumDataWithUrlId();

    const onSelected = (id: number) => {
      if (albumId.value === undefined) {
        return;
      }
      router.push({ name: 'gallery', params: { albumId: albumId.value, dirId: id.toFixed(0) } });
    };

    const mainMenuRoute = computed(() => ({ name: 'main-menu', params: { albumId: albumId.value } }));

    return {
      album,
      onSelected,
      mainMenuRoute,
    };
  },
});
</script>
