import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { pathJoin } from '@/utils/Path';
import { stringifyAttr } from '@/utils/Vue';
import { windi } from '@/windi';
import clsx from 'clsx';
import { computed, defineComponent, onMounted, ref } from 'vue';
import * as vt from 'vue-types';
import { BoxFolderIcon, BoxFolderOpen } from '../icons/Boxicons';
import { LineLoader } from '../Loader';

const DirList = defineComponent({
  props: {
    self: vt.string().isRequired,
    selected: vt.string().isRequired,
  },
  emits: {
    select: (path: string) => true,
  },
  setup(props, ctx) {
    const isLoading = ref(true);
    const dirs = ref<string[]>([]);
    const directoryService = useDependency(ServiceKeys.DirectoryAPIService);
    onMounted(() => {
      directoryService.getDirs(props.self).then((dirsResp) => {
        dirs.value = dirsResp;
        isLoading.value = false;
      });
    });

    const onSelect = (path: string) => ctx.emit('select', path);

    return () => {
      if (isLoading.value) {
        return <LineLoader class="text-gray-500" />;
      }

      return (
        <div class="flex flex-col items-start gap-y-1">
          {dirs.value.map((d) => (
            <DirEntry self={d} parent={props.self} selected={props.selected} onSelect={onSelect} />
          ))}
        </div>
      );
    };
  },
});

const shouldOpenOnInit = (self: string, parent: string, selected: string) =>
  selected.startsWith(pathJoin(parent, self));
const DirEntry = defineComponent({
  props: {
    self: vt.string().isRequired,
    parent: vt.string().isRequired,
    selected: vt.string().isRequired,
  },
  emits: {
    select: (path: string) => true,
  },
  setup(props, ctx) {
    const selfFullPath = computed(() => pathJoin(props.parent, props.self));
    const isSelected = computed(() => {
      return selfFullPath.value === props.selected;
    });
    const isOpen = ref(shouldOpenOnInit(props.self, props.parent, props.selected));
    const toggleIsOpen = () => (isOpen.value = !isOpen.value);
    const onSelectDirRaw = (path: string) => ctx.emit('select', path);
    const onSelectDir = () => onSelectDirRaw(selfFullPath.value);

    return () => (
      <div class="flex flex-col">
        <div class={clsx(windi`flex flex-row gap-x-2`, isSelected.value && windi`bg-blue-200`)}>
          <button onClick={toggleIsOpen}>
            {isOpen.value ? <BoxFolderOpen class="w-6 h-6" /> : <BoxFolderIcon class="w-6 h-6" />}
          </button>
          <span class="cursor-pointer" onClick={onSelectDir}>
            {props.self}
          </span>
        </div>
        {isOpen.value && (
          <div class="pl-6">
            <DirList self={selfFullPath.value} selected={props.selected} onSelect={onSelectDirRaw} />
          </div>
        )}
      </div>
    );
  },
});

export const ConfigDirSelector = defineComponent({
  props: {
    selectedDir: vt.string().def(''),
  },
  emits: {
    select: (path: string) => true,
  },
  setup(props, ctx) {
    const onSelect = (path: string) => ctx.emit('select', path);

    return () => (
      <div class={clsx(windi`p-2 rounded border border-gray-500 overflow-y-auto`, stringifyAttr(ctx.attrs.class))}>
        <DirList self="/" selected={props.selectedDir} onSelect={onSelect} />
      </div>
    );
  },
});
