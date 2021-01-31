<template>
  <router-link
    class="rounded bg-white hover:shadow-md border border-primary-400 flex flex-col items-center p-2 space-y-2 transition-shadow duration-100"
    :to="to"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { RouteLocationRaw } from 'vue-router';

export default defineComponent({
  props: {
    to: {
      type: Object as PropType<RouteLocationRaw>,
      required: true,
    },
  },
});
</script>
