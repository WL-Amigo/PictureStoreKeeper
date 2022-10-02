import { ChevronLeftIcon } from '@/components/icons/HeroIcons';
import { TablerFolderIcon } from '@/components/icons/TablerIcons/Folder';
import { TablerGearIcon } from '@/components/icons/TablerIcons/Gear';
import { TablerPhotoIcon } from '@/components/icons/TablerIcons/Photo';
import { Button } from '@/components/parts/Button';
import { useAlbumIdFromUrl } from '@/compositions/Album';
import { vt } from '@/utils/Vue';
import { defineComponent } from 'vue';
import { RouteLocationRaw, RouterLink, useRouter } from 'vue-router';

const MainMenuLink = defineComponent({
  props: {
    to: vt.custom<RouteLocationRaw>(() => true).isRequired,
  },
  setup(props, ctx) {
    return () => (
      <RouterLink
        class="rounded bg-white hover:shadow-md border border-primary-400 flex flex-col items-center p-2 space-y-2 transition-shadow duration-100"
        to={props.to}
      >
        {ctx.slots.default?.()}
      </RouterLink>
    );
  },
});

export const MainMenu = defineComponent(() => {
  const router = useRouter();
  const id = useAlbumIdFromUrl();

  const backToAlbumSelector = () => {
    router.push({
      name: 'album-selector',
    });
  };

  return () => (
    <div class="flex-1 container mx-auto py-8 px-2 h-full overflow-y-auto flex flex-col gap-y-2 lg:justify-center">
      {id.value !== undefined && (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <MainMenuLink to={{ name: 'directory-selector-before-arrange', params: { albumId: id.value } }}>
            <TablerFolderIcon class="w-24 h-24 text-primary-800 m-4" />
            <span class="text-xl">画像を整理する</span>
          </MainMenuLink>
          <MainMenuLink to={{ name: 'album-settings', params: { albumId: id.value } }}>
            <TablerGearIcon class="w-24 h-24 text-primary-800 m-4" />
            <span class="text-xl">設定</span>
          </MainMenuLink>
          <MainMenuLink to={{ name: 'directory-selector-before-gallery', params: { albumId: id.value } }}>
            <TablerPhotoIcon class="w-24 h-24 text-primary-800 m-4" />
            <span class="text-xl">ギャラリー</span>
          </MainMenuLink>
        </div>
      )}
      <Button onClick={backToAlbumSelector}>
        <ChevronLeftIcon class="w-6 h-6" />
        アルバム選択へ戻る
      </Button>
    </div>
  );
});
