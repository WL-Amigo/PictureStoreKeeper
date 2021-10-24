import { IDAndLabelPair } from '@/models/IDAndLabelPair';
import { defineComponent } from 'vue';
import * as vt from 'vue-types';

export const SingleSelect = defineComponent({
  props: {
    modelValue: vt.string().isRequired,
    options: vt.arrayOf(vt.object<IDAndLabelPair>()).isRequired,
  },
  emits: {
    'update:modelValue': (key: string) => true,
  },
  setup(props, ctx) {
    const onChange = (ev: Event) => {
      if (!(ev.target instanceof HTMLSelectElement)) {
        return;
      }
      ctx.emit('update:modelValue', ev.target.value);
    };

    return () => (
      <select
        class="py-1 px-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        value={props.modelValue}
        onInput={onChange}
      >
        {props.options.map((opt) => (
          <option value={opt.id}>{opt.label}</option>
        ))}
      </select>
    );
  },
});
