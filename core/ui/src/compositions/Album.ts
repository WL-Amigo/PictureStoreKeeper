import { Album } from '@/models/Album';
import { computed, ref, onMounted, watch, Ref, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import { useDependency, ServiceKeys } from './Dependency';

type AlbumDataComposition = {
  album: Ref<Album | undefined>;
  id: ComputedRef<string | undefined>;
};

export const useAlbumIdFromUrl = (): ComputedRef<string | undefined> => {
  const route = useRoute();
  return computed(() => {
    const albumId = route.params['albumId'];
    return typeof albumId === 'string' ? albumId : albumId[0];
  });
};

export const useAlbumDataWithUrlId = (): AlbumDataComposition => {
  const albumAPIService = useDependency(ServiceKeys.AlbumAPIService);

  const id = useAlbumIdFromUrl();
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
