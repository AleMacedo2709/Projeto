<script setup lang="ts">
import type { Component } from 'vue';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string | number;
  options: Option[];
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
</script>

<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      :required="required"
      :disabled="disabled"
    >
      <option value="" disabled selected>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <div v-if="icon" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <component :is="icon" class="h-5 w-5 text-gray-400" aria-hidden="true" />
    </div>
  </div>
</template>