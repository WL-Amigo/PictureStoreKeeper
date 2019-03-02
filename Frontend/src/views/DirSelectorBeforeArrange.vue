<template lang="pug">
section.section
  .container
    p.is-size-4.has-text-centered 転送元のディレクトリを選んで下さい
    dir-selector(:album="album" @dir-selected="onSelected")
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import DirectorySelector from "@/components/DirectorySelector.vue";
import { AlbumAPIService } from '@/services/AlbumAPIService';
import { Album } from "@/models/Album";

@Component({
  components: {
    "dir-selector": DirectorySelector
  }
})
export default class DirSelectorBeforeArrange extends Vue {
  private album: Album | null = null;
  @Inject("AlbumAPIService") private m_albumAPIService!: AlbumAPIService;

  async mounted() {
    this.album = await this.m_albumAPIService.getAlbumAsync(this.$route.params["id"]);
  }

  public onSelected(id: number) {
    this.$router.push({ name: 'arrange', params: { albumId: this.$route.params["id"] , dirId: id.toString() }});
  }
}
</script>