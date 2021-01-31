export class DirectoryAPIService {
  public constructor(private readonly m_host: string) {}

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
}
