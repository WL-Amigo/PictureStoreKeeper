import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { computed, defineComponent, toRef } from 'vue';
import * as vt from 'vue-types';
import { useHoveredSubImgIndex, useLookAheadVirtualImgSrcList } from './compositions';
import { Button } from '@/components/parts/Button';
import { DirEntryWithId } from '@/models/DirEntry';
import { BoxChevronsDown, BoxChevronsRight, BoxUndoIcon } from '@/components/icons/Boxicons';
import clsx from 'clsx';
import { windi } from '@/windi';

const PreviewImageCount = 5;

export const PictureArrangerBody = defineComponent({
  name: 'PictureArrangerPageBody',
  props: {
    albumId: vt.string().isRequired,
    dirId: vt.number().isRequired,
    sourceList: vt.arrayOf(vt.string()).isRequired,
    destDirEntries: vt.arrayOf(vt.object<DirEntryWithId>()).isRequired,
  },
  emits: {
    move: (destDirId: number) => true,
    skip: () => true,
    deleteImg: () => true,
    exit: () => true,
  },
  setup(props, ctx) {
    const directoryAPIService = useDependency(ServiceKeys.DirectoryAPIService);
    const { onHoverSubImg, onUnhoverSubImg, hoveredImgIndex } = useHoveredSubImgIndex();

    const { imgSrcList, isInLookAheadMode, lookAhead, returnFromLookAhead } = useLookAheadVirtualImgSrcList(
      toRef(props, 'sourceList'),
    );

    const currentHeadImageFileName = computed((): string | undefined => {
      const currentHoveredImgIndex = hoveredImgIndex.value;
      const currentHeadImgIndex = currentHoveredImgIndex ?? 0;

      return imgSrcList.value[currentHeadImgIndex];
    });
    const currentHeadImageSource = computed(() => {
      const albumId = props.albumId;
      const dirId = props.dirId;

      return currentHeadImageFileName.value !== undefined
        ? directoryAPIService.toFileURL(albumId, dirId, currentHeadImageFileName.value)
        : undefined;
    });

    const previewImageSourceList = computed(() => {
      const albumId = props.albumId;
      const dirId = props.dirId;
      const currentImageSourceList = imgSrcList.value;

      let slicedSourceList = currentImageSourceList.slice(0, PreviewImageCount);
      slicedSourceList = slicedSourceList.concat(
        [...Array(Math.max(0, PreviewImageCount - slicedSourceList.length))].map(() => ''),
      );

      return slicedSourceList.map((fn) =>
        fn.length === 0 ? '' : directoryAPIService.toThumbNailURL(albumId, dirId, fn),
      );
    });
    const isHeadImage = (index: number): boolean => {
      return index === (hoveredImgIndex.value ?? 0);
    };

    const disableMoveOperations = computed(() => isInLookAheadMode.value);

    const onExit = () => ctx.emit('exit');

    return () => (
      <div class="w-screen h-full absolute inset-0 overflow-hidden flex flex-col">
        {/* main image display area */}
        <div class="h-4/5 <md:h-2/3 flex flex-row <md:flex-col">
          <div class="flex-1 overflow-hidden relative">
            {currentHeadImageSource.value !== undefined ? (
              <>
                <img src={currentHeadImageSource.value} class="w-full h-full object-scale-down" />
                <div class="absolute bottom-0 w-full h-8 flex flex-row justify-center items-center">
                  <div class="py-1 px-2 bg-black/60 text-white">{currentHeadImageFileName.value}</div>
                </div>
              </>
            ) : (
              <div class="w-full h-full flex flex-col justify-center items-center gap-y-2">
                <span>表示する画像がありません</span>
                <Button variant="primary" onClick={onExit}>
                  整理を終了
                </Button>
              </div>
            )}
          </div>

          {/* look-forward images area */}
          <div class="flex flex-col w-1/6 <md:w-auto <md:flex-row <md:h-20">
            <button
              class={clsx(
                windi`w-full <md:w-auto <md:h-full self-center flex flex-row <md:flex-col justify-center bg-white/50`,
                isInLookAheadMode.value ? windi`hover:bg-opacity-100` : windi`opacity-25 cursor-default`,
              )}
              onClick={returnFromLookAhead}
              disabled={!isInLookAheadMode.value}
            >
              <BoxUndoIcon class="w-8 h-8" />
            </button>
            <div class="flex-1 overflow-hidden">
              <div class="flex flex-col h-full <md:flex-row <md:items-stretch">
                {previewImageSourceList.value.map((imgSrc, idx) =>
                  imgSrc !== '' ? (
                    <div
                      class={clsx(
                        windi`flex-1 overflow-hidden box-border border-4`,
                        isHeadImage(idx) ? windi`border-blue-300` : windi`border-transparent`,
                      )}
                      onMouseenter={() => onHoverSubImg(idx)}
                      onMouseleave={() => onUnhoverSubImg(idx)}
                    >
                      <img src={imgSrc} class="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div class="flex-1"></div>
                  ),
                )}
              </div>
            </div>
            <button
              class="w-full <md:w-auto <md:h-full self-center flex flex-row <md:flex-col justify-center bg-white/50 hover:bg-opacity-100"
              onClick={lookAhead}
            >
              <BoxChevronsDown class="w-8 h-8 <md:hidden" />
              <BoxChevronsRight class="w-8 h-8 md:hidden" />
            </button>
          </div>
        </div>

        {/* operation buttons area */}
        <div class="container mx-auto h-1/5 <md:h-1/3 flex flex-col gap-y-2 relative">
          <div class="w-full p-2 flex-1 overflow-x-hidden overflow-y-auto <md:bg-white/50 <md:shadow-inner">
            <div class="flex flex-row justify-center flex-wrap h-full items-center <md:h-auto <md:grid <md:grid-cols-2 gap-2">
              {props.destDirEntries.map((dest) => (
                <Button
                  variant="primary"
                  onClick={() => ctx.emit('move', dest.id)}
                  disabled={disableMoveOperations.value}
                >
                  {dest.label}
                </Button>
              ))}
            </div>
          </div>
          <div class="w-full flex flex-row items-center justify-center gap-x-2 p-2">
            <Button class="w-40" onClick={() => ctx.emit('skip')} disabled={disableMoveOperations.value}>
              とりあえずスキップ
            </Button>
            <Button
              class="w-40"
              variant="primary"
              onClick={() => ctx.emit('deleteImg')}
              disabled={disableMoveOperations.value}
            >
              破棄する
            </Button>
          </div>
          {isInLookAheadMode.value && (
            <div class="absolute inset-0 flex justify-center items-center">
              <div class="p-8 bg-white/75 flex flex-col items-center gap-y-2">
                <span class="text-2xl">先読みモード中</span>
                <span>移動する前に先読みモードを解除して下さい</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
});
