import { IMoveService } from '@psk/frontend-interfaces';
import { BulkMoveOperationPayload, executeBulkMoveOperation } from './Move';
import { BulkTrashOperationPayload, executeBulkTrashOperation } from './Trash';

export type GalleryBulkOperations = BulkMoveOperationPayload | BulkTrashOperationPayload;

interface BulkOperationDependencies {
  moveService: IMoveService;
}
export const executeBulkOperation = (
  albumId: string,
  dirId: number,
  selectedImgs: readonly string[],
  deps: BulkOperationDependencies,
  op: GalleryBulkOperations,
): Promise<void> => {
  if (op.type === 'move') {
    return executeBulkMoveOperation(albumId, dirId, selectedImgs, deps.moveService, op);
  }
  if (op.type === 'trash') {
    return executeBulkTrashOperation(albumId, dirId, selectedImgs, deps.moveService);
  }

  return Promise.resolve();
};
