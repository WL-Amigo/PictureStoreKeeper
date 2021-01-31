import { FatalError } from '@/components/errors/Base';
import { ServiceDictionary, ServiceKeyDictionary } from '@/services/ServiceDictionary';
import { inject, InjectionKey, provide } from '@vue/composition-api';

export const ServiceKeys: ServiceKeyDictionary = {
  AlbumAPIService: Symbol(),
  DirectoryAPIService: Symbol(),
  MoveAPIService: Symbol(),
} as const;

type ServiceKey = keyof ServiceDictionary;
const getKeys = (serviceDict: ServiceDictionary): ServiceKey[] => Object.keys(serviceDict) as ServiceKey[];

export const useDependencyProvider = (serviceDict: ServiceDictionary): void => {
  for (const key of getKeys(serviceDict)) {
    provide(ServiceKeys[key], serviceDict[key]);
  }
};

export const useDependency = <T>(key: InjectionKey<T>): T => {
  const dep = inject(key);
  if (dep === undefined) {
    throw new FatalError(`Failed to resolve dependency: ${key}`);
  }

  return dep;
};
