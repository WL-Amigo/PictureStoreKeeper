import { DirEntry } from './DirEntry';

export interface Album {
  label: string;
  directories: Array<DirEntry>;
}