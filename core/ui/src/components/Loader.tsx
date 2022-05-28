import { defineComponent } from 'vue';
import LoaderStyles from './Loader.module.css';

export const LineLoader = defineComponent(() => {
  return () => <div class={LoaderStyles['line-loader']} />;
});
