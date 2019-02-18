<template lang="pug">
.album-sel-entity
  i.fas.fa-book.fa-5x
  .album-data
    p {{ album.label }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Album } from "../models/Album";

@Component({})
export default class AlbumSelectorEntry extends Vue {
  @Prop() private album!: Album;
}
</script>

<style lang="scss" scoped>
.album-sel-entity {
  width: 100%;
  padding: 8px 16px;
  margin: 4px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.album-data {
  display: block;
  padding-left: 8px;
}
</style>
