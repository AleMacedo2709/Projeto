<script setup lang="ts">
import { computed } from 'vue';
import {
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline';

interface Props {
  activeTab: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:activeTab': [value: string];
}>();

const menuItems = [
  { id: 'iniciativas-mpsp', label: 'Iniciativas MPSP', icon: HomeIcon },
  { id: 'minhas-iniciativas', label: 'Minhas Iniciativas', icon: FolderIcon },
  { id: 'gestao-iniciativas', label: 'Gestão Iniciativas', icon: DocumentTextIcon },
  { id: 'gestao-cadastros', label: 'Gestão Cadastros', icon: Cog6ToothIcon },
];
</script>

<template>
  <aside class="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hidden md:block">
    <div class="p-4">
      <div class="flex items-center justify-center mb-6">
        <img src="/logo-mpsp.png" alt="MPSP Logo" class="h-12 w-auto" />
      </div>
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="{ name: item.id }"
          class="sidebar-item"
          :class="{ active: activeTab === item.id }"
          @click.prevent="emit('update:activeTab', item.id)"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.label }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>