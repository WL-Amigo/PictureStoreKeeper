<template>
  <div class="container mx-auto py-8 px-2" v-if="idAndLabelPairs !== null">
    <div class="flex flex-col space-y-2">
      <entity v-for="iaap in idAndLabelPairs" :key="iaap.id" :label="iaap.label" @selected="onEntityClicked(iaap.id)" />
    </div>
    <div class="flex flex-row justify-center w-full pt-4">
      <psk-button class="text-xl w-1/2" padding="p-2" variant="primary" @click="isCreateAlbumPromptActive = true">
        <PlusCircleIcon class="mr-2 w-5 h-5" />
        <span>追加する</span>
      </psk-button>
    </div>
    <fade-transition>
      <div
        class="z-modal fixed inset-0 bg-black bg-opacity-50 w-screen h-screen flex flex-row items-center justify-center"
        v-if="isCreateAlbumPromptActive"
        @click="isCreateAlbumPromptActive = false"
      >
        <create-album-prompt @create-album="onCreateAlbumPromptConfirmed" @cancel="isCreateAlbumPromptActive = false" />
      </div>
    </fade-transition>
  </div>
</template>

<script lang="ts">
import { IDAndLabelPair } from '@/models/IDAndLabelPair';
import { PlusCircleIcon } from '@/components/icons/HeroIcons';
import { Button } from '@/components/parts/Button';
import { defineComponent, onMounted, ref } from 'vue';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { useRouter } from 'vue-router';
import { AlbumEntity } from './partials/AlbumSelector/AlbumEntity';
import { CreateAlbumPrompt } from './partials/AlbumSelector/CreateAlbumPrompt';
import { Fade } from '@/components/transitions/Fade';

export default defineComponent({
  components: {
    entity: AlbumEntity,
    PlusCircleIcon,
    'create-album-prompt': CreateAlbumPrompt,
    'fade-transition': Fade,
    'psk-button': Button,
  },
  setup() {
    const albumAPIService = useDependency(ServiceKeys.AlbumAPIService);
    const router = useRouter();

    const idAndLabelPairs = ref<readonly IDAndLabelPair[] | null>(null);
    onMounted(async () => (idAndLabelPairs.value = await albumAPIService.getAllAlbumsAsync()));

    const isCreateAlbumPromptActive = ref(false);
    const onEntityClicked = (id: string) => router.push({ name: 'main-menu', params: { albumId: id } });
    const onCreateAlbumPromptConfirmed = async (label: string) => {
      let result = await albumAPIService.createAlbumAsync(label);
      isCreateAlbumPromptActive.value = false;
      // TODO: 失敗時はトーストを表示する
      if (!result) {
        return;
      }

      idAndLabelPairs.value = await albumAPIService.getAllAlbumsAsync();
    };

    return {
      idAndLabelPairs,
      isCreateAlbumPromptActive,
      onEntityClicked,
      onCreateAlbumPromptConfirmed,
    };
  },
});
</script>
