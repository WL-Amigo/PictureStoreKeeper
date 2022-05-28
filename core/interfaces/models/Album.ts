import { DirEntry } from "./DirEntry";

export interface Album {
  label: string;
  directories: Array<DirEntry>;
  will_be_deleted_dir: string;
}