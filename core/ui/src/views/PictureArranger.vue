<template lang="pug">
section.section.fullheight-section
  .container.fullheight-container
    .img-area
      .columns.fullarea
        .column.is-11: image-container(:src="currentHeadImageSrc")
        .column.is-1
          .sub-img-area
            .sub-img(v-for="(imgSrc, idx) in nextImageSrcs" :key="imgSrc")
              image-container(:src="imgSrc" @mouseenter.native="onHoverSubImg(idx)" @mouseleave.native="onUnhoverSubImg(idx)" sizing="cover")
    .columns.fullwidth(v-if="album != null")
      .column(v-for="dest in destinationDirs" :key="dest.id")
        button.button.is-fullwidth(@click="onMove(dest.id)") {{ dest.label }}
    .columns.fullwidth(v-if="album != null")
      .column: button.button.is-fullwidth(@click="onSkip()") とりあえずスキップ
      .column: button.button.is-fullwidth(@click="onDelete()") 破棄する
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { Album } from "@/models/Album";
import { DirectoryAPIService } from "@/services/DirectoryAPIService";
import { AlbumAPIService } from "@/services/AlbumAPIService";
import { DirEntry } from "@/models/DirEntry";
import { MoveAPIService } from "@/services/MoveAPIService";
import ContainImageContainer from "@/components/ContainImageContainer.vue";

const SubImgCount = 5;

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
  // 画像間でカーソルを動かした時に不安定になるのを防止するため、先読み画像1つ1つに対してホバー中かどうかを保持している
  private subImgHoveringStates: Array<boolean> = Array.from(Array(SubImgCount), () => false);

  async mounted() {
    this.albumId = this.$route.params["albumId"];
    this.dirId = parseInt(this.$route.params["dirId"]);
    this.album = await this.m_AlbumAPIService.getAlbumAsync(this.albumId);
    this.imageSrcList = await this.m_DirectoryAPIService.getAllFiles(this.albumId, this.dirId);
  }

  get currentHeadImageSrc() {
    let currentHeadImageIndex = this.subImgHoveringStates.indexOf(true);
    currentHeadImageIndex = currentHeadImageIndex == -1 ? 0 : currentHeadImageIndex + 1;
    return this.imageSrcList.length >= 1
      ? this.m_DirectoryAPIService.toFileURL(
          this.albumId,
          this.dirId,
          this.imageSrcList[currentHeadImageIndex]
        )
      : "";
  }

  get nextImageSrcs() {
    let subSrcs = this.imageSrcList.slice(1);
    // TODO: もうちょっと同時表示枚数の制御とかしやすくする
    subSrcs = subSrcs.concat(Array.from(Array(SubImgCount), () => "")).slice(0, SubImgCount);
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

  async onDelete() {
    let result = await this.m_MoveAPIService.deletePictureAsync(
      this.albumId,
      this.imageSrcList[0],
      this.dirId
    );
    this.imageSrcList.splice(0, 1);
  }

  onSkip() {
    this.imageSrcList.splice(0, 1);
  }

  onHoverSubImg(index: number) {
    this.subImgHoveringStates.splice(index, 1, true);
  }

  onUnhoverSubImg(index: number) {
    this.subImgHoveringStates.splice(index, 1, false);
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
    height: 20%;
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