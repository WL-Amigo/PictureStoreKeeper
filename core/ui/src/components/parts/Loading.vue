<template>
  <div class="w-full flex flex-col items-center text-primary-500">
    <circle-dotted class="animate-spin h-24 w-24" />
    <span>{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import CircleDotted from '@/components/icons/TablerIcons/CircleDotted.vue';

export default defineComponent({
  name: 'Loading',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  components: {
    CircleDotted,
  },
});
</script>
