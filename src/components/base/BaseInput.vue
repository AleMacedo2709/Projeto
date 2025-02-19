<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  modelValue?: string;
  id?: string;
  icon?: Component;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="relative">
    <component
      v-if="icon"
      :is="icon"
      class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
        'text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
        'placeholder-gray-400 dark:placeholder-gray-500',
        icon ? 'pl-10 pr-4' : 'px-4',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
  </div>
</template>