import { PropType, unref } from 'vue';
import { isNotNullOrUndefined } from './Emptiness';
import * as vt from 'vue-types';

export { vt };

type RequiredProp<ValueType> = {
  required: true;
  type: PropType<ValueType>;
};

export const defineRequiredStringProp = (): RequiredProp<string> => ({
  required: true,
  type: String,
});

export const defineRequiredNumberProp = (): RequiredProp<number> => ({
  required: true,
  type: Number,
});

export const defineRequiredBooleanProp = (): RequiredProp<boolean> => ({
  required: true,
  type: Boolean,
});

export const stringifyAttr = (value: unknown): string => (isNotNullOrUndefined(value) ? String(value) : '');

export const unwrapElement = (el: unknown): HTMLElement | null => {
  const maybeElement = unref(el);
  if (maybeElement instanceof HTMLElement) {
    return maybeElement;
  }
  const innerEl = Reflect.get(maybeElement as object, '$el');
  if (innerEl instanceof HTMLElement) {
    return innerEl;
  }

  return null;
};
