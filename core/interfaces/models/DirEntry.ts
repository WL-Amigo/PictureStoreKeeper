export interface DirEntry {
  label: string;
  fullpath: string;
}

export interface DirEntryWithId extends DirEntry {
  id: number;
}