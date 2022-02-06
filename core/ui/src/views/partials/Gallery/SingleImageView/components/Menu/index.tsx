import { BoxDotsHorizontalIcon } from '@/components/icons/Boxicons';
import { Popover } from '@/components/Popover';
import { defineComponent, ref } from 'vue';
import * as vt from 'vue-types';
import { GalleryImageViewMoveMenu } from './Move';

export const GalleryImageViewMenuButton = defineComponent({
  name: 'GalleryImageViewMenuButton',
  props: {
    albumId: vt.string().isRequired,
    dirId: vt.number().isRequired,
  },
  emits: {
    moveDir: (destDirId: number) => true,
  },
  setup(props, ctx) {
    const buttonRef = ref<HTMLButtonElement | null>();
    const isOpen = ref(false);

    const open = () => {
      isOpen.value = true;
    };
    const close = () => {
      isOpen.value = false;
    };

    const onSelectDir = (id: number) => {
      ctx.emit('moveDir', id);
    };

    return () => (
      <>
        <button ref={buttonRef} onClick={open}>
          <BoxDotsHorizontalIcon class="w-10 h-10" />
        </button>
        <Popover anchorEl={buttonRef.value} open={isOpen.value} onClickAway={close}>
          <div class="py-2">
            <GalleryImageViewMoveMenu onSelectDir={onSelectDir} albumId={props.albumId} />
          </div>
        </Popover>
      </>
    );
  },
});
