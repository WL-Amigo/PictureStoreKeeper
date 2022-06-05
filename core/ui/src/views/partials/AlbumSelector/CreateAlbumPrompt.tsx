import { InfoCircleIcon } from '@/components/icons/HeroIcons';
import { stopPropagationHandler } from '@/utils/EventHandlers';
import { defineComponent, ref } from 'vue';

export const CreateAlbumPrompt = defineComponent({
  emits: {
    createAlbum: (label: string) => true,
    cancel: () => true,
  },
  setup(_, ctx) {
    const albumLabel = ref('');
    const setAlbumLabel = (ev: Event) => {
      if (ev instanceof InputEvent && ev.target instanceof HTMLInputElement) {
        albumLabel.value = ev.target.value;
      }
    };
    const createAlbum = () => {
      ctx.emit('createAlbum', albumLabel.value);
    };
    const emitCancel = () => {
      ctx.emit('cancel');
    };

    return () => (
      <div class="container">
        <div
          class="w-full lg:w-2/3 lg:mx-auto p-4 space-y-4 bg-white rounded-md shadow-lg"
          onClick={stopPropagationHandler}
        >
          <h1 class="text-2xl">アルバムを作る</h1>
          <div class="flex flex-col">
            <label class="text-sm">アルバム名</label>
            <input
              type="text"
              class="px-2 py-1 border focus:border-gray-700 w-full border-gray-300 rounded focus:outline-none text-gray-600"
              value={albumLabel.value}
              onInput={setAlbumLabel}
            />
            <div class="flex flex-row items-center text-sm pt-2 text-primary-600">
              <InfoCircleIcon class="w-5 h-5 mr-1" />
              <span>アルバム名は後から変更できます</span>
            </div>
          </div>
          <div class="flex flex-row justify-end space-x-2">
            <button class="border border-gray-400 rounded px-4 py-1" onClick={emitCancel}>
              キャンセル
            </button>
            <button class="bg-primary-800 text-white rounded px-4 py-1" onClick={createAlbum}>
              作成
            </button>
          </div>
        </div>
      </div>
    );
  },
});
