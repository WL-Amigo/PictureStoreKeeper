import { BoxFolderIcon } from '@/components/icons/Boxicons';
import { defineComponent, ref, watchEffect } from 'vue';
import { ModalBase } from '@/components/ModalBase';
import { useAsyncState } from '@vueuse/core';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import * as vt from 'vue-types';
import Button from '@/components/parts/Button.vue';

export const GalleryImageViewMoveMenu = defineComponent({
  props: {
    albumId: vt.string().isRequired,
  },
  emits: {
    selectDir: (id: number) => true,
  },
  setup(props, ctx) {
    const isOpenDirSelectorState = ref(false);
    const onOpenDirSelector = () => {
      isOpenDirSelectorState.value = true;
    };
    const closeDirSelector = () => {
      isOpenDirSelectorState.value = false;
    };
    const onSelectDir = (id: number) => {
      isOpenDirSelectorState.value = false;
      ctx.emit('selectDir', id);
    };

    const dirApiService = useDependency(ServiceKeys.AlbumAPIService);
    const {
      state: dirEntries,
      isReady,
      execute: fetchDirEntries,
    } = useAsyncState(() => dirApiService.getAlbumAsync(props.albumId).then((album) => album.directories), [], {
      immediate: false,
    });
    watchEffect(() => {
      if (isOpenDirSelectorState.value) {
        fetchDirEntries();
      }
    });

    return () => (
      <>
        <button
          class="px-4 py-2 flex flex-row items-center gap-x-2 bg-white hover:bg-gray-100"
          onClick={onOpenDirSelector}
        >
          <BoxFolderIcon class="w-6 h-6" />
          他のフォルダに移動
        </button>
        <ModalBase open={isOpenDirSelectorState.value} onClickAway={closeDirSelector}>
          <div class="p-2 bg-white rounded flex flex-col gap-y-2">
            <h2>移動先を選択して下さい</h2>
            {isReady.value ? (
              dirEntries.value.map((entry, dirIdx) => (
                <Button variant="primary" onClick={() => onSelectDir(dirIdx)}>
                  {entry.label}
                </Button>
              ))
            ) : (
              <div class="text-center">読み込み中…</div>
            )}
          </div>
        </ModalBase>
      </>
    );
  },
});
