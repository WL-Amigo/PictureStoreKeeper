<template>
  <button
    class="flex flex-row items-center justify-center border box-content rounded"
    :class="allClasses"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';

type Variant = 'default' | 'primary' | 'danger';

export default defineComponent({
  props: {
    variant: {
      type: String as PropType<Variant>,
      default: 'default',
    },
    padding: {
      type: String,
    },
  },
  setup(props) {
    const colorClasses = computed(() => {
      switch (props.variant) {
        case 'default':
          return ['bg-white', 'hover:bg-gray-100', 'border-gray-400'];
        case 'primary':
          return ['bg-primary-800', 'hover:bg-primary-700', 'border-primary-800', 'text-white'];
        case 'danger':
          return ['bg-red-600', 'hover:bg-red-500', 'border-red-600', 'text-white'];
      }
    });

    const paddingClasses = computed(() => props.padding ?? 'py-1 px-4');

    const allClasses = computed(() => {
      return colorClasses.value.concat([paddingClasses.value]);
    });

    return { allClasses };
  },
});
</script>
