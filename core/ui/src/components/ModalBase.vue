<template>
  <teleport to="body">
    <transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      @afterLeave="onAfterLeave"
    >
      <div
        class="
          bg-black bg-opacity-75
          fixed
          top-0
          left-0
          w-full
          h-full
          max-h-screen
          flex
          items-center
          justify-center
          transition-opacity
          duration-200
        "
        v-show="open"
        v-if="isOpenInner"
        @click="$emit('clickAway')"
      >
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    clickAway: null,
  },
  setup(props) {
    const isOpenInner = ref(false);
    watchEffect(() => {
      const isOpen = props.open;
      if (isOpen) {
        isOpenInner.value = true;
      }
    });
    const onAfterLeave = () => (isOpenInner.value = false);

    return {
      isOpenInner,
      onAfterLeave,
    };
  },
});
</script>
