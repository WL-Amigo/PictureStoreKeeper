import { BoxDotsHorizontalIcon, CloseIcon } from '@/components/icons/Boxicons';
import { Popover } from '@/components/Popover';
import { vt } from '@/utils/Vue';
import { defineComponent, ref } from 'vue';
import { GalleryBulkOperations } from '../viewModels/BulkOperation';
import { GalleryButton } from './GalleryButton';
import { GalleryImageViewMoveMenu } from './SingleImageView/components/Menu/Move';
import { GalleryImageViewTrashMenu } from './SingleImageView/components/Menu/Trash';

export const GalleryBulkOperationButton = defineComponent({
  props: {
    albumId: vt.string().isRequired,
    dirId: vt.number().isRequired,
  },
  emits: {
    dispatchBulkAction: (_op: GalleryBulkOperations) => true,
    exitMultiSelect: () => true,
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
      const op: GalleryBulkOperations = {
        type: 'move',
        destDirIndex: id,
      };
      ctx.emit('dispatchBulkAction', op);
    };
    const onConfirmMoveToTrash = () => {
      const op: GalleryBulkOperations = {
        type: 'trash',
      };
      ctx.emit('dispatchBulkAction', op);
    };
    const onExitMultiSelect = () => ctx.emit('exitMultiSelect');

    return () => (
      <>
        <GalleryButton ref={buttonRef} onClick={open}>
          <div class="flex flex-row gap-x-2">
            <BoxDotsHorizontalIcon class="w-6 h-6" />
            <span>一括操作</span>
          </div>
        </GalleryButton>
        <Popover anchorEl={buttonRef.value} open={isOpen.value} onClickAway={close}>
          <div class="py-2 flex flex-col gap-y-2 w-60">
            <GalleryImageViewMoveMenu onSelectDir={onSelectDir} albumId={props.albumId} />
            <GalleryImageViewTrashMenu onConfirmed={onConfirmMoveToTrash} />
            <button
              class="px-4 py-2 flex flex-row items-center gap-x-2 bg-white hover:bg-gray-100"
              onClick={onExitMultiSelect}
            >
              <CloseIcon class="w-6 h-6" />
              一括操作を終了
            </button>
          </div>
        </Popover>
      </>
    );
  },
});
