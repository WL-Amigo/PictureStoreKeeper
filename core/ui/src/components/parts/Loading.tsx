import { vt } from '@/utils/Vue';
import { defineComponent } from 'vue';
import { CircleDotted } from '../icons/TablerIcons/CircleDotted';

export const Loading = defineComponent({
  props: {
    label: vt.string().isRequired,
  },
  setup(props) {
    return () => (
      <div class="w-full flex flex-col items-center text-primary-500">
        <CircleDotted class="animate-spin h-24 w-24" />
        <span>{props.label}</span>
      </div>
    );
  },
});
