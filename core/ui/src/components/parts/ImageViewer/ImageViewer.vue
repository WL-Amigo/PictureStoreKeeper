<template>
  <div class="w-full h-full relative overflow-visible" @mousemove="showControlPanel" @touchstart="showControlPanel">
    <img
      :src="src"
      :class="imgClasses"
      :style="imgStyles"
      @load="onImageLoaded"
      ref="imgElRef"
      class="max-w-none touch-none"
    />
    <div
      class="w-full flex flex-row justify-center absolute bottom-12 pointer-events-none transition-opacity"
      :class="controlPanelClasses"
    >
      <div class="p-2 bg-black rounded space-x-2 pointer-events-auto <md:hidden">
        <button
          v-for="opt in viewModeSelectOptions"
          :key="opt.id"
          class="bg-white px-4 py-0.5 rounded-sm"
          @click="currentMode = opt.id"
        >
          {{ opt.label }}
        </button>
      </div>
      <div class="p-2 bg-black rounded space-x-2 pointer-events-auto md:hidden">
        <SingleSelect :options="viewModeSelectOptions" v-model="currentMode" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineRequiredStringProp } from '@/utils/Vue';
import { computed, CSSProperties, defineComponent, ref, shallowRef, watch } from 'vue';
import { useDraggable } from '@vueuse/core';
import { SingleSelect } from '../forms/SingleSelect';
import { IDAndLabelPair } from '@/models/IDAndLabelPair';
import { windi } from '@/windi';

type ViewMode = 'scale-down' | 'contain' | 'cover' | 'original';
type Size = { width: number; height: number };
type Position = { x: number; y: number };
const ViewModesToEnablePositioning: readonly ViewMode[] = ['cover', 'original'];
const ViewModeSelectOptions: IDAndLabelPair<ViewMode>[] = [
  {
    id: 'scale-down',
    label: '画面内に入るように縮小',
  },
  {
    id: 'contain',
    label: '画面いっぱいになるように拡大・縮小',
  },
  {
    id: 'cover',
    label: '画面を覆うように拡大・縮小',
  },
  {
    id: 'original',
    label: '元のサイズ',
  },
];

const getDrawnImageClampedPosition = (x: number, y: number, drawnWidth: number, drawnHeight: number): Position => {
  if (isNaN(drawnWidth) || isNaN(drawnHeight)) {
    return { x, y };
  }
  const clampedX = Math.max(Math.min(window.innerWidth - drawnWidth, 0), Math.min(x, 0));
  const clampedY = Math.max(Math.min(window.innerHeight - drawnHeight, 0), Math.min(y, 0));

  return { x: clampedX, y: clampedY };
};

export default defineComponent({
  props: {
    src: defineRequiredStringProp(),
  },
  name: 'ImageViewer',
  setup() {
    const currentMode = ref<ViewMode>('scale-down');
    const imgClasses = computed(() => {
      switch (currentMode.value) {
        case 'scale-down':
          return ['object-scale-down', 'object-center', 'w-full', 'h-full'];
        case 'contain':
          return ['object-contain', 'object-center', 'w-full', 'h-full'];
        case 'cover':
          return ['object-cover'];
        case 'original':
          return ['object-none', 'overflow-visible'];
      }

      return [];
    });

    const originalImageSize = shallowRef<Size>({ width: NaN, height: NaN });
    const onImageLoaded = (ev: Event) => {
      const el = ev.target;
      if (!(el instanceof HTMLImageElement)) {
        return;
      }
      originalImageSize.value = { width: el.naturalWidth, height: el.naturalHeight };
    };
    const drawnImageSize = computed<Size>(() => {
      const { width: origWidth, height: origHeight } = originalImageSize.value;
      const mode = currentMode.value;

      if (isNaN(origWidth) || isNaN(origHeight)) {
        return { width: NaN, height: NaN };
      }
      // 'scale-down' | 'contain' ではドラッグ移動は使用しないのでスキップ
      if (mode === 'scale-down' || mode === 'contain') {
        return { width: origWidth, height: origHeight };
      } else if (mode === 'cover') {
        const scale = Math.max(window.innerWidth / origWidth, window.innerHeight / origHeight);
        return { width: Math.round(origWidth * scale), height: Math.round(origHeight * scale) };
      } else if (mode === 'original') {
        return { width: origWidth, height: origHeight };
      }

      return { width: NaN, height: NaN };
    });

    const sizingStyles = computed<CSSProperties>(() => {
      const mode = currentMode.value;
      const { width: drawnWidth, height: drawnHeight } = drawnImageSize.value;
      if (!ViewModesToEnablePositioning.includes(mode) || isNaN(drawnWidth) || isNaN(drawnHeight)) {
        return {};
      }
      return { width: `${drawnWidth}px`, height: `${drawnHeight}px` };
    });

    const imgElRef = ref<HTMLElement | null>(null);
    const { position, isDragging } = useDraggable(imgElRef, {
      preventDefault: true,
    });
    watch(isDragging, (current, prev) => {
      if (!current && prev) {
        // true => false になった時に position をドラッグ可能範囲に補正
        const { x, y } = position.value;
        const { width: drawnWidth, height: drawnHeight } = drawnImageSize.value;
        position.value = getDrawnImageClampedPosition(x, y, drawnWidth, drawnHeight);
      }
    });
    watch(currentMode, () => {
      position.value.x = 0;
      position.value.y = 0;
    });

    const imgPositioningStyles = computed(() => {
      const { width: drawnWidth, height: drawnHeight } = drawnImageSize.value;
      const { x: clampedX, y: clampedY } = getDrawnImageClampedPosition(
        position.value.x,
        position.value.y,
        drawnWidth,
        drawnHeight,
      );
      return {
        transform: `translate(${clampedX}px,${clampedY}px)`,
      };
    });
    const imgStyles = computed<CSSProperties>(() => {
      if (!ViewModesToEnablePositioning.includes(currentMode.value)) {
        return {};
      }
      return {
        ...imgPositioningStyles.value,
        ...sizingStyles.value,
      };
    });

    const isVisibleControlPanel = ref(false);
    const controlPanelTimeoutId = ref(NaN);
    const showControlPanel = () => {
      if (!isNaN(controlPanelTimeoutId.value)) {
        clearTimeout(controlPanelTimeoutId.value);
      }
      isVisibleControlPanel.value = true;
      controlPanelTimeoutId.value = setTimeout(() => (isVisibleControlPanel.value = false), 3000);
    };
    const controlPanelClasses = computed(() => [isVisibleControlPanel.value ? windi`opacity-100` : windi`opacity-0`]);

    return {
      currentMode,
      viewModeSelectOptions: ViewModeSelectOptions,
      imgClasses,
      imgStyles,
      onImageLoaded,
      imgElRef,
      showControlPanel,
      controlPanelClasses,
    };
  },
  components: {
    SingleSelect,
  },
});
</script>
