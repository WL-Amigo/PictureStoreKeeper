import { Dice3Icon } from '@/components/icons/Boxicons';
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon } from '@/components/icons/HeroIcons';
import { Loading } from '@/components/parts/Loading';
import { useDependency, ServiceKeys } from '@/compositions/Dependency';
import { usePager } from '@/compositions/Page';
import { useSingleIntRouteParam, useSingleRouteParam } from '@/compositions/Router';
import { vt } from '@/utils/Vue';
import { computed, defineComponent, onMounted, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { GalleryBulkOperationButton } from './components/BulkOperationButton';
import { GalleryButton } from './components/GalleryButton';
import { GallerySingleImageView } from './components/SingleImageView';
import { useGalleryMultiSelectState } from './compositions/MultiSelect';

const ImgsPerPage = 20;

interface FileNameWithIndex {
  fileName: string;
  index: number;
}

const Container = defineComponent({
  setup() {
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);

    const albumId = useSingleRouteParam('albumId');
    const dirId = useSingleIntRouteParam('dirId');

    const imgSrcs = ref<FileNameWithIndex[]>([]);
    const isLoadFinished = ref(false);
    const fetchImgSrcs = async () => {
      imgSrcs.value = (await directoryService.getAllFiles(albumId.value, dirId.value)).map((fn, i) => ({
        index: i,
        fileName: fn,
      }));
      isLoadFinished.value = true;
    };
    onMounted(fetchImgSrcs);

    return () =>
      !isLoadFinished.value ? (
        <div class="w-full h-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <Body imgSrcs={imgSrcs.value} albumId={albumId.value} dirId={dirId.value} onRequestReload={fetchImgSrcs} />
      );
  },
});

const Body = defineComponent({
  props: {
    imgSrcs: vt.arrayOf(vt.object<FileNameWithIndex>()).isRequired,
    albumId: vt.string().isRequired,
    dirId: vt.number().isRequired,
  },
  emits: {
    requestReload: () => true,
  },
  setup(props, ctx) {
    const router = useRouter();
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);
    const moveService = useDependency(ServiceKeys.MoveAPIService);

    const { page, maxPage, goNext, goPrev, canGoNext, canGoPrev } = usePager(
      ref(ImgsPerPage),
      computed(() => props.imgSrcs.length),
    );
    const displayImgSrcs = computed(() => {
      const pageValue = page.value;
      const originalImgSrcs = props.imgSrcs;

      return originalImgSrcs
        .slice(ImgsPerPage * pageValue, Math.min(originalImgSrcs.length, ImgsPerPage * (pageValue + 1)))
        .map((src) => ({
          ...src,
          imgSrc: directoryService.toThumbNailURL(props.albumId, props.dirId, src.fileName),
        }));
    });

    const onBack = () => {
      router.push({ name: 'directory-selector-before-gallery', params: { albumId: props.albumId } });
    };

    const viewingImageFileIndex = ref(-1);
    const viewingImageFileName = computed(() => props.imgSrcs[viewingImageFileIndex.value]?.fileName ?? '');
    const onCloseImageView = () => (viewingImageFileIndex.value = -1);
    const onImageViewNext = () => {
      let nextIndex = viewingImageFileIndex.value + 1;
      if (nextIndex >= props.imgSrcs.length) {
        nextIndex = 0;
      }
      viewingImageFileIndex.value = nextIndex;
    };
    const onImageViewPrev = () => {
      let nextIndex = viewingImageFileIndex.value - 1;
      if (nextIndex < 0) {
        nextIndex = props.imgSrcs.length - 1;
      }
      viewingImageFileIndex.value = nextIndex;
    };

    const randomJumpPage = () => {
      page.value = Math.round(Math.random() * maxPage.value);
    };

    const moveDir = async (targetFileName: string, destDirId: number) => {
      await moveService.movePictureAsync(props.albumId, [targetFileName], props.dirId, destDirId);
      ctx.emit('requestReload');
    };

    const { selectedImgSet, isInMultiSelectMode, toggleSelection, clearSelection, dispatchBulkOperation } =
      useGalleryMultiSelectState(toRef(props, 'albumId'), toRef(props, 'dirId'), () => {
        ctx.emit('requestReload');
      });

    return () => (
      <div class="w-full h-screen flex flex-col">
        <div class="grid grid-cols-4 grid-rows-5 md:grid-cols-5 md:grid-rows-4 gap-2 container mx-auto flex-1 overflow-hidden py-2">
          {displayImgSrcs.value.map((src) => (
            <div class="relative">
              <img
                src={src.imgSrc}
                key={src.index}
                width="128"
                height="128"
                class="object-contain object-center w-full h-full cursor-pointer"
                onContextmenu={(ev) => {
                  ev.preventDefault();
                  toggleSelection(src.fileName);
                }}
                onClick={(ev) => {
                  ev.preventDefault();
                  if (isInMultiSelectMode.value) {
                    toggleSelection(src.fileName);
                  } else {
                    viewingImageFileIndex.value = src.index;
                  }
                }}
              />
              {selectedImgSet.value.has(src.fileName) && (
                <div class="absolute inset-0 bg-white/50" onClick={() => toggleSelection(src.fileName)}></div>
              )}
            </div>
          ))}
        </div>
        <div class="flex flex-row justify-between bg-white bg-opacity-50">
          <div class="w-60">
            <GalleryButton onClick={onBack}>
              <ChevronLeftIcon class="w-6 h-6" />
              <span>戻る</span>
            </GalleryButton>
          </div>
          <div class="flex flex-row justify-center gap-x-2">
            <GalleryButton onClick={goPrev} disabled={!canGoPrev.value}>
              <ArrowLeftIcon class="w-5 h-5" />
            </GalleryButton>
            <div class="p-2">{`${page.value + 1}/${maxPage.value + 1}`}</div>
            <GalleryButton onClick={goNext} disabled={!canGoNext.value}>
              <ArrowRightIcon class="w-5 h-5" />
            </GalleryButton>
          </div>
          <div class="w-60 flex flex-row justify-end">
            {!isInMultiSelectMode.value ? (
              <GalleryButton onClick={randomJumpPage}>
                <Dice3Icon class="w-6 h-6" />
                <span class="<md:hidden">ランダムなページへ飛ぶ</span>
              </GalleryButton>
            ) : (
              <GalleryBulkOperationButton
                albumId={props.albumId}
                dirId={props.dirId}
                onDispatchBulkAction={dispatchBulkOperation}
                onExitMultiSelect={clearSelection}
              />
            )}
          </div>
        </div>
        <GallerySingleImageView
          currentImgFileName={viewingImageFileName.value}
          albumId={props.albumId}
          dirId={props.dirId}
          canGoNext
          canGoPrev
          onClose={onCloseImageView}
          onNext={onImageViewNext}
          onPrev={onImageViewPrev}
          onMoveDir={moveDir}
        />
      </div>
    );
  },
});

export const GalleryPage = Container;
