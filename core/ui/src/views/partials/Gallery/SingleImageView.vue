<template>
  <ModalBase :open="currentImgFileName.length > 0">
    <div class="w-full h-full absolute inset-0 flex flex-col" @click.stop="">
      <img :src="currentImgSrc" class="object-scale-down object-center flex-1" />
      <div class="w-full flex flex-row justify-between text-white">
        <button @click="$emit('prev')" :disabled="!canGoPrev" class="p-2 bg-white bg-opacity-0 hover:bg-opacity-25">
          <ArrowLeftSmall class="w-10 h-10" />
        </button>
        <button @click="$emit('next')" :disabled="!canGoNext" class="p-2 bg-white bg-opacity-0 hover:bg-opacity-25">
          <ArrowRightSmall class="w-10 h-10" />
        </button>
      </div>
    </div>
    <button
      @click="$emit('close')"
      class="absolute right-0 top-0 w-12 h-12 text-white bg-white bg-opacity-0 hover:bg-opacity-25"
    >
      <Close class="w-full h-full" />
    </button>
  </ModalBase>
</template>

<script lang="ts">
import { defineRequiredBooleanProp, defineRequiredNumberProp, defineRequiredStringProp } from '@/utils/Vue';
import { computed, defineComponent } from 'vue';
import ModalBase from '@/components/ModalBase.vue';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import ArrowLeftSmall from '@/components/icons/HeroIcons/ArrowLeftSmall.vue';
import ArrowRightSmall from '../../../components/icons/HeroIcons/ArrowRightSmall.vue';
import Close from '@/components/icons/Boxicons/Close.vue';

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
  },
  setup(props) {
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);
    const currentImgSrc = computed(() => {
      return props.currentImgFileName.length === 0
        ? ''
        : directoryService.toFileURL(props.albumId, props.dirId, props.currentImgFileName);
    });

    return {
      currentImgSrc,
    };
  },
  components: {
    ModalBase,
    ArrowLeftSmall,
    ArrowRightSmall,
    Close,
  },
});
</script>
