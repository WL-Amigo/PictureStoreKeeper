import { vt } from '@/utils/Vue';
import { Album } from '@psk/frontend-interfaces';
import { defineComponent } from 'vue';
import { Button } from './parts/Button';

export const DirInAlbumSelector = defineComponent({
  name: 'DirectorySelector',
  props: {
    album: vt.object<Album>().isRequired,
  },
  emits: {
    dirSelected: (id: number) => true,
  },
  setup(props, ctx) {
    const onEntryClicked = (id: number) => {
      ctx.emit('dirSelected', id);
    };

    return () => (
      <div class="w-full grid grid-cols-1 md: grid-cols-4 gap-2">
        {props.album.directories.map((dirEntry, dIdx) => (
          <Button key={dIdx} onClick={() => onEntryClicked(dIdx)} variant="primary" class="text-xl">
            {dirEntry.label}
          </Button>
        ))}
      </div>
    );
  },
});
