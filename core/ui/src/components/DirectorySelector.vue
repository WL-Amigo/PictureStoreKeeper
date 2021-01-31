<template>
  <div class="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
    <psk-button
      v-for="(dirEntry, dIdx) in album.directories"
      :key="dIdx"
      @click="onEntryClicked(dIdx)"
      variant="primary"
      class="text-xl"
    >
      {{ dirEntry.label }}
    </psk-button>
  </div>
</template>

<script lang="ts">
import { Album } from '@/models/Album';
import Button from '@/components/parts/Button.vue';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'DirectorySelector',
  components: {
    'psk-button': Button,
  },
  props: {
    album: {
      type: Object as PropType<Album>,
      required: true,
    },
  },
  emits: {
    'dir-selected': null,
  },
  setup(_, ctx) {
    const onEntryClicked = (id: number) => {
      ctx.emit('dir-selected', id);
    };

    return { onEntryClicked };
  },
});
</script>
