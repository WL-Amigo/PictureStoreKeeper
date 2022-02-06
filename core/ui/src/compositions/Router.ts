import { computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

export const useSingleRouteParam = (paramName: string): ComputedRef<string> => {
  const route = useRoute();
  const valueComputed = computed(() => {
    const value = route.params[paramName];
    if (value === undefined || value === '') {
      throw Error('Failed to get param: ' + paramName);
    }

    if (Array.isArray(value)) {
      const unwrappedValue = value[0];
      if (unwrappedValue === undefined) {
        throw Error('Failed to get param: ' + paramName);
      }
      return unwrappedValue;
    }
    return value;
  });

  return valueComputed;
};

export const useSingleIntRouteParam = (paramName: string): ComputedRef<number> => {
  const rawValueRef = useSingleRouteParam(paramName);
  const valueComputed = computed(() => {
    const value = parseInt(rawValueRef.value);
    if (isNaN(value)) {
      throw Error(`Failed to get param as integer: paramName:${paramName}, rawValue:${rawValueRef.value}`);
    }
    return value;
  });

  return valueComputed;
};
