<template lang="pug">
section.section
  .container
    .buttons-container
      router-link.button.is-primary.button-item(:to="{name: 'directory-selector-before-arrange', params: { id: id }}") 画像を整理する
      router-link.button.is-primary.button-item(:to="{name: 'gallery', params: { id: id }}") ギャラリー
      router-link.button.is-primary.button-item(:to="{name: 'album-settings', params: { id: id }}") 設定
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Album } from "../models/Album";

@Component({})
export default class MainMenu extends Vue {
  public id: string = '';

  mounted() {
    this.id = this.$route.params['id'];
  }
}
</script>

<style lang="scss" scoped>
.buttons-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .button-item {
    width: 50%;
    margin: 8px;
    padding: 40px 0;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 2rem;
  }
}
</style>
