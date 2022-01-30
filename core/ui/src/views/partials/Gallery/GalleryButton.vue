<template>
  <button class="flex flex-row items-center p-2 bg-white bg-opacity-0" :class="buttonClasses" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonClasses = computed(() =>
      props.disabled ? ['opacity-25', 'cursor-default'] : ['hover:bg-opacity-100'],
    );

    return { buttonClasses };
  },
});
</script>
