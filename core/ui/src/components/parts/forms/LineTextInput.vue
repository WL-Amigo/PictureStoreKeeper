<template>
  <div class="flex flex-col">
    <label class="text-sm" v-if="label && label.length > 0">{{ label }}</label>
    <input
      type="text"
      class="px-2 py-1 border focus:border-gray-700 w-full border-gray-300 rounded focus:outline-none text-gray-600"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <slot name="help" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: String,
    label: String,
  },
  setup() {
    return {};
  },
});
</script>
