import { vt } from '@/utils/Vue';
import { defineComponent } from 'vue';

export const NonEditableField = defineComponent({
  props: {
    modelValue: vt.string().def(''),
    label: vt.string().def(''),
  },
  setup(props, ctx) {
    return () => (
      <div class="flex flex-col">
        {props.label.length > 0 && <label class="text-sm">{props.label}</label>}
        <div class="flex flex-row gap-x-1">
          <div class="px-2 py-1 text-gray-600 flex-1">{props.modelValue}</div>
          {ctx.slots.addons?.()}
        </div>
        {ctx.slots.help?.()}
      </div>
    );
  },
});
