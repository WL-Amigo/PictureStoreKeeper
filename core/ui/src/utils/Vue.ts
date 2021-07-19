import { PropType } from 'vue';

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
