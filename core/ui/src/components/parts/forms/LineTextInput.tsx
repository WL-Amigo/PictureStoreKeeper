import { isNotNullOrEmptyString } from '@/utils/Emptiness';
import { vt } from '@/utils/Vue';
import { defineComponent } from 'vue';

export const LineTextInput = defineComponent({
  props: {
    modelValue: vt.string(),
    label: vt.string(),
  },
  emits: {
    'update:modelValue': (value: string) => true,
  },
  setup(props, ctx) {
    const onInput = (e: Event) => {
      if (e.target instanceof HTMLInputElement) {
        ctx.emit('update:modelValue', e.target.value);
      }
    };

    return () => (
      <div class="flex flex-col">
        {isNotNullOrEmptyString(props.label) && <label class="text-sm">{props.label}</label>}
        <input
          type="text"
          class="px-2 py-1 border focus:border-gray-700 w-full border-gray-300 rounded focus:outline-none text-gray-600"
          value={props.modelValue}
          onInput={onInput}
        />
        {ctx.slots.help?.()}
      </div>
    );
  },
});
