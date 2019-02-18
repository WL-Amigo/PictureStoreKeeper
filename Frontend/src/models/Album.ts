import { DirEntry } from './DirEntry';

export interface Album {
  label: string;
  source: DirEntry;
  arranged: Array<DirEntry>;
}