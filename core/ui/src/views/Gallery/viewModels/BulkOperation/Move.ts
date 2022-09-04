import { IMoveService } from '@psk/frontend-interfaces';

export interface BulkMoveOperationPayload {
  type: 'move';
  destDirIndex: number;
}

export const executeBulkMoveOperation = async (
  albumId: string,
  dirId: number,
  selectedImgs: readonly string[],
  moveFileService: IMoveService,
  payload: BulkMoveOperationPayload,
): Promise<void> => {
  const _result = await moveFileService.movePictureAsync(albumId, selectedImgs, dirId, payload.destDirIndex);

  // TODO: エラー処理
};
