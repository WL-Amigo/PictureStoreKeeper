<template>
  <div class="container mx-auto py-8 px-2">
    <h1 class="text-xl pb-2">転送元を選んで下さい</h1>
    <dir-selector :album="album" @dir-selected="onSelected" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import DirectorySelector from '@/components/DirectorySelector.vue';
import { AlbumAPIService } from '@/services/AlbumAPIService';
import { Album } from '@/models/Album';

@Component({
  components: {
    'dir-selector': DirectorySelector,
  },
})
export default class DirSelectorBeforeArrange extends Vue {
  private album: Album | null = null;
  @Inject('AlbumAPIService') private m_albumAPIService!: AlbumAPIService;

  async mounted() {
    this.album = await this.m_albumAPIService.getAlbumAsync(this.$route.params['id']);
  }

  public onSelected(id: number) {
    this.$router.push({ name: 'arrange', params: { albumId: this.$route.params['id'], dirId: id.toString() } });
  }
}
</script>
