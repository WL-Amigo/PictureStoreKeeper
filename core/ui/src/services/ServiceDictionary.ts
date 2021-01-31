import { InjectionKey } from 'vue';
import type { AlbumAPIService } from './AlbumAPIService';
import type { DirectoryAPIService } from './DirectoryAPIService';
import type { MoveAPIService } from './MoveAPIService';

export type ServiceDictionary = {
  readonly AlbumAPIService: AlbumAPIService;
  readonly DirectoryAPIService: DirectoryAPIService;
  readonly MoveAPIService: MoveAPIService;
};

export type ServiceKeyDictionary = {
  readonly [K in keyof ServiceDictionary]: InjectionKey<ServiceDictionary[K]>;
};
