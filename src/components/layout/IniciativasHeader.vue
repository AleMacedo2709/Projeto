<script setup lang="ts">
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline';
import BaseInput from '../base/BaseInput.vue';
import BaseSelect from '../base/BaseSelect.vue';

interface Props {
  searchQuery: string;
  selectedArea: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:selectedArea': [value: string];
}>();

const areas = [
  'Todas as áreas',
  'SUBPROCURADORIA-GERAL DE JUSTIÇA JURÍDICA',
  'PROMOTORIA DE JUSTIÇA',
  'DTI'
];
</script>

<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="px-2 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-7xl mx-auto">
      <BaseInput
        :model-value="searchQuery"
        @update:model-value="emit('update:searchQuery', $event)"
        placeholder="Buscar iniciativas..."
        :icon="MagnifyingGlassIcon"
        class="flex-1 text-sm"
      />
      <BaseSelect
        :model-value="selectedArea"
        @update:model-value="emit('update:selectedArea', $event)"
        :options="areas"
        :icon="FunnelIcon"
        class="w-full sm:w-80 text-sm"
      />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  :deep(.select-button) {
    @apply text-xs;
  }
  :deep(.select-options) {
    @apply text-xs;
  }
}
</style> 