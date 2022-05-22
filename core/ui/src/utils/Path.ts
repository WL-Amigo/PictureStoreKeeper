const PathSeparator = '/';
const DuplicatedSeparatorRegexp = /\/+/g;
export const pathJoin = (...paths: string[]): string =>
  paths.join(PathSeparator).replaceAll(DuplicatedSeparatorRegexp, PathSeparator);
