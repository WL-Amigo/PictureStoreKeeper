import { IMoveService } from "@psk/frontend-interfaces";
import { Sdk } from "graphql/autogen/gql";

interface MoveFilePayload {
  source_dir_index: number;
  destination_dir_index: number;
  file_name: string;
}

interface DeleteFilePayload {
  source_dir_index: number;
  file_name: string;
}

export class MoveAPIService implements IMoveService {
  public constructor(
    private readonly m_host: string,
    private readonly gqlClient: Sdk
  ) {}

  public async movePictureAsync(
    albumId: string,
    fileNames: string[],
    srcDirIndex: number,
    destDirIndex: number
  ): Promise<boolean> {
    const resp = await this.gqlClient.moveImages({
      input: {
        albumId,
        srcDirIndex,
        destDirIndex,
        fileNames
      }
    });

    return resp.moveImages.failed.length === 0;
  }

  public async deletePictureAsync(
    albumID: string,
    fileName: string,
    sourceDirIndex: number
  ): Promise<boolean> {
    const payload: DeleteFilePayload = {
      source_dir_index: sourceDirIndex,
      file_name: fileName,
    };
    const resp = await fetch(
      new URL(`/api/move/${albumID}/delete`, this.m_host).toString(),
      {
        method: "POST",
        // TODO: commonize content-type:json header
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      }
    );

    return resp.ok;
  }
}
