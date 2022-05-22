import { startApplication } from 'core-ui'
import { AlbumAPIService } from './Services/Album'
import { DirectoryAPIService } from './Services/Directory';
import { MoveAPIService } from './Services/Move';

startApplication(async () => {
  const EnvAPIHost = import.meta.env.VITE_APP_API_HOST;
  const Host: string = typeof EnvAPIHost === 'string' ? EnvAPIHost : window.location.origin;

  return {
    AlbumAPIService: new AlbumAPIService(Host),
    DirectoryAPIService: new DirectoryAPIService(Host),
    MoveAPIService: new MoveAPIService(Host)
  }
})