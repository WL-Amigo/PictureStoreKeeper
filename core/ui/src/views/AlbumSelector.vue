<template>
  <div class="container mx-auto py-8 px-2">
    <div class="flex flex-col space-y-2">
      <entity v-for="iaap in idAndLabelPairs" :key="iaap.id" :label="iaap.label" @selected="onEntityClicked(iaap.id)" />
    </div>
    <div class="flex flex-row justify-center w-full pt-4">
      <button
        class="flex flex-row items-center justify-center text-xl w-1/2 bg-primary-800 text-white p-2 rounded"
        @click="isCreateAlbumPromptActive = true"
      >
        <add-filled class="mr-2 w-5 h-5" />
        <span>追加する</span>
      </button>
    </div>
    <fade-transition>
      <div
        class="z-modal fixed inset-0 bg-black bg-opacity-50 w-screen h-screen flex flex-row items-center justify-center"
        v-if="isCreateAlbumPromptActive"
        @click="isCreateAlbumPromptActive = false"
      >
        <create-album-prompt @create-album="onCreateAlbumPromptConfirmed" @cancel="isCreateAlbumPromptActive = false" />
      </div>
    </fade-transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import Entity from '../components/AlbumSelectorEntity.vue';
import CreateAlbumPrompt from '../components/CreateAlbumPrompt.vue';
import { AlbumAPIService } from '@/services/AlbumAPIService';
import { IDAndLabelPair } from '@/models/IDAndLabelPair';
import { DialogConfig } from 'buefy/types/components';
import AddFilledIcon from '@/components/icons/AddFilled.vue';
import FadeTransition from '@/components/transitions/Fade.vue';

const CreateAlbumPromptDefinition: DialogConfig & { inputAttrs?: any } = {
  title: 'アルバム作成',
  message: 'アルバム名を入力して下さい(後から変更可能です)',
};

@Component({
  components: {
    entity: Entity,
    'create-album-prompt': CreateAlbumPrompt,
    'add-filled': AddFilledIcon,
    'fade-transition': FadeTransition,
  },
})
export default class AlbumSelector extends Vue {
  @Inject('AlbumAPIService') private m_AlbumAPIService!: AlbumAPIService;

  public idAndLabelPairs: Array<IDAndLabelPair> = [];
  private isCreateAlbumPromptActive: boolean = false;

  async mounted() {
    this.idAndLabelPairs = await this.m_AlbumAPIService.getAllAlbumsAsync();
  }

  public onEntityClicked(id: string): void {
    this.$router.push({ name: 'main-menu', params: { id } });
  }

  public launchCreateAlbumPrompt() {
    this.$dialog.prompt({
      ...CreateAlbumPromptDefinition,
      onConfirm: this.onCreateAlbumPromptConfirmed,
    });
  }

  public async onCreateAlbumPromptConfirmed(label: string) {
    let result = await this.m_AlbumAPIService.createAlbumAsync(label);
    this.isCreateAlbumPromptActive = false;
    // TODO: 失敗時はトーストを表示する
    if (!result) {
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
