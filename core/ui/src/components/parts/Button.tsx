import { vt } from '@/utils/Vue';
import { windi } from '@/windi';
import clsx from 'clsx';
import { ButtonHTMLAttributes, Component, computed, DefineComponent, defineComponent } from 'vue';

const AllVariant = ['default', 'primary', 'danger'] as const;
type Variant = typeof AllVariant[keyof typeof AllVariant];

interface Props extends ButtonHTMLAttributes {
  variant?: Variant;
  padding?: string;
}
export const Button = defineComponent({
  props: {
    variant: vt.oneOf(AllVariant),
    padding: vt.string(),
  },
  setup(props, ctx) {
    const colorClasses = computed(() => {
      const variant = props.variant ?? 'default';
      switch (variant) {
        case 'default':
          return ['bg-white', 'hover:bg-gray-100', 'border-gray-400'];
        case 'primary':
          return ['bg-primary-800', 'hover:bg-primary-700', 'border-primary-800', 'text-white'];
        case 'danger':
          return ['bg-red-600', 'hover:bg-red-500', 'border-red-600', 'text-white'];
        default:
          return [];
      }
    });

    const paddingClasses = computed(() => props.padding ?? 'py-1 px-4');

    const allClasses = computed(() => {
      return colorClasses.value.concat([paddingClasses.value]);
    });

    return () => (
      <button
        class={clsx(
          windi`flex flex-row items-center justify-center border box-content rounded whitespace-nowrap disabled:opacity-50`,
          allClasses.value,
        )}
      >
        {ctx.slots.default?.()}
      </button>
    );
  },
}) as DefineComponent<Props>;
