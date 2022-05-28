import { vt } from '@/utils/Vue';
import { defineComponent, ref, Teleport, Transition, watchEffect, withCtx } from 'vue';

export const ModalBase = defineComponent({
  props: {
    open: vt.bool().isRequired,
  },
  emits: {
    clickAway: () => true,
  },
  setup(props, ctx) {
    const onClickAway = () => ctx.emit('clickAway');

    return () => (
      <Teleport to="body">
        <Transition
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          {props.open && (
            <div
              class="bg-black bg-opacity-75 fixed top-0 left-0 w-full h-full max-h-screen flex items-center justify-center transition-opacity duration-200"
              onClick={onClickAway}
            >
              {ctx.slots.default?.()}
            </div>
          )}
        </Transition>
      </Teleport>
    );
  },
});
