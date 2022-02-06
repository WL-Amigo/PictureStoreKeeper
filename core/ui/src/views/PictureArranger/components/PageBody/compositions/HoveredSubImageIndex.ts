import { computed, ref } from 'vue';

export const useHoveredSubImgIndex = () => {
  // 画像間でカーソルを動かした時に不安定になるのを防止するため、先読み画像1つ1つに対してホバー中かどうかを保持している
  const hoveredImgIndices = ref<number[]>([]);

  const onHoverSubImg = (idx: number) => hoveredImgIndices.value.push(idx);
  const onUnhoverSubImg = (idx: number) => (hoveredImgIndices.value = hoveredImgIndices.value.filter((i) => i !== idx));

  const hoveredImgIndex = computed<number | undefined>(() => hoveredImgIndices.value[0]);

  return {
    onHoverSubImg,
    onUnhoverSubImg,
    hoveredImgIndex,
  };
};
