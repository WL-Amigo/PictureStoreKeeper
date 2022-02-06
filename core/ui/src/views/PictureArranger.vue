<template>
  <div class="w-screen h-full absolute inset-0 overflow-hidden flex flex-col">
    <!-- main image display area -->
    <div class="h-4/5 <md:h-2/3 flex flex-row <md:flex-col">
      <div class="flex-1 overflow-hidden">
        <img :src="currentHeadImageSrc" class="w-full h-full object-scale-down" />
      </div>

      <!-- look-forward images area -->
      <div class="flex flex-col w-1/6 <md:w-auto <md:flex-row <md:h-20">
        <div class="w-8 h-8">
          <!-- TODO: quit more look-forward button -->
        </div>
        <div class="flex-1 overflow-hidden">
          <div class="flex flex-col h-full <md:flex-row <md:items-stretch">
            <div
              v-for="(imgSrc, idx) in nextImageSrcs"
              :key="imgSrc"
              class="flex-1 overflow-hidden"
              @mouseenter="onHoverSubImg(idx)"
              @mouseleave="onUnhoverSubImg(idx)"
            >
              <img :src="imgSrc" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div class="w-8 h-8">
          <!-- TODO: more look-forward button -->
        </div>
      </div>
    </div>

    <!-- operation buttons area -->
    <div class="container mx-auto h-1/5 <md:h-1/3 flex flex-col gap-y-2">
      <div class="w-full p-2 flex-1 overflow-x-hidden overflow-y-auto <md:bg-white/50 <md:shadow-inner">
        <div
          class="flex flex-row justify-center flex-wrap h-full items-center <md:h-auto <md:grid <md:grid-cols-2 gap-2"
        >
          <template v-for="dest in destinationDirs" :key="dest.id">
            <psk-button variant="primary" class="" @click="onMove(dest.id)">
              {{ dest.label }}
            </psk-button>
          </template>
        </div>
      </div>
      <div class="w-full flex flex-row items-center justify-center gap-x-2 p-2">
        <psk-button class="w-40" @click="onSkip()">とりあえずスキップ</psk-button>
        <psk-button class="w-40" variant="primary" @click="onDelete()">破棄する</psk-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Button from '@/components/parts/Button.vue';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useAlbumDataWithUrlId } from '@/compositions/Album';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { useRoute } from 'vue-router';

const SubImgCount = 5;

const useHoveredSubImgIndex = () => {
  // 画像間でカーソルを動かした時に不安定になるのを防止するため、先読み画像1つ1つに対してホバー中かどうかを保持している
  const hoveredImgIndices = ref<number[]>([]);

  const onHoverSubImg = (idx: number) => hoveredImgIndices.value.push(idx);
  const onUnhoverSubImg = (idx: number) => (hoveredImgIndices.value = hoveredImgIndices.value.filter((i) => i !== idx));

  const hoveredImgIndex = computed<number | undefined>(() => hoveredImgIndices.value[0]);

  return {
    onHoverSubImg,
    onUnhoverSubImg,
    hoveredImgIndex,
  };
};

export default defineComponent({
  components: {
    'psk-button': Button,
  },
  setup() {
    const directoryAPIService = useDependency(ServiceKeys.DirectoryAPIService);
    const moveAPIService = useDependency(ServiceKeys.MoveAPIService);
    const route = useRoute();

    const { album, id: albumId } = useAlbumDataWithUrlId();
    const dirId = computed(() => {
      const value = route.params['dirId'];
      const dirIdInt = typeof value === 'string' ? parseInt(value) : NaN;
      return !isNaN(dirIdInt) ? dirIdInt : undefined;
    });
    const imgSrcList = ref<string[]>([]);
    onMounted(async () => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      if (currentAlbumId === undefined || currentDirId === undefined) {
        return;
      }
      imgSrcList.value = await directoryAPIService.getAllFiles(currentAlbumId, currentDirId);
    });

    const { onHoverSubImg, onUnhoverSubImg, hoveredImgIndex } = useHoveredSubImgIndex();
    const currentHeadImageSrc = computed(() => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;

      const currentHoveredImgIndex = hoveredImgIndex.value;
      const currentHeadImgIndex = currentHoveredImgIndex !== undefined ? currentHoveredImgIndex + 1 : 0;
      const currentImgFileName = imgSrcList.value[currentHeadImgIndex];

      return currentAlbumId !== undefined && currentDirId !== undefined && currentImgFileName !== undefined
        ? directoryAPIService.toFileURL(currentAlbumId, currentDirId, currentImgFileName)
        : undefined;
    });

    const nextImageSrcs = computed(() => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      const currentImgSrcList = imgSrcList.value;
      if (currentAlbumId === undefined || currentDirId === undefined) {
        return [];
      }
      return currentImgSrcList
        .slice(1, 1 + SubImgCount)
        .map((fn) => (fn.length === 0 ? '' : directoryAPIService.toFileURL(currentAlbumId, currentDirId, fn)));
    });

    const destinationDirs = computed(() => {
      const currentDirId = dirId.value;
      return (
        album.value?.directories
          .map((v, i) => {
            return { ...v, id: i };
          })
          .filter((v) => v.id !== currentDirId) ?? []
      );
    });

    const onMove = (destIdx: number) => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      const targetImgFileName = imgSrcList.value[0];
      if (currentAlbumId === undefined || currentDirId === undefined || targetImgFileName === undefined) {
        return;
      }

      // TODO: handle failure
      moveAPIService.movePictureAsync(currentAlbumId, targetImgFileName, currentDirId, destIdx);
      imgSrcList.value.splice(0, 1);
    };
    const onDelete = () => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      const targetImgFileName = imgSrcList.value[0];
      if (currentAlbumId === undefined || currentDirId === undefined || targetImgFileName === undefined) {
        return;
      }

      moveAPIService.deletePictureAsync(currentAlbumId, targetImgFileName, currentDirId);
      imgSrcList.value.splice(0, 1);
    };
    const onSkip = () => {
      imgSrcList.value.splice(0, 1);
    };

    return {
      currentHeadImageSrc,
      nextImageSrcs,
      onHoverSubImg,
      onUnhoverSubImg,
      destinationDirs,
      onMove,
      onSkip,
      onDelete,
    };
  },
});
</script>

<style scoped>
.h-next-imgs-container {
  height: calc(100% - 6rem);
}
</style>
