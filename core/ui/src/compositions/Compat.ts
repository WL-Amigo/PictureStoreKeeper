import { getCurrentInstance } from '@vue/composition-api';
import VueRouter, { Route } from 'vue-router';

export const useRouter = (): VueRouter | undefined => {
  const vm = getCurrentInstance()?.proxy;
  return vm?.$router;
};

export const useRoute = (): Route | undefined => {
  const vm = getCurrentInstance()?.proxy;
  return vm?.$route;
};
