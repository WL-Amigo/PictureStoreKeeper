<template>
  <div class="w-screen h-screen grid grid-rows-6 grid-cols-8">
    <!-- main image display area -->
    <div class="row-span-5 col-span-7">
      <img :src="currentHeadImageSrc" class="w-full h-full object-scale-down" />
    </div>

    <!-- look-forward images area -->
    <div class="row-span-5">
      <div class="flex flex-col h-full">
        <div class="w-full h-12 flex-shrink">
          <!-- TODO: quit more look-forward button -->
        </div>
        <div class="w-full flex-grow grid grid-cols-1 grid-rows-5">
          <img
            v-for="(imgSrc, idx) in nextImageSrcs"
            :key="imgSrc"
            :src="imgSrc"
            class="w-full flex-1 object-cover"
            @mouseenter="onHoverSubImg(idx)"
            @mouseleave="onUnhoverSubImg(idx)"
          />
        </div>
        <div class="w-full h-12 flex-shrink">
          <!-- TODO: more look-forward button -->
        </div>
      </div>
    </div>

    <!-- operation buttons area -->
    <div class="col-span-8">
      <div v-if="album" class="container mx-auto h-full grid grid-rows-3">
        <div class="row-span-2 w-full flex flex-row flex-wrap justify-center">
          <div class="w-1/6 px-1 flex flex-row items-center" v-for="dest in destinationDirs" :key="dest.id">
            <psk-button variant="primary" class="w-full" @click="onMove(dest.id)">
              {{ dest.label }}
            </psk-button>
          </div>
        </div>
        <div class="w-full flex flex-row items-center justify-center">
          <div class="w-1/4 px-1 flex">
            <psk-button class="w-full" @click="onSkip()">とりあえずスキップ</psk-button>
          </div>
          <div class="w-1/4 px-1 flex">
            <psk-button class="w-full" variant="primary" @click="onDelete()">破棄する</psk-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import { Album } from '@/models/Album';
import { DirectoryAPIService } from '@/services/DirectoryAPIService';
import { AlbumAPIService } from '@/services/AlbumAPIService';
import { DirEntry } from '@/models/DirEntry';
import { MoveAPIService } from '@/services/MoveAPIService';
import ContainImageContainer from '@/components/ContainImageContainer.vue';
import Button from '@/components/parts/Button.vue';

const SubImgCount = 5;

@Component({
  components: {
    'image-container': ContainImageContainer,
    'psk-button': Button,
  },
})
export default class PictureArranger extends Vue {
  @Inject('AlbumAPIService') private m_AlbumAPIService!: AlbumAPIService;
  @Inject('DirectoryAPIService')
  private m_DirectoryAPIService!: DirectoryAPIService;
  @Inject('MoveAPIService') private m_MoveAPIService!: MoveAPIService;

  private albumId: string = '';
  private dirId: number = -1;
  private album: Album | null = null;
  private imageSrcList: Array<string> = [];
  // 画像間でカーソルを動かした時に不安定になるのを防止するため、先読み画像1つ1つに対してホバー中かどうかを保持している
  private subImgHoveringStates: Array<boolean> = Array.from(Array(SubImgCount), () => false);

  async mounted() {
    this.albumId = this.$route.params['albumId'];
    this.dirId = parseInt(this.$route.params['dirId']);
    this.album = await this.m_AlbumAPIService.getAlbumAsync(this.albumId);
    this.imageSrcList = await this.m_DirectoryAPIService.getAllFiles(this.albumId, this.dirId);
  }

  get currentHeadImageSrc() {
    let currentHeadImageIndex = this.subImgHoveringStates.indexOf(true);
    currentHeadImageIndex = currentHeadImageIndex == -1 ? 0 : currentHeadImageIndex + 1;
    return this.imageSrcList.length >= 1
      ? this.m_DirectoryAPIService.toFileURL(this.albumId, this.dirId, this.imageSrcList[currentHeadImageIndex])
      : '';
  }

  get nextImageSrcs() {
    let subSrcs = this.imageSrcList.slice(1);
    // TODO: もうちょっと同時表示枚数の制御とかしやすくする
    subSrcs = subSrcs.concat(Array.from(Array(SubImgCount), () => '')).slice(0, SubImgCount);
    return subSrcs.map(fn =>
      fn.length === 0 ? '' : this.m_DirectoryAPIService.toFileURL(this.albumId, this.dirId, fn),
    );
  }

  get destinationDirs() {
    return this.album!.directories.map((v, i) => {
      return { ...v, id: i };
    }).filter(v => v.id != this.dirId);
  }

  async onMove(destIndex: number) {
    let result = await this.m_MoveAPIService.movePictureAsync(
      this.albumId,
      this.imageSrcList[0],
      this.dirId,
      destIndex,
    );
    console.log(result ? 'move 成功' : 'move 失敗');
    this.imageSrcList.splice(0, 1);
  }

  async onDelete() {
    let result = await this.m_MoveAPIService.deletePictureAsync(this.albumId, this.imageSrcList[0], this.dirId);
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
