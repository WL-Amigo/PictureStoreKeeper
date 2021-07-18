import { WritableComputedRef, Ref, computed } from 'vue';
import { useRoute, useRouter, LocationQuery } from 'vue-router';

const unwrapQueryValue = (value: LocationQuery[string]): string | null | undefined => {
  if (value instanceof Array) {
    return value[0];
  }
  return value;
};

export const usePage = (): WritableComputedRef<number> => {
  const route = useRoute();
  const router = useRouter();

  return computed({
    get() {
      const page = unwrapQueryValue(route.query['p']);

      return page != null ? Number(page) : 0;
    },
    set(value: number) {
      router.push({ query: { p: value } });
    },
  });
};

interface PagerComposition {
  goPrev(): void;
  goNext(): void;
  canGoPrev: Readonly<Ref<boolean>>;
  canGoNext: Readonly<Ref<boolean>>;
  page: WritableComputedRef<number>;
  maxPage: Readonly<Ref<number>>;
}

export const usePager = (itemsPerPage: Readonly<Ref<number>>, total: Readonly<Ref<number>>): PagerComposition => {
  const page = usePage();
  const goPrev = () => (page.value -= 1);
  const goNext = () => (page.value += 1);
  const canGoPrev = computed(() => page.value > 0);
  const maxPage = computed(() => Math.ceil(total.value / itemsPerPage.value) - 1);
  const canGoNext = computed(() => page.value < maxPage.value);

  return {
    page,
    maxPage,
    goPrev,
    goNext,
    canGoPrev,
    canGoNext,
  };
};
