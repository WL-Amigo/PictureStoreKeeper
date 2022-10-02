import { IMoveService } from "@psk/frontend-interfaces";
import { Sdk } from "graphql/autogen/gql";

export class MoveAPIService implements IMoveService {
  public constructor(
    private readonly gqlClient: Sdk
  ) {}

  public async movePictureAsync(
    albumId: string,
    fileNames: readonly string[],
    srcDirIndex: number,
    destDirIndex: number
  ): Promise<boolean> {
    const resp = await this.gqlClient.moveImages({
      input: {
        albumId,
        srcDirIndex,
        destDirIndex,
        fileNames: [...fileNames],
      },
    });

    return resp.moveImages.failed.length === 0;
  }

  public async deletePictureAsync(
    albumId: string,
    fileNames: readonly string[],
    srcDirIndex: number
  ): Promise<boolean> {
    const resp = await this.gqlClient.trashImages({
      input: {
        albumId,
        srcDirIndex,
        fileNames: [...fileNames],
      },
    });

    return resp.trashImages.failed.length === 0;
  }
}
