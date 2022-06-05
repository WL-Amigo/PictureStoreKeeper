export const isNotNullOrUndefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isNotNullOrEmptyString = (value: string | null | undefined): value is string =>
  value !== null && value !== undefined && value.length > 0;
