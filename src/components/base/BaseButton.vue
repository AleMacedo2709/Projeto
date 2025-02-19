<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

const classes = computed(() => ({
  'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed': true,
  'text-sm': props.size === 'sm',
  'text-base': props.size === 'md',
  'text-lg px-6 py-3': props.size === 'lg',
  'bg-blue-600 text-white hover:bg-blue-700': props.variant === 'primary',
  'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600': props.variant === 'secondary',
  'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20': props.variant === 'outline',
}));
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>