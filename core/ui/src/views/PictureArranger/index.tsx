import { useAlbumDataWithUrlId } from '@/compositions/Album';
import { useDependency, ServiceKeys } from '@/compositions/Dependency';
import { useSingleIntRouteParam } from '@/compositions/Router';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { PictureArrangerBody } from './components/PageBody';
import Loading from '@/components/parts/Loading.vue';

export const PictureArrangerPage = defineComponent({
  name: 'PictureArrangerPage',
  setup() {
    const directoryAPIService = useDependency(ServiceKeys.DirectoryAPIService);
    const moveAPIService = useDependency(ServiceKeys.MoveAPIService);

    const { album, id: albumId } = useAlbumDataWithUrlId();
    const dirId = useSingleIntRouteParam('dirId');

    const imgSrcList = ref<string[]>([]);
    const isLoading = ref<boolean>(true);
    const loadAllImgSrcList = async () => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      if (currentAlbumId === undefined) {
        return;
      }

      isLoading.value = true;
      try {
        imgSrcList.value = await directoryAPIService.getAllFiles(currentAlbumId, currentDirId);
      } finally {
        isLoading.value = false;
      }
    };
    onMounted(loadAllImgSrcList);

    const destinationDirEntries = computed(() => {
      const currentDirId = dirId.value;
      return (
        album.value?.directories
          .map((v, i) => {
            return { ...v, id: i };
          })
          .filter((v) => v.id !== currentDirId) ?? []
      );
    });

    const move = (destIdx: number) => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      const targetImgFileName = imgSrcList.value[0];
      if (currentAlbumId === undefined || targetImgFileName === undefined) {
        return;
      }

      // TODO: handle failure
      moveAPIService.movePictureAsync(currentAlbumId, targetImgFileName, currentDirId, destIdx);
      imgSrcList.value.splice(0, 1);
    };

    const handleDelete = () => {
      const currentAlbumId = albumId.value;
      const currentDirId = dirId.value;
      const targetImgFileName = imgSrcList.value[0];
      if (currentAlbumId === undefined || targetImgFileName === undefined) {
        return;
      }

      moveAPIService.deletePictureAsync(currentAlbumId, targetImgFileName, currentDirId);
      imgSrcList.value.splice(0, 1);
    };
    const skip = () => {
      imgSrcList.value.splice(0, 1);
    };

    return () => {
      const albumIdValue = albumId.value;
      if (albumIdValue === undefined) {
        return null;
      }

      if (isLoading.value) {
        return (
          <div class="w-full h-full flex justify-center items-center">
            <Loading label="読み込み中…" />
          </div>
        );
      }

      return (
        <PictureArrangerBody
          albumId={albumIdValue}
          dirId={dirId.value}
          sourceList={imgSrcList.value}
          destDirEntries={destinationDirEntries.value}
          onMove={move}
          onSkip={skip}
          onDeleteImg={handleDelete}
        />
      );
    };
  },
});
