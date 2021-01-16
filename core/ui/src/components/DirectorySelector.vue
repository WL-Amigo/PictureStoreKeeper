<template lang="pug">
.columns.is-centered.is-multiline
  .column.is-one-quarter(v-for="(dirEntry, dIdx) in album.directories" :key="dIdx" @click="onEntryClicked(dIdx)")
    .fullwidth-button.dir-button {{ dirEntry.label }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Album } from '@/models/Album';

@Component({})
export default class DirectorySelector extends Vue {
  @Prop() private album!: Album;

  public onEntryClicked(id: number) {
    this.$emit('dir-selected', id);
  }
}
</script>

<style lang="scss" scoped>
.dir-button {
  color: white;
  background-color: brown;
}
</style>
