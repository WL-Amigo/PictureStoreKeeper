import { IDAndAlbumPair } from '@/models/IDAndAlbumPair';
import { Album } from '@/models/Album'

export class AlbumAPIService {
  public constructor(
    private readonly m_host: string
  ){}

  public async getAllAlbumsAsync() {
    let resp = await fetch((new URL('/api/album/', this.m_host)).toString());
    if(!resp.ok) {
      throw "getAllAlbumsAsync: failed";
    }

    return <Array<IDAndAlbumPair>>(await resp.json());
  }
  
  public async getAlbumAsync(id: string) {
    let resp = await fetch((new URL(`/api/album/${id}`, this.m_host)).toString());
    if(!resp.ok) {
      throw "getAlbumAsync: failed";
    }

    return <Album>(await resp.json());
  }

  public async saveAlbumAsync(id: string, album: Album) {
    let resp = await fetch((new URL(`/api/album/${id}`, this.m_host)).toString(), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(album),
    });

    return resp.ok;
  }

  public async createAlbumAsync(label: string) {
    let resp = await fetch((new URL(`/api/album/`, this.m_host)).toString(), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        label: label
      })
    });

    return resp.ok;
  }
}