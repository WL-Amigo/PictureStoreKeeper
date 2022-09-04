import { IMoveService } from '@psk/frontend-interfaces';
import { BulkMoveOperationPayload, executeBulkMoveOperation } from './Move';

export type GalleryBulkOperations = BulkMoveOperationPayload;

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

  return Promise.resolve();
};
