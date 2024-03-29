<template>
  <div class="container mx-auto py-8 px-2 h-full overflow-y-auto">
    <div class="w-full bg-white rounded p-2">
      <loading v-if="album === undefined" label="読み込み中…" />

      <template v-else>
        <div class="pb-4">
          <h1 class="text-xl pb-2">基本設定</h1>
          <line-text-input label="アルバムの名前" v-model="album.label" />
        </div>

        <div class="pb-4 space-y-1">
          <h1 class="text-xl pb-1">ディレクトリ設定</h1>
          <div v-if="album.directories.length === 0" class="w-full bg-gray-200 p-1 flex flex-col items-center">
            <span>ディレクトリが登録されていません。</span>
            <span>下の「追加する」ボタンからディレクトリを追加・設定して下さい。</span>
          </div>
          <template v-else>
            <div v-for="(aEntry, aIdx) in album.directories" :key="aIdx" class="grid grid-cols-5 gap-2">
              <line-text-input label="ラベル" v-model="aEntry.label" />
              <div class="col-span-4">
                <NonEditableField label="転送元・転送先ディレクトリ" v-model="aEntry.fullpath" class="flex-grow">
                  <template v-slot:addons>
                    <AlbumSettingsDirSelector
                      :currentSelectedDir="aEntry.fullpath"
                      @determined="aEntry.fullpath = $event"
                    />
                    <psk-button class="w-8 h-8" padding="p-0" variant="danger" @click="deleteDirEntry(aIdx)">
                      <TrashIcon class="w-5 h-5" />
                    </psk-button>
                  </template>
                </NonEditableField>
              </div>
            </div>
          </template>
          <div class="flex flex-row justify-center w-full">
            <psk-button class="w-1/2" variant="primary" @click="addDirEntry">
              <PlusCircleIcon class="mr-1 w-5 h-5" />
              <span>追加する</span>
            </psk-button>
          </div>
        </div>

        <NonEditableField label="削除予定ディレクトリ" v-model="album.will_be_deleted_dir" class="flex-1">
          <template v-slot:help>
            <div class="flex flex-row items-center text-sm pt-2 text-primary-600">
              <InfoCircleIcon class="w-5 h-5 mr-1" />
              <span>
                「削除する」操作を行った時に、即座に削除するのではなく設定されたディレクトリへ移動させ、後で戻すことが出来るようにします。
              </span>
            </div>
          </template>
          <template v-slot:addons>
            <AlbumSettingsDirSelector
              :currentSelectedDir="album.will_be_deleted_dir"
              @determined="album && (album.will_be_deleted_dir = $event)"
            />
          </template>
        </NonEditableField>

        <div class="flex flex-row justify-end pt-4 space-x-2">
          <psk-button @click="returnToMenu">
            <span>キャンセル</span>
          </psk-button>
          <psk-button variant="primary" @click="saveAlbumAndReturnToMenu">
            <span>保存してメニューに戻る</span>
          </psk-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Loading } from '@/components/parts/Loading';
import { LineTextInput } from '@/components/parts/forms/LineTextInput';
import { PlusCircleIcon, InfoCircleIcon, TrashIcon } from '@/components/icons/HeroIcons';
import { Button } from '@/components/parts/Button';
import { AlbumSettingsDirSelector } from './partials/AlbumSettings/DirSelector';
import { NonEditableField } from '@/components/parts/forms/NonEditable';
import { defineComponent, ref } from 'vue';
import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { useAlbumDataWithUrlId } from '@/compositions/Album';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    Loading,
    LineTextInput,
    'psk-button': Button,
    AlbumSettingsDirSelector,
    NonEditableField,
    PlusCircleIcon,
    InfoCircleIcon,
    TrashIcon,
  },
  setup() {
    const albumAPIService = useDependency(ServiceKeys.AlbumAPIService);
    const router = useRouter();

    const { album, id } = useAlbumDataWithUrlId();

    const returnToMenu = () => {
      if (id.value === undefined) {
        return;
      }

      router?.push({ name: 'main-menu', params: { id: id.value } });
    };

    const isSaving = ref(false);
    const saveAlbum = async () => {
      if (id.value === undefined || album.value === undefined) {
        return;
      }

      isSaving.value = true;
      let result = await albumAPIService.saveAlbumAsync(id.value, album.value);
      isSaving.value = false;
      if (!result) {
        // TODO: トーストシステムを作るか導入して復活させる
        // $toast.open({
        //   message: 'アルバムの保存に失敗しました',
        //   type: 'is-danger',
        // });
        console.error('アルバムの保存に失敗しました');
      }
      return result;
    };
    const saveAlbumAndReturnToMenu = async () => {
      let result = await saveAlbum();
      if (result) {
        returnToMenu();
      }
    };

    const addDirEntry = () => {
      album.value?.directories?.push({ label: '', fullpath: '' });
    };
    const deleteDirEntry = (index: number) => {
      album.value?.directories?.splice(index, 1);
    };

    return {
      album,
      returnToMenu,
      saveAlbum,
      saveAlbumAndReturnToMenu,
      addDirEntry,
      deleteDirEntry,
    };
  },
});
</script>
