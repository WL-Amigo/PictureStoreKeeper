interface MoveFilePayload {
  source_dir_index: number;
  destination_dir_index: number;
  file_name: string;
}

interface DeleteFilePayload {
  source_dir_index: number;
  file_name: string;
}

export class MoveAPIService {
  public constructor(private readonly m_host: string) {}

  public async movePictureAsync(
    albumID: string,
    fileName: string,
    sourceDirIndex: number,
    destDirIndex: number,
  ): Promise<boolean> {
    const payload: MoveFilePayload = {
      source_dir_index: sourceDirIndex,
      destination_dir_index: destDirIndex,
      file_name: fileName,
    };
    const resp = await fetch(new URL(`/api/move/${albumID}`, this.m_host).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return resp.ok;
  }

  public async deletePictureAsync(albumID: string, fileName: string, sourceDirIndex: number): Promise<boolean> {
    const payload: DeleteFilePayload = {
      source_dir_index: sourceDirIndex,
      file_name: fileName,
    };
    const resp = await fetch(new URL(`/api/move/${albumID}/delete`, this.m_host).toString(), {
      method: 'POST',
      // TODO: commonize content-type:json header
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return resp.ok;
  }
}
