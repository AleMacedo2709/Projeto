<script setup lang="ts">
import { UserCircleIcon } from '@heroicons/vue/24/outline';
import ThemeSwitcher from '../ThemeSwitcher.vue';
import { useAuth } from '../../services/auth';

const { currentUser } = useAuth();
</script>

<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="px-4 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Iniciativas MPSP</h1>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <UserCircleIcon class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ currentUser?.nome_usuario || 'Usuário não identificado' }}</span>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>