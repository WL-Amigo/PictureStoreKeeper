import { ModalBase } from '@/components/ModalBase';
import { vt } from '@/utils/Vue';
import { defineComponent, ref } from 'vue';
import Button from '@/components/parts/Button.vue';
import { BoxFolderIcon } from '@/components/icons/Boxicons';
import { ConfigDirSelector } from '@/components/config/DirectorySelector';

export const AlbumSettingsDirSelector = defineComponent({
  props: {
    currentSelectedDir: vt.string().isRequired,
  },
  emits: {
    determined: (path: string) => true,
  },
  setup(props, ctx) {
    const localSelectedDir = ref(props.currentSelectedDir);
    const isOpenSelector = ref(false);
    const onOpenSelector = () => {
      localSelectedDir.value = props.currentSelectedDir;
      isOpenSelector.value = true;
    };
    const onDetermined = (path: string) => {
      ctx.emit('determined', path);
      isOpenSelector.value = false;
    };
    const onCancelled = () => {
      isOpenSelector.value = false;
    };

    return () => (
      <>
        <Button class="w-8 h-8" padding="p-0" variant="primary" onClick={onOpenSelector}>
          <BoxFolderIcon />
        </Button>
        <ModalBase open={isOpenSelector.value} onClickAway={onCancelled}>
          <SelectorModalBody current={localSelectedDir.value} onDetermined={onDetermined} onCancel={onCancelled} />
        </ModalBase>
      </>
    );
  },
});

const SelectorModalBody = defineComponent({
  props: {
    current: vt.string().isRequired,
  },
  emits: {
    determined: (path: string) => true,
    cancel: () => true,
  },
  setup(props, ctx) {
    const localSelectedDir = ref(props.current);
    const onSelected = (path: string) => (localSelectedDir.value = path);
    const onDetermined = () => ctx.emit('determined', localSelectedDir.value);
    const onCancelled = () => ctx.emit('cancel');

    return () => (
      <div class="p-4 rounded bg-white flex flex-col gap-y-4 h-[90%] w-200" onClick={(e) => e.stopPropagation()}>
        <h2 class="text-xl">ディレクトリ選択</h2>
        <ConfigDirSelector selectedDir={localSelectedDir.value} onSelect={onSelected} class="flex-1" />
        <div class="w-full flex flex-row justify-end gap-x-2">
          <Button onClick={onCancelled}>キャンセル</Button>
          <Button variant="primary" onClick={onDetermined}>決定</Button>
        </div>
      </div>
    );
  },
});
