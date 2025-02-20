<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <slot name="before-fields" />

    <div v-for="field in fields" :key="field.name" class="space-y-1">
      <label :for="field.name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>

      <!-- Input text/number -->
      <input
        v-if="['text', 'number', 'email', 'password'].includes(field.type)"
        :id="field.name"
        :type="field.type"
        :value="modelValue[field.name]"
        @input="updateField(field.name, ($event.target as HTMLInputElement).value)"
        :required="field.required"
        :min="field.min"
        :max="field.max"
        :pattern="field.pattern"
        :placeholder="field.placeholder"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        :class="{ 'border-red-500': errors[field.name] }"
      />

      <!-- Select -->
      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        :value="modelValue[field.name]"
        @change="updateField(field.name, ($event.target as HTMLSelectElement).value)"
        :required="field.required"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        :class="{ 'border-red-500': errors[field.name] }"
      >
        <option v-if="field.placeholder" value="">{{ field.placeholder }}</option>
        <option
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Textarea -->
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        :value="modelValue[field.name]"
        @input="updateField(field.name, ($event.target as HTMLTextAreaElement).value)"
        :required="field.required"
        :rows="field.rows || 3"
        :placeholder="field.placeholder"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        :class="{ 'border-red-500': errors[field.name] }"
      />

      <!-- Error message -->
      <p v-if="errors[field.name]" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ errors[field.name] }}
      </p>

      <!-- Help text -->
      <p v-if="field.helpText" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ field.helpText }}
      </p>
    </div>

    <slot name="after-fields" />

    <div class="flex justify-end space-x-3">
      <slot name="before-buttons" />
      
      <button
        v-if="showCancelButton"
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
      >
        {{ cancelButtonText }}
      </button>

      <button
        type="submit"
        :disabled="loading"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="mr-2">
          <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
        {{ submitButtonText }}
      </button>

      <slot name="after-buttons" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ value: string | number; label: string }>;
  rows?: number;
}

interface Props {
  modelValue: Record<string, any>;
  fields: Field[];
  errors?: Record<string, string>;
  loading?: boolean;
  showCancelButton?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
  loading: false,
  showCancelButton: true,
  submitButtonText: 'Salvar',
  cancelButtonText: 'Cancelar'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const updateField = (name: string, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [name]: value
  });
};

const handleSubmit = () => {
  emit('submit');
};
</script> 