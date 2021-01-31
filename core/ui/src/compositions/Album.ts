import { Album } from '@/models/Album';
import { computed, ref, onMounted, watch, Ref, ComputedRef } from '@vue/composition-api';
import { useRoute } from './Compat';
import { useDependency, ServiceKeys } from './Dependency';

type AlbumDataComposition = {
  album: Ref<Album | undefined>;
  id: ComputedRef<string | undefined>;
};

export const useAlbumDataWithUrlId = (): AlbumDataComposition => {
  const albumAPIService = useDependency(ServiceKeys.AlbumAPIService);
  const route = useRoute();

  const id = computed(() => route?.params?.['albumId']);
  const album = ref<Album>();
  const fetchAlbum = async (currentId: string | undefined) => {
    if (!currentId) {
      return;
    }
    album.value = await albumAPIService.getAlbumAsync(currentId);
  };
  onMounted(() => fetchAlbum(id.value));
  watch(id, fetchAlbum);

  return {
    album,
    id,
  };
};
