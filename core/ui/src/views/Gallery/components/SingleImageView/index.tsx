import { CloseIcon } from '@/components/icons/Boxicons';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons/HeroIcons';
import { ModalBase } from '@/components/ModalBase';
import { ImageViewer } from '@/components/parts/ImageViewer';
import { useDependency, ServiceKeys } from '@/compositions/Dependency';
import { stopPropagationHandler } from '@/utils/EventHandlers';
import { vt } from '@/utils/Vue';
import { computed, defineComponent } from 'vue';
import { GalleryImageViewMenuButton } from './components/Menu';

export const GallerySingleImageView = defineComponent({
  props: {
    currentImgFileName: vt.string().isRequired,
    albumId: vt.string().isRequired,
    dirId: vt.number().isRequired,
    canGoNext: vt.bool().isRequired,
    canGoPrev: vt.bool().isRequired,
  },
  emits: {
    next: () => true,
    prev: () => true,
    close: () => true,
    moveDir: (_fileName: string, _destDirId: number) => true,
  },
  setup(props, ctx) {
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);
    const currentImgSrc = computed(() => {
      return props.currentImgFileName.length === 0
        ? ''
        : directoryService.toFileURL(props.albumId, props.dirId, props.currentImgFileName);
    });

    const emitClose = () => ctx.emit('close');
    const emitPrev = () => ctx.emit('prev');
    const emitNext = () => ctx.emit('next');
    const moveDir = (id: number) => {
      ctx.emit('close');
      ctx.emit('moveDir', props.currentImgFileName, id);
    };

    const onOverscroll = (direction: 'left' | 'right') => (direction === 'left' ? ctx.emit('next') : ctx.emit('prev'));

    return () => (
      <ModalBase open={props.currentImgFileName.length > 0}>
        <div class="w-full h-full absolute inset-0" onClick={stopPropagationHandler}>
          <ImageViewer src={currentImgSrc.value} onOverscrollTo={onOverscroll} />
        </div>
        <button
          onClick={emitClose}
          class="absolute right-0 top-0 w-12 h-12 text-white bg-white bg-opacity-0 hover:bg-opacity-25"
        >
          <CloseIcon class="w-full h-full" />
        </button>
        <div class="w-full absolute bottom-0 left-0 right-0 flex flex-row justify-between text-white">
          <button onClick={emitPrev} disabled={!props.canGoPrev} class="p-2 bg-white bg-opacity-0 hover:bg-opacity-25">
            <ArrowLeftIcon class="w-10 h-10" />
          </button>
          <GalleryImageViewMenuButton albumId={props.albumId} dirId={props.dirId} onMoveDir={moveDir} />
          <button onClick={emitNext} disabled={!props.canGoNext} class="p-2 bg-white bg-opacity-0 hover:bg-opacity-25">
            <ArrowRightIcon class="w-10 h-10" />
          </button>
        </div>
      </ModalBase>
    );
  },
});
