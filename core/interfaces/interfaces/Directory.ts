export interface IDirectoryService {
  getAllFiles(albumId: string, dirId: number): Promise<string[]>;
  toFileURL(albumId: string, dirId: number, fileName: string): string;
  toThumbNailURL(albumId: string, dirId: number, fileName: string): string;
}
