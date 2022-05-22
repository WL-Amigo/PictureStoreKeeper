import { IDirectoryService } from "@psk/frontend-interfaces";
import type {Sdk} from '../graphql/autogen/gql'

export class DirectoryAPIService implements IDirectoryService {
  public constructor(private readonly m_host: string, private readonly gqlClient: Sdk) {}

  public async getAllFiles(albumId: string, dirId: number): Promise<string[]> {
    const resp = await fetch(new URL(`/api/directory/${albumId}/${dirId}`, this.m_host).toString());
    if (!resp.ok) {
      throw 'getAllFilesInSource: failed';
    }

    return <Array<string>>(await resp.json())['files'];
  }

  public toFileURL(albumId: string, dirId: number, fileName: string): string {
    return new URL(`/api/directory/${albumId}/${dirId}/${fileName}`, this.m_host).toString();
  }

  public toThumbNailURL(albumId: string, dirId: number, fileName: string): string {
    return new URL(`/api/directory/${albumId}/${dirId}/${fileName}/thumbnail`, this.m_host).toString();
  }

  public async getDirs(root: string): Promise<string[]> {
    const resp = await this.gqlClient.getDirs({ root });
    return resp.dirs;
  }
}
