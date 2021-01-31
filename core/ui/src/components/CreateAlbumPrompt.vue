<template>
  <div class="container">
    <div class="w-full lg:w-2/3 lg:mx-auto p-4 space-y-4 bg-white rounded-md shadow-lg" @click.stop="">
      <h1 class="text-2xl">アルバムを作る</h1>
      <div class="flex flex-col">
        <label class="text-sm">アルバム名</label>
        <input
          type="text"
          class="px-2 py-1 border focus:border-gray-700 w-full border-gray-300 rounded focus:outline-none text-gray-600"
          v-model="albumLabel"
        />
        <div class="flex flex-row items-center text-sm pt-2 text-primary-600">
          <info class="w-5 h-5 mr-1" />
          <span> アルバム名は後から変更できます </span>
        </div>
      </div>
      <div class="flex flex-row justify-end space-x-2">
        <button class="border border-gray-400 rounded px-4 py-1" @click="$emit('cancel')">キャンセル</button>
        <button class="bg-primary-800 text-white rounded px-4 py-1" @click="onCreateButtonPushed">作成</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import InfoIcon from './icons/HeroIcons/InfoFilled.vue';

export default defineComponent({
  name: 'CreateAlbumPrompt',
  components: {
    info: InfoIcon,
  },
  emits: {
    'create-album': null,
    cancel: null,
  },
  setup(_, ctx) {
    const albumLabel = ref('');
    const onCreateButtonPushed = () => {
      ctx.emit('create-album', albumLabel.value);
    };

    return {
      albumLabel,
      onCreateButtonPushed,
    };
  },
});
</script>
