<template lang="pug">
.modal-card
  header.modal-card-head
    p.modal-card-title アルバムを作る
  section.modal-card-body
    b-field(label="アルバム名")
      b-input(v-model="albumLabel")
    p アルバム名は後から変更できます
  footer.modal-card-foot
    button.button.is-primary(@click="onCreateButtonPushed") 作成
    button.button キャンセル
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";

@Component({})
export default class CreateAlbumPrompt extends Vue {
  private albumLabel: string = "";

  private onCreateButtonPushed() {
    this.$emit('create-album', this.albumLabel);
  }
}
</script>
