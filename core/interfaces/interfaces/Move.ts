export interface IMoveService {
  movePictureAsync(
    albumID: string,
    fileName: string,
    sourceDirIndex: number,
    destDirIndex: number
  ): Promise<boolean>;
  deletePictureAsync(
    albumID: string,
    fileName: string,
    sourceDirIndex: number
  ): Promise<boolean>;
}
