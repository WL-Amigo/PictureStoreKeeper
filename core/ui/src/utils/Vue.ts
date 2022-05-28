import { PropType } from 'vue';
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
