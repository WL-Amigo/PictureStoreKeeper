import { computed, ref, Ref } from 'vue';

export const useLookAheadVirtualImgSrcList = (originalImgSrcList: Readonly<Ref<string[]>>) => {
  const lookAheadCountRef = ref(0);
  const isInLookAheadMode = computed(() => lookAheadCountRef.value > 0);
  const lookAhead = () => {
    lookAheadCountRef.value = lookAheadCountRef.value + 1;
  };
  const returnFromLookAhead = () => {
    lookAheadCountRef.value = 0;
  };

  const imgSrcList = computed(() => {
    const original = originalImgSrcList.value;
    return original.slice(lookAheadCountRef.value);
  });

  return {
    lookAhead,
    returnFromLookAhead,
    isInLookAheadMode,
    imgSrcList,
  };
};
