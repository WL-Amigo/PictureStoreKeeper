import { AlbumIcon } from '@/components/icons/FlaticonCom/Album';
import { ArrowRightIcon } from '@/components/icons/HeroIcons';
import { vt } from '@/utils/Vue';
import { defineComponent } from 'vue';

export const AlbumEntity = defineComponent({
  props: {
    label: vt.string(),
  },
  emits: {
    selected: () => true,
  },
  setup(props, ctx) {
    const onSelect = () => ctx.emit('selected');

    return () => (
      <div
        class="w-full px-4 py-2 flex flex-row items-center rounded bg-white hover:bg-gray-200 transition-colors duration-100 cursor-pointer group"
        onClick={onSelect}
      >
        <div class="flex-grow flex flex-row items-center">
          <AlbumIcon class="w-20 h-20 mr-4" />
          <span class="text-xl">{props.label}</span>
        </div>
        <div class="flex flex-row items-center">
          <div class="p-4">
            <ArrowRightIcon class="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  },
});
