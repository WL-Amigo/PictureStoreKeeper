import { TrashIcon } from '@/components/icons/Boxicons';
import { ModalBase } from '@/components/ModalBase';
import { Button } from '@/components/parts/Button';
import { defineComponent, ref } from 'vue';
import { MenuButtonClasses } from './Styles';

export const GalleryImageViewTrashMenu = defineComponent({
  emits: {
    confirmed: () => true,
  },
  setup(_, ctx) {
    const isOpenState = ref(false);
    const onOpenDialog = () => {
      isOpenState.value = true;
    };
    const onCloseDialog = () => {
      isOpenState.value = false;
    };
    const onConfirmed = () => {
      ctx.emit('confirmed');
      onCloseDialog();
    };

    return () => (
      <>
        <button class={MenuButtonClasses} onClick={onOpenDialog}>
          <TrashIcon class="w-6 h-6" />
          破棄
        </button>
        <ModalBase open={isOpenState.value} onClickAway={onCloseDialog}>
          <div class="p-2 bg-white rounded flex flex-col gap-y-2">
            <h2>選択された画像を破棄予定フォルダへ移動させます</h2>
            <div class="flex flex-row gap-x-2 justify-end">
              <Button onClick={onCloseDialog}>キャンセル</Button>
              <Button variant="danger" onClick={onConfirmed}>
                破棄
              </Button>
            </div>
          </div>
        </ModalBase>
      </>
    );
  },
});
