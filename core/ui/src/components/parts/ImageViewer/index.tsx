import { defineRequiredStringProp } from '@/utils/Vue';
import { computed, CSSProperties, defineComponent, ref, shallowRef, watch } from 'vue';
import { useDraggable } from '@vueuse/core';
import { SingleSelect } from '../forms/SingleSelect';
import { IDAndLabelPair } from '@/models/IDAndLabelPair';
import { windi } from '@/windi';
import clsx from 'clsx';

type ViewMode = 'scale-down' | 'contain' | 'cover' | 'original';
type Size = { width: number; height: number };
type Position = { x: number; y: number; overX: number; overY: number };
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
const OverscrollThreshold = 80;

const getDrawnImageClampedPosition = (x: number, y: number, drawnWidth: number, drawnHeight: number): Position => {
  if (isNaN(drawnWidth) || isNaN(drawnHeight)) {
    return { x, y, overX: 0, overY: 0 };
  }
  const clampedX = Math.max(Math.min(window.innerWidth - drawnWidth, 0), Math.min(x, 0));
  const clampedY = Math.max(Math.min(window.innerHeight - drawnHeight, 0), Math.min(y, 0));

  return { x: clampedX, y: clampedY, overX: x - clampedX, overY: y - clampedY };
};

export const ImageViewer = defineComponent({
  props: {
    src: defineRequiredStringProp(),
  },
  emits: {
    overscrollTo: (direction: 'left' | 'right') => true,
  },
  name: 'ImageViewer',
  setup(props, ctx) {
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
      if (mode === 'scale-down') {
        const scale = Math.min(1, window.innerWidth / origWidth, window.innerHeight / origHeight);
        return { width: Math.round(origWidth * scale), height: Math.round(origHeight * scale) };
      } else if (mode === 'contain') {
        const scale = Math.min(window.innerWidth / origWidth, window.innerHeight / origHeight);
        return { width: Math.round(origWidth * scale), height: Math.round(origHeight * scale) };
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
        const clampedPos = getDrawnImageClampedPosition(x, y, drawnWidth, drawnHeight);
        position.value = clampedPos;
        // true => false になった時にオーバースクロールが既定値以上だったら
        // overscrollTo イベントを送出
        if (clampedPos.overX < -OverscrollThreshold) {
          ctx.emit('overscrollTo', 'left');
        } else if (clampedPos.overX > OverscrollThreshold) {
          ctx.emit('overscrollTo', 'right');
        }
      }
    });
    watch(currentMode, () => {
      position.value.x = 0;
      position.value.y = 0;
    });

    const imgPositioningStyles = computed(() => {
      const { width: drawnWidth, height: drawnHeight } = drawnImageSize.value;
      const {
        x: clampedX,
        y: clampedY,
        overX,
      } = getDrawnImageClampedPosition(position.value.x, position.value.y, drawnWidth, drawnHeight);
      return {
        transform: !ViewModesToEnablePositioning.includes(currentMode.value)
          ? `translate(${overX / 10}px,0)`
          : `translate(${clampedX + overX / 10}px,${clampedY}px)`,
      };
    });
    const imgStyles = computed<CSSProperties>(() => {
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

    return () => (
      <div
        class="w-full h-full relative overflow-visible"
        onMousemove={showControlPanel}
        onTouchstart={showControlPanel}
      >
        <img
          src={props.src}
          class={clsx(imgClasses.value, windi`max-w-none touch-none`)}
          style={imgStyles.value}
          onLoad={onImageLoaded}
          ref={imgElRef}
        />
        <div
          class={clsx(
            windi`w-full flex flex-row justify-center absolute bottom-12 pointer-events-none transition-opacity`,
            controlPanelClasses.value,
          )}
        >
          <div class="p-2 bg-black rounded space-x-2 pointer-events-auto <md:hidden">
            {ViewModeSelectOptions.map((opt) => (
              <button key={opt.id} class="bg-white px-4 py-0.5 rounded-sm" onClick={() => (currentMode.value = opt.id)}>
                {opt.label}
              </button>
            ))}
          </div>
          <div class="p-2 bg-black rounded space-x-2 pointer-events-auto md:hidden">
            <SingleSelect
              options={ViewModeSelectOptions}
              modelValue={currentMode.value}
              onUpdate:modelValue={(value) => (currentMode.value = value as ViewMode)}
            />
          </div>
        </div>
      </div>
    );
  },
});
