<template lang="pug">
section.section
  .container.container-custom
    b-loading(:active.sync="isLoading")
    div(v-if="album != null")
      b-field(label="アルバムの名前")
        b-input(v-model="album.label")
      b-field(label="未整理ディレクトリ")
        b-input(v-model="album.source.fullpath")
      b-field(label="整理先ディレクトリ")
      .columns.arranged-entity-container(v-for="(aEntry, aIdx) in album.arranged" :key="aIdx")
        .column.is-2: b-field(label="ラベル"): b-input(v-model="aEntry.label")
        .column.is-9: b-field(label="パス"):   b-input(v-model="aEntry.fullpath")
        .column.is-1: .buttons-container
          button.button.is-danger(@click="deleteArrangedDirEntry(aIdx)")
            span.icon: i.fas.fa-trash-alt
      .columns 
        .column: button.button.is-fullwidth.add-entity-button(@click="addArrangedDirEntry()")
          span.icon: i.fas.fa-plus-circle
          span 追加する
      button.button(@click="saveAlbumAndReturnToMenu") 保存してメニューに戻る
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { IDAndAlbumPair } from "../models/IDAndAlbumPair";
import { Album } from "../models/Album";
import { AlbumAPIService } from "@/services/AlbumAPIService";

@Component({})
export default class AlbumSettings extends Vue {
  private id: string = "";
  private album: Album | null = null;
  private isSaving: boolean = false;
  @Inject("AlbumAPIService") private m_albumAPIService!: AlbumAPIService;

  async mounted() {
    console.log("mounted");
    this.id = this.$route.params["id"];
    this.album = await this.m_albumAPIService.getAlbumAsync(this.id);
  }

  async saveAlbum() {
    this.isSaving = true;
    let result = await this.m_albumAPIService.saveAlbumAsync(
      this.id,
      this.album!
    );
    this.isSaving = false;
    if(!result) {
      this.$toast.open({
        message: 'アルバムの保存に失敗しました',
        type: 'is-danger'
      });
    }
    return result;
  }

  async saveAlbumAndReturnToMenu() {
    let result = await this.saveAlbum();
    if (result) {
      this.$router.push({ name: "main-menu", params: { id: this.id } });
    }
  }

  addArrangedDirEntry() {
    this.album!.arranged.push({ label: "", fullpath: "" });
  }

  deleteArrangedDirEntry(index: number) {
    this.album!.arranged.splice(index, 1);
  }

  get isLoading() {
    return this.album == null || this.isSaving;
  }
}
</script>

<style lang="scss" scoped>
.arranged-entity-container {
  border: 1px dashed #AAA;
  border-radius: 8px;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 20px;
}

.add-entity-button {
  background-color: brown;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.buttons-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
</style>
