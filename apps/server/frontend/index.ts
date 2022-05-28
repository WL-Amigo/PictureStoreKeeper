import { startApplication } from 'core-ui'
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './graphql/autogen/gql';
import { AlbumAPIService } from './Services/Album'
import { DirectoryAPIService } from './Services/Directory';
import { MoveAPIService } from './Services/Move';

startApplication(async () => {
  const EnvAPIHost = import.meta.env.VITE_APP_API_HOST;
  const Host: string = typeof EnvAPIHost === 'string' ? EnvAPIHost : window.location.origin;

  const gqlClient = new GraphQLClient((new URL('/api/query', Host).href))
  const sdk = getSdk(gqlClient)

  return {
    AlbumAPIService: new AlbumAPIService(Host),
    DirectoryAPIService: new DirectoryAPIService(Host, sdk),
    MoveAPIService: new MoveAPIService(Host)
  }
})