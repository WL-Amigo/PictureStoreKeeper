import { defineComponent, ref, shallowRef, Teleport, watch } from 'vue';
import * as vt from 'vue-types';
import { isNotNullOrUndefined } from '@/utils/Emptiness';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { stopPropagationHandler } from '@/utils/EventHandlers';
import { unwrapElement } from '@/utils/Vue';

export const Popover = defineComponent({
  name: 'Popover',
  props: {
    open: vt.bool().def(false),
    anchorEl: vt.custom<HTMLElement | null>(() => true),
  },
  emits: {
    clickAway: () => true,
  },
  setup(props, ctx) {
    const innerOpenState = ref(false);
    const popoverRef = ref<HTMLDivElement | null>(null);
    const position = shallowRef({ x: 0, y: 0 });

    watch(
      () => ({
        isOpen: props.open,
        popoverEl: popoverRef.value,
      }),
      (watchProps) => {
        const { isOpen, popoverEl } = watchProps;
        const innerIsOpen = innerOpenState.value;
        const anchorEl = unwrapElement(props.anchorEl);
        if (isOpen && isNotNullOrUndefined(anchorEl) && isNotNullOrUndefined(popoverEl)) {
          computePosition(anchorEl, popoverEl, {
            placement: 'top',
            middleware: [flip(), shift(), offset(4)],
          }).then(({ x, y }) => {
            position.value = { x, y };
            innerOpenState.value = true;
          });
        } else if (innerIsOpen && !isOpen) {
          innerOpenState.value = false;
        }
      },
    );
    const onClickAway = () => ctx.emit('clickAway');

    return () =>
      props.open ? (
        <Teleport to="body">
          <div class="absolute inset-0" onClick={onClickAway}>
            <div
              ref={popoverRef}
              class="absolute rounded bg-white"
              style={{
                left: `${position.value.x}px`,
                top: `${position.value.y}px`,
                opacity: innerOpenState.value ? '1' : '0',
              }}
              onClick={stopPropagationHandler}
            >
              {ctx.slots.default?.()}
            </div>
          </div>
        </Teleport>
      ) : null;
  },
});
