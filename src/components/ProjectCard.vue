<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  daysLeft: number;
  tags: string[];
  risk: 'Low' | 'Medium' | 'High';
}>();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <div :class="{
        'px-3 py-1 text-sm rounded-full': true,
        'bg-green-100 text-green-800': risk === 'Low',
        'bg-yellow-100 text-yellow-800': risk === 'Medium',
        'bg-red-100 text-red-800': risk === 'High'
      }">
        {{ risk }} Risk
      </div>
    </div>
    
    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{{ description }}</p>
    
    <div class="space-x-2 mb-4">
      <span
        v-for="tag in tags"
        :key="tag"
        class="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
      >
        {{ tag }}
      </span>
    </div>
    
    <div class="mb-4">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
        <span>Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-value" :style="{ width: `${progress}%` }" />
      </div>
    </div>
    
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>{{ dueDate }}</span>
      <span>{{ daysLeft }} days left</span>
    </div>

    <!-- Slot para conteúdo adicional -->
    <slot name="extra" />
  </div>
</template>