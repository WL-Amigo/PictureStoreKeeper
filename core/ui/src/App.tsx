import { createApp, defineAsyncComponent, defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { useDependencyProvider } from './compositions/Dependency';
import { router } from './router';
import { ServiceDictionary } from './services/ServiceDictionary';
import 'virtual:windi.css';

export const startApplication = (dependenciesResolver: () => Promise<ServiceDictionary>) => {
  const Root = defineAsyncComponent({
    loader: async () => {
      const deps = await dependenciesResolver();

      return defineComponent({
        setup() {
          useDependencyProvider(deps);

          return () => (
            <div class="w-full h-full">
              <RouterView />
            </div>
          );
        },
      });
    },
  });

  const app = createApp(Root);
  app.use(router);

  app.mount('#app');
};
