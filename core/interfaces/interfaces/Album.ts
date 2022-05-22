import { Album } from "../models/Album";
import { IDAndLabelPair } from "../models/IDAndLabelPair";

export interface IAlbumService {
  getAllAlbumsAsync(): Promise<readonly IDAndLabelPair[]>;
  getAlbumAsync(id: string): Promise<Album>
  saveAlbumAsync(id: string, album: Album): Promise<boolean>
  createAlbumAsync(label: string): Promise<boolean>
}