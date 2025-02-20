<script setup lang="ts">
import {
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline';
import { useAuth } from '../../services/auth';

const { getCurrentUser } = useAuth();
const user = getCurrentUser();

const menuItems = [
  {
    name: 'Iniciativas MPSP',
    icon: HomeIcon,
    route: '/'
  },
  {
    name: 'Minhas Iniciativas',
    icon: FolderIcon,
    route: '/minhas-iniciativas'
  },
  {
    name: 'Métricas',
    icon: ChartBarIcon,
    route: '/metricas'
  },
  {
    name: 'Gestão Iniciativas',
    icon: DocumentTextIcon,
    route: '/gestao-iniciativas',
    requiresGestorSelo: true
  },
  {
    name: 'Gestão Cadastros',
    icon: Cog6ToothIcon,
    route: '/gestao-cadastros',
    requiresGestorCadastros: true
  }
].filter(item => {
  if (item.requiresGestorSelo) {
    return user?.nivel_acesso === 'gestor_selo_pgj' || user?.nivel_acesso === 'gestor_selo_cg';
  }
  if (item.requiresGestorCadastros) {
    return user?.nivel_acesso === 'gestor_cadastros';
  }
  return true;
});
</script>

<template>
  <aside class="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hidden md:block">
    <div class="p-4">
      <div class="flex items-center justify-center mb-6">
        <img src="/logo-mpsp.png" alt="MPSP Logo" class="h-16 w-auto" />
      </div>
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.route"
          :to="item.route"
          class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            $route.path === item.route
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>