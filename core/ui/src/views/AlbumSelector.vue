<template lang="pug">
section.section
  .container
    entity(v-for="iaap in idAndLabelPairs" :key="iaap.id" :label="iaap.label" @click.native="onEntityClicked(iaap.id)")
    .fullwidth-button.add-button(@click="isCreateAlbumPromptActive = true")
      span.icon: i.fas.fa-plus-circle
      span 追加する
  b-modal(:active.sync="isCreateAlbumPromptActive" has-modal-card)
    create-album-prompt(@create-album="onCreateAlbumPromptConfirmed")
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import Entity from "../components/AlbumSelectorEntity.vue";
import CreateAlbumPrompt from "../components/CreateAlbumPrompt.vue";
import { AlbumAPIService } from "@/services/AlbumAPIService";
import { IDAndLabelPair } from "@/models/IDAndLabelPair";
import { DialogConfig } from "buefy/types/components";

const CreateAlbumPromptDefinition: DialogConfig & { inputAttrs?: any } = {
  title: "アルバム作成",
  message: "アルバム名を入力して下さい(後から変更可能です)"
};

@Component({
  components: {
    'entity': Entity,
    'create-album-prompt': CreateAlbumPrompt
  }
})
export default class AlbumSelector extends Vue {
  @Inject("AlbumAPIService") private m_AlbumAPIService!: AlbumAPIService;

  public idAndLabelPairs: Array<IDAndLabelPair> = [];
  private isCreateAlbumPromptActive: boolean = false;

  async mounted() {
    this.idAndLabelPairs = await this.m_AlbumAPIService.getAllAlbumsAsync();
  }

  public onEntityClicked(id: string): void {
    this.$router.push({ name: "main-menu", params: { id } });
  }

  public launchCreateAlbumPrompt() {
    this.$dialog.prompt({
      ...CreateAlbumPromptDefinition,
      onConfirm: this.onCreateAlbumPromptConfirmed
    });
  }

  public async onCreateAlbumPromptConfirmed(label: string) {
    let result = await this.m_AlbumAPIService.createAlbumAsync(label);
    this.isCreateAlbumPromptActive = false;
    // TODO: 失敗時はトーストを表示する
    if(!result) {
      return;
    }

    this.idAndLabelPairs = await this.m_AlbumAPIService.getAllAlbumsAsync();
  }
}
</script>

<style lang="scss" scoped>
.add-button {
  margin: 4px;
  background-color: brown;
  color: white;
  &:hover {
    background-color: lighten($color: brown, $amount: 6);
    cursor: pointer;
  }
}
</style>
