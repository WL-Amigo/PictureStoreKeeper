<template>
  <div class="w-full h-screen flex flex-col">
    <div class="grid grid-cols-5 grid-rows-4 gap-2 container mx-auto flex-1 overflow-hidden py-2">
      <img
        v-for="src in displayImgSrcs"
        :key="src.index"
        :src="src.imgSrc"
        width="128"
        height="128"
        class="object-contain object-center w-full h-full cursor-pointer"
        @click="viewingImageFileIndex = src.index"
      />
    </div>
    <div class="flex flex-row justify-between bg-white bg-opacity-50">
      <div class="w-48">
        <button @click="onBack" class="flex flex-row items-center p-2 bg-white bg-opacity-0 hover:bg-opacity-100">
          <ChevronLeft class="w-6 h-6" />
          <span>戻る</span>
        </button>
      </div>
      <div class="flex flex-row justify-center space-x-2">
        <button
          @click="goPrev"
          :disabled="!canGoPrev"
          class="flex flex-row items-center p-2 bg-white bg-opacity-0 hover:bg-opacity-100"
        >
          <ArrowLeftSmall class="w-5 h-5" />
        </button>
        <button
          @click="goNext"
          :disabled="!canGoNext"
          class="flex flex-row items-center p-2 bg-white bg-opacity-0 hover:bg-opacity-100"
        >
          <ArrowRightSmall class="w-5 h-5" />
        </button>
      </div>
      <div class="w-48 flex flex-row justify-end">
        <button
          @click="randomOpenImage"
          class="flex flex-row items-center p-2 bg-white bg-opacity-0 hover:bg-opacity-100"
        >
          <Dice3 class="w-6 h-6" />
          <span>ランダムで開く</span>
        </button>
      </div>
    </div>
  </div>
  <template v-if="albumId !== undefined && dirId !== undefined">
    <SingleImageView
      :current-img-file-name="viewingImageFileName"
      :album-id="albumId"
      :dir-id="dirId"
      :can-go-next="true"
      :can-go-prev="true"
      @close="onCloseImageView"
      @next="onImageViewNext"
      @prev="onImageViewPrev"
    />
  </template>
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
import SingleImageView from './partials/Gallery/SingleImageView.vue';

interface FileNameWithIndex {
  fileName: string;
  index: number;
}

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

    const imgSrcs = ref<FileNameWithIndex[]>([]);
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
        .map((src) => ({
          ...src,
          imgSrc: directoryService.toThumbNailURL(albumIdValue, dirIdValue, src.fileName),
        }));
    });

    onMounted(async () => {
      const albumIdValue = albumId.value;
      const dirIdValue = dirId.value;

      if (albumIdValue === undefined || dirIdValue === undefined) {
        return;
      }

      imgSrcs.value = (await directoryService.getAllFiles(albumIdValue, dirIdValue)).map((fn, i) => ({
        index: i,
        fileName: fn,
      }));
    });

    const onBack = () => {
      const albumIdValue = albumId.value;
      if (albumIdValue === undefined) {
        return;
      }

      router.push({ name: 'directory-selector-before-gallery', params: { albumId: albumIdValue } });
    };

    const viewingImageFileIndex = ref(-1);
    const viewingImageFileName = computed(() => imgSrcs.value[viewingImageFileIndex.value]?.fileName ?? '');
    const onCloseImageView = () => (viewingImageFileIndex.value = -1);
    const onImageViewNext = () => {
      let nextIndex = viewingImageFileIndex.value + 1;
      if (nextIndex >= imgSrcs.value.length) {
        nextIndex = 0;
      }
      viewingImageFileIndex.value = nextIndex;
    };
    const onImageViewPrev = () => {
      let nextIndex = viewingImageFileIndex.value - 1;
      if (nextIndex < 0) {
        nextIndex = imgSrcs.value.length - 1;
      }
      viewingImageFileIndex.value = nextIndex;
    };

    const randomOpenImage = () => (viewingImageFileIndex.value = Math.round(Math.random() * imgSrcs.value.length));

    return {
      displayImgSrcs,
      page,
      maxPage,
      goNext,
      goPrev,
      canGoNext,
      canGoPrev,
      onBack,
      albumId,
      dirId,
      viewingImageFileIndex,
      viewingImageFileName,
      onCloseImageView,
      onImageViewNext,
      onImageViewPrev,
      randomOpenImage,
    };
  },
  components: {
    ChevronLeft,
    ArrowLeftSmall,
    ArrowRightSmall,
    Dice3,
    SingleImageView,
  },
});
</script>
