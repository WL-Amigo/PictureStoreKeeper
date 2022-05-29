<template>
  <ModalBase :open="currentImgFileName.length > 0">
    <div class="w-full h-full absolute inset-0" @click.stop="">
      <ImageViewer :src="currentImgSrc" @overscrollTo="onOverscroll" />
    </div>
    <button
      @click="$emit('close')"
      class="absolute right-0 top-0 w-12 h-12 text-white bg-white bg-opacity-0 hover:bg-opacity-25"
    >
      <Close class="w-full h-full" />
    </button>
    <div class="w-full absolute bottom-0 left-0 right-0 flex flex-row justify-between text-white">
      <button @click="$emit('prev')" :disabled="!canGoPrev" class="p-2 bg-white bg-opacity-0 hover:bg-opacity-25">
        <ArrowLeftSmall class="w-10 h-10" />
      </button>
      <MenuButton :albumId="albumId" :dirId="dirId" @moveDir="moveDir" />
      <button @click="$emit('next')" :disabled="!canGoNext" class="p-2 bg-white bg-opacity-0 hover:bg-opacity-25">
        <ArrowRightSmall class="w-10 h-10" />
      </button>
    </div>
  </ModalBase>
</template>

<script lang="ts">
import { defineRequiredBooleanProp, defineRequiredNumberProp, defineRequiredStringProp } from '@/utils/Vue';
import { computed, defineComponent } from 'vue';
import { ModalBase } from '@/components/ModalBase';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import ArrowLeftSmall from '@/components/icons/HeroIcons/ArrowLeftSmall.vue';
import ArrowRightSmall from '../../../components/icons/HeroIcons/ArrowRightSmall.vue';
import Close from '@/components/icons/Boxicons/Close.vue';
import ImageViewer from '@/components/parts/ImageViewer/ImageViewer.vue';
import { GalleryImageViewMenuButton } from './SingleImageView/components/Menu';

export default defineComponent({
  props: {
    currentImgFileName: defineRequiredStringProp(),
    albumId: defineRequiredStringProp(),
    dirId: defineRequiredNumberProp(),
    canGoNext: defineRequiredBooleanProp(),
    canGoPrev: defineRequiredBooleanProp(),
  },
  emits: {
    next: null,
    prev: null,
    close: null,
    moveDir: (fileName: string, destDirId: number) => true,
  },
  setup(props, ctx) {
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);
    const currentImgSrc = computed(() => {
      return props.currentImgFileName.length === 0
        ? ''
        : directoryService.toFileURL(props.albumId, props.dirId, props.currentImgFileName);
    });

    const moveDir = (id: number) => {
      ctx.emit('close');
      ctx.emit('moveDir', props.currentImgFileName, id);
    };

    const onOverscroll = (direction: 'left' | 'right') => (direction === 'left' ? ctx.emit('next') : ctx.emit('prev'));

    return {
      currentImgSrc,
      moveDir,
      onOverscroll,
    };
  },
  components: {
    ModalBase,
    ImageViewer,
    MenuButton: GalleryImageViewMenuButton,
    ArrowLeftSmall,
    ArrowRightSmall,
    Close,
  },
});
</script>
