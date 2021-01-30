<template>
  <div class="container mx-auto py-8 px-2">
    <h1 class="text-xl pb-2">転送元を選んで下さい</h1>
    <dir-selector v-if="album" :album="album" @dir-selected="onSelected" />
  </div>
</template>

<script lang="ts">
import DirectorySelector from '@/components/DirectorySelector.vue';
import { defineComponent } from '@vue/composition-api';
import { useRouter } from '@/compositions/Compat';
import { useAlbumDataWithUrlId } from '@/compositions/Album';

export default defineComponent({
  components: {
    'dir-selector': DirectorySelector,
  },
  setup() {
    const router = useRouter();

    const { album, id: albumId } = useAlbumDataWithUrlId();

    const onSelected = (id: number) => {
      if (albumId.value === undefined) {
        return;
      }
      router?.push({ name: 'arrange', params: { albumId: albumId.value, dirId: id.toFixed(0) } });
    };

    return {
      album,
      onSelected,
    };
  },
});
</script>
