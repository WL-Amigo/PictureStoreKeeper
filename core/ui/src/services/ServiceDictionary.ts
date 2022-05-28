import { InjectionKey } from 'vue';
import { IAlbumService, IDirectoryService, IMoveService } from '@psk/frontend-interfaces';

export type ServiceDictionary = {
  readonly AlbumAPIService: IAlbumService;
  readonly DirectoryAPIService: IDirectoryService;
  readonly MoveAPIService: IMoveService;
};

export type ServiceKeyDictionary = {
  readonly [K in keyof ServiceDictionary]: InjectionKey<ServiceDictionary[K]>;
};
