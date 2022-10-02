import { IMoveService } from '@psk/frontend-interfaces';

export interface BulkTrashOperationPayload {
  type: 'trash';
}

export const executeBulkTrashOperation = async (
  albumId: string,
  dirId: number,
  selectedImgs: readonly string[],
  moveFileService: IMoveService,
): Promise<void> => {
  const _result = await moveFileService.deletePictureAsync(albumId, selectedImgs, dirId);

  // TODO: エラー処理
};
