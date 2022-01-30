<template>
  <div class="w-full h-full">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDependencyProvider } from './compositions/Dependency';
import { AlbumAPIService } from './services/AlbumAPIService';
import { DirectoryAPIService } from './services/DirectoryAPIService';
import { MoveAPIService } from './services/MoveAPIService';

export default defineComponent({
  setup() {
    // initialize services
    // TODO: instance should be injected at each platform (server, desktop, etc...)
    const EnvAPIHost = import.meta.env.VITE_APP_API_HOST;
    const Host: string = typeof EnvAPIHost === 'string' ? EnvAPIHost : window.location.origin;
    const AlbumAPIServiceInst = new AlbumAPIService(Host);
    const DirectoryAPIServiceInst = new DirectoryAPIService(Host);
    const MoveAPIServiceInst = new MoveAPIService(Host);

    useDependencyProvider({
      AlbumAPIService: AlbumAPIServiceInst,
      DirectoryAPIService: DirectoryAPIServiceInst,
      MoveAPIService: MoveAPIServiceInst,
    });
    return {};
  },
});
</script>
