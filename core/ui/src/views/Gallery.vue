<template>
  <div class="w-full h-screen flex flex-col">
    <div class="grid grid-cols-5 grid-rows-4 gap-2 container mx-auto flex-1 overflow-hidden">
      <img
        v-for="src in displayImgSrcs"
        :key="src"
        :src="src"
        width="128"
        height="128"
        class="object-contain object-center w-full h-full"
      />
    </div>
    <div class="flex flex-row justify-between p-2">
      <div class="w-48">
        <button @click="onBack" class="flex flex-row items-center">
          <ChevronLeft class="w-6 h-6" />
          <span>戻る</span>
        </button>
      </div>
      <div class="flex flex-row justify-center space-x-2">
        <button @click="goPrev" :disabled="!canGoPrev" class="flex flex-row items-center">
          <ArrowLeftSmall class="w-5 h-5" />
        </button>
        <button @click="goNext" :disabled="!canGoNext" class="flex flex-row items-center">
          <ArrowRightSmall class="w-5 h-5" />
        </button>
      </div>
      <div class="w-48 flex flex-row justify-end">
        <button class="flex flex-row items-center">
          <Dice3 class="w-6 h-6" />
          <span>ランダム選択</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAlbumDataWithUrlId } from '@/compositions/Album';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { usePager } from '@/compositions/Page';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChevronLeft from '@/components/icons/HeroIcons/ChevronLeft.vue';
import ArrowLeftSmall from '@/components/icons/HeroIcons/ArrowLeftSmall.vue';
import ArrowRightSmall from '@/components/icons/HeroIcons/ArrowRightSmall.vue';
import Dice3 from '@/components/icons/Boxicons/Dice3.vue';

export default defineComponent({
  props: {},
  setup() {
    const route = useRoute();
    const router = useRouter();
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);

    const { id: albumId } = useAlbumDataWithUrlId();
    const dirId = computed(() => {
      const value = route.params['dirId'];
      const dirIdInt = typeof value === 'string' ? parseInt(value) : NaN;
      return !isNaN(dirIdInt) ? dirIdInt : undefined;
    });

    const imgSrcs = ref<string[]>([]);
    const { page, maxPage, goNext, goPrev, canGoNext, canGoPrev } = usePager(
      ref(20),
      computed(() => imgSrcs.value.length),
    );
    const displayImgSrcs = computed(() => {
      const albumIdValue = albumId.value;
      const dirIdValue = dirId.value;
      const pageValue = page.value;
      const originalImgSrcs = imgSrcs.value;
      const imgsPerPage = 20;

      if (albumIdValue === undefined || dirIdValue === undefined) {
        return [];
      }

      return originalImgSrcs
        .slice(imgsPerPage * pageValue, Math.min(originalImgSrcs.length, imgsPerPage * (pageValue + 1)))
        .map((src) => directoryService.toThumbNailURL(albumIdValue, dirIdValue, src));
    });

    onMounted(async () => {
      const albumIdValue = albumId.value;
      const dirIdValue = dirId.value;

      if (albumIdValue === undefined || dirIdValue === undefined) {
        return;
      }

      imgSrcs.value = await directoryService.getAllFiles(albumIdValue, dirIdValue);
    });

    const onBack = () => {
      const albumIdValue = albumId.value;
      if (albumIdValue === undefined) {
        return;
      }

      router.push({ name: 'directory-selector-before-gallery', params: { albumId: albumIdValue } });
    };

    return {
      displayImgSrcs,
      page,
      maxPage,
      goNext,
      goPrev,
      canGoNext,
      canGoPrev,
      onBack,
    };
  },
  components: {
    ChevronLeft,
    ArrowLeftSmall,
    ArrowRightSmall,
    Dice3,
  },
});
</script>
