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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Album } from '@/models/Album';
import Button from '@/components/parts/Button.vue';

@Component({
  components: {
    'psk-button': Button,
  },
})
export default class DirectorySelector extends Vue {
  @Prop() private album!: Album;

  public onEntryClicked(id: number) {
    this.$emit('dir-selected', id);
  }
}
</script>
