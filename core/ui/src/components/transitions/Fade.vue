<template>
  <transition
    enter-class="opacity-0"
    enter-active-class="transition duration-100 transform-gpu"
    leave-to-class="opacity-0"
    leave-active-class="transition duration-100 transform-gpu"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  name: 'Fade',
};
</script>
