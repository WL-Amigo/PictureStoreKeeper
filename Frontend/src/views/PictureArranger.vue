<template lang="pug">
section.section.fullheight-section
  .container.fullheight-container
    .img-area
      .columns.fullarea
        .column.is-11: image-container(:src="currentHeadImageSrc")
        .column.is-1
          .sub-img-area
            .sub-img(v-for="imgSrc in nextImageSrcs" :key="imgSrc")
              image-container(:src="imgSrc")
    .columns.fullwidth(v-if="album != null")
      .column(v-for="dest in destinationDirs" :key="dest.id")
        button.button.is-fullwidth(@click="onMove(dest.id)") {{ dest.label }}
    .columns.fullwidth(v-if="album != null")
      .column: button.button.is-fullwidth(@click="onSkip()") とりあえずスキップ
      .column: button.button.is-fullwidth.is-static() 破棄する(未実装)
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { Album } from "@/models/Album";
import { DirectoryAPIService } from "@/services/DirectoryAPIService";
import { AlbumAPIService } from "@/services/AlbumAPIService";
import { DirEntry } from "@/models/DirEntry";
import { MoveAPIService } from "@/services/MoveAPIService";
import ContainImageContainer from "@/components/ContainImageContainer.vue";

@Component({
  components: {
    "image-container": ContainImageContainer
  }
})
export default class PictureArranger extends Vue {
  @Inject("AlbumAPIService") private m_AlbumAPIService!: AlbumAPIService;
  @Inject("DirectoryAPIService")
  private m_DirectoryAPIService!: DirectoryAPIService;
  @Inject("MoveAPIService") private m_MoveAPIService!: MoveAPIService;

  private albumId: string = "";
  private dirId: number = -1;
  private album: Album | null = null;
  private imageSrcList: Array<string> = [];

  async mounted() {
    this.albumId = this.$route.params["albumId"];
    this.dirId = parseInt(this.$route.params["dirId"]);
    this.album = await this.m_AlbumAPIService.getAlbumAsync(this.albumId);
    this.imageSrcList = await this.m_DirectoryAPIService.getAllFiles(this.albumId, this.dirId);
  }

  get currentHeadImageSrc() {
    return this.imageSrcList.length >= 1
      ? this.m_DirectoryAPIService.toFileURL(
          this.albumId,
          this.dirId,
          this.imageSrcList[0]
        )
      : "";
  }

  get nextImageSrcs() {
    let subSrcs = this.imageSrcList.slice(1);
    // TODO: もうちょっと同時表示枚数の制御とかしやすくする
    subSrcs = subSrcs.concat(["", "", "", ""]).slice(0, 4);
    return subSrcs.map(fn =>
      fn.length === 0
        ? ""
        : this.m_DirectoryAPIService.toFileURL(this.albumId, this.dirId, fn)
    );
  }

  get destinationDirs() {
    return this.album!.directories
    .map((v, i) => {
      return { ...v, id: i }
    })
    .filter(v => v.id != this.dirId);
  }

  async onMove(destIndex: number) {
    let result = await this.m_MoveAPIService.movePictureAsync(
      this.albumId,
      this.imageSrcList[0],
      this.dirId,
      destIndex
    );
    console.log(result ? "move 成功" : "move 失敗");
    this.imageSrcList.splice(0, 1);
  }

  onSkip() {
    this.imageSrcList.splice(0, 1);
  }
}
</script>

<style lang="scss" scoped>
.fullheight-section {
  height: 100vh;
}

.fullheight-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-area {
  flex-grow: 1;
  width: 100%;
}

.sub-img-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .sub-img {
    height: 25%;
    width: 100%;
  }
}

.fullwidth {
  width: 100%;
}

.fullarea {
  width: 100%;
  height: 100%;
}
</style>
