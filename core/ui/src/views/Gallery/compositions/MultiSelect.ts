import { ServiceKeys, useDependency } from '@/compositions/Dependency';
import { computed, ComputedRef, Ref, shallowRef } from 'vue';
import { executeBulkOperation, GalleryBulkOperations } from '../viewModels/BulkOperation';

export type DispatchGalleryBulkOperationFunc = (op: GalleryBulkOperations) => Promise<void>;

interface MultiSelectState {
  selectedImgSet: Readonly<Ref<ReadonlySet<string>>>;
  isInMultiSelectMode: ComputedRef<boolean>;
  toggleSelection: (imgSrc: string) => void;
  clearSelection: () => void;
  dispatchBulkOperation: DispatchGalleryBulkOperationFunc;
}
export const useGalleryMultiSelectState = (
  albumId: Readonly<Ref<string>>,
  dirId: Readonly<Ref<number>>,
  onFinishBulkOperation: () => void,
): MultiSelectState => {
  const moveService = useDependency(ServiceKeys.MoveAPIService);

  const selectedImgSet = shallowRef<ReadonlySet<string>>(new Set());
  const isInMultiSelectMode = computed(() => selectedImgSet.value.size > 0);
  const toggleSelection = (imgSrc: string) => {
    const current = selectedImgSet.value;
    const next = new Set(current);
    if (next.has(imgSrc)) {
      next.delete(imgSrc);
    } else {
      next.add(imgSrc);
    }
    selectedImgSet.value = next;
  };
  const clearSelection = () => {
    selectedImgSet.value = new Set();
  };

  const dispatchBulkOperation: DispatchGalleryBulkOperationFunc = (op) =>
    executeBulkOperation(
      albumId.value,
      dirId.value,
      [...selectedImgSet.value],
      {
        moveService,
      },
      op,
    ).then(() => {
      clearSelection();
      onFinishBulkOperation();
    });

  return {
    selectedImgSet,
    isInMultiSelectMode,
    toggleSelection,
    clearSelection,
    dispatchBulkOperation,
  };
};
