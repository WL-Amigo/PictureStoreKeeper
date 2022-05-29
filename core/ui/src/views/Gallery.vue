<template>
  <div class="w-full h-screen flex flex-col">
    <div
      class="grid grid-cols-4 grid-rows-5 md:grid-cols-5 md:grid-rows-4 gap-2 container mx-auto flex-1 overflow-hidden py-2"
    >
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
      <div class="w-60">
        <GalleryButton @click="onBack">
          <ChevronLeft class="w-6 h-6" />
          <span>戻る</span>
        </GalleryButton>
      </div>
      <div class="flex flex-row justify-center gap-x-2">
        <GalleryButton @click="goPrev" :disabled="!canGoPrev">
          <ArrowLeftIcon class="w-5 h-5" />
        </GalleryButton>
        <div class="p-2">
          {{ `${page + 1}/${maxPage + 1}` }}
        </div>
        <GalleryButton @click="goNext" :disabled="!canGoNext">
          <ArrowRightIcon class="w-5 h-5" />
        </GalleryButton>
      </div>
      <div class="w-60 flex flex-row justify-end">
        <GalleryButton @click="randomJumpPage">
          <Dice3 class="w-6 h-6" />
          <span class="<md:hidden">ランダムなページへ飛ぶ</span>
        </GalleryButton>
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
      @moveDir="moveDir"
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
import { ArrowRightIcon, ArrowLeftIcon } from '@/components/icons/HeroIcons';
import Dice3 from '@/components/icons/Boxicons/Dice3.vue';
import SingleImageView from './partials/Gallery/SingleImageView.vue';
import GalleryButton from './partials/Gallery/GalleryButton.vue';
import { isNotNullOrUndefined } from '@/utils/Emptiness';

const ImgsPerPage = 20;

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
    const moveService = useDependency(ServiceKeys.MoveAPIService);

    const { id: albumId } = useAlbumDataWithUrlId();
    const dirId = computed(() => {
      const value = route.params['dirId'];
      const dirIdInt = typeof value === 'string' ? parseInt(value) : NaN;
      return !isNaN(dirIdInt) ? dirIdInt : undefined;
    });

    const imgSrcs = ref<FileNameWithIndex[]>([]);
    const { page, maxPage, goNext, goPrev, canGoNext, canGoPrev } = usePager(
      ref(ImgsPerPage),
      computed(() => imgSrcs.value.length),
    );
    const displayImgSrcs = computed(() => {
      const albumIdValue = albumId.value;
      const dirIdValue = dirId.value;
      const pageValue = page.value;
      const originalImgSrcs = imgSrcs.value;

      if (albumIdValue === undefined || dirIdValue === undefined) {
        return [];
      }

      return originalImgSrcs
        .slice(ImgsPerPage * pageValue, Math.min(originalImgSrcs.length, ImgsPerPage * (pageValue + 1)))
        .map((src) => ({
          ...src,
          imgSrc: directoryService.toThumbNailURL(albumIdValue, dirIdValue, src.fileName),
        }));
    });

    const fetchImgSrcs = async () => {
      const albumIdValue = albumId.value;
      const dirIdValue = dirId.value;

      if (albumIdValue === undefined || dirIdValue === undefined) {
        return;
      }

      imgSrcs.value = (await directoryService.getAllFiles(albumIdValue, dirIdValue)).map((fn, i) => ({
        index: i,
        fileName: fn,
      }));
    };
    onMounted(fetchImgSrcs);

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

    const randomJumpPage = () => {
      page.value = Math.round(Math.random() * maxPage.value);
    };

    const moveDir = async (targetFileName: string, destDirId: number) => {
      const albumIdValue = albumId.value;
      const dirIdValue = dirId.value;
      if (!isNotNullOrUndefined(albumIdValue) || !isNotNullOrUndefined(dirIdValue)) {
        return;
      }

      await moveService.movePictureAsync(albumIdValue, targetFileName, dirIdValue, destDirId);
      await fetchImgSrcs();
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
      albumId,
      dirId,
      viewingImageFileIndex,
      viewingImageFileName,
      onCloseImageView,
      onImageViewNext,
      onImageViewPrev,
      randomJumpPage,
      moveDir,
    };
  },
  components: {
    GalleryButton,
    ChevronLeft,
    ArrowLeftIcon,
    ArrowRightIcon,
    Dice3,
    SingleImageView,
  },
});
</script>
