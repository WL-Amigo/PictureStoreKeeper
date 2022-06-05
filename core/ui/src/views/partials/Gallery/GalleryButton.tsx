import { vt } from '@/utils/Vue';
import { windi } from '@/windi';
import clsx from 'clsx';
import { defineComponent, computed, DefineComponent, ButtonHTMLAttributes } from 'vue';

export const GalleryButton = defineComponent({
  props: {
    disabled: vt.bool().def(false),
  },
  setup(props, ctx) {
    const buttonClasses = computed(() =>
      props.disabled ? [windi`opacity-25 cursor-default`] : [windi`bg-opacity-0 hover:bg-opacity-100`],
    );

    return () => (
      <button
        class={clsx(windi`flex flex-row items-center p-2 bg-white`, buttonClasses.value)}
        disabled={props.disabled}
      >
        {ctx.slots.default?.()}
      </button>
    );
  },
}) as DefineComponent<ButtonHTMLAttributes>;
