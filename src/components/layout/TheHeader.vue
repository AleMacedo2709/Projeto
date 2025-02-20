<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ThemeSwitcher from '../ThemeSwitcher.vue';
import { useAuth } from '../../services/auth';

const { currentUser } = useAuth();
const route = useRoute();

const pageTitle = computed(() => {
  return route.meta.title || 'Iniciativas MPSP';
});
</script>

<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
      <div class="flex items-center space-x-6">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ currentUser?.nome_usuario || 'Usuário não identificado' }}
        </span>
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>