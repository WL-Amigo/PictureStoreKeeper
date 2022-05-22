import {IDAndLabelPair, Album, IAlbumService} from '@psk/frontend-interfaces'

export class AlbumAPIService implements IAlbumService {
  public constructor(private readonly m_host: string) {}

  public async getAllAlbumsAsync(): Promise<readonly IDAndLabelPair[]> {
    const resp = await fetch(new URL('/api/album/', this.m_host).toString());
    if (!resp.ok) {
      throw 'getAllAlbumsAsync: failed';
    }

    return <Array<IDAndLabelPair>>await resp.json();
  }

  public async getAlbumAsync(id: string): Promise<Album> {
    const resp = await fetch(new URL(`/api/album/${id}`, this.m_host).toString());
    if (!resp.ok) {
      throw 'getAlbumAsync: failed';
    }

    return <Album>await resp.json();
  }

  public async saveAlbumAsync(id: string, album: Album): Promise<boolean> {
    const resp = await fetch(new URL(`/api/album/${id}`, this.m_host).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(album),
    });

    return resp.ok;
  }

  public async createAlbumAsync(label: string): Promise<boolean> {
    const resp = await fetch(new URL(`/api/album/`, this.m_host).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        label: label,
      }),
    });

    return resp.ok;
  }
}
