import { FunctionalComponent, Transition } from 'vue';

export const Fade: FunctionalComponent = (_, ctx) => (
  <Transition
    enterFromClass="opacity-0"
    enterActiveClass="transition duration-100 transform-gpu"
    leaveToClass="opacity-0"
    leaveActiveClass="transition duration-100 transform-gpu"
  >
    {ctx.slots.default?.()}
  </Transition>
);
