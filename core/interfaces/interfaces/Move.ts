export interface IMoveService {
  movePictureAsync(
    albumID: string,
    fileName: readonly string[],
    sourceDirIndex: number,
    destDirIndex: number
  ): Promise<boolean>;
  deletePictureAsync(
    albumID: string,
    fileNames: readonly string[],
    sourceDirIndex: number
  ): Promise<boolean>;
}
