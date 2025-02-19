<template>
  <div class="min-h-screen flex">
    <TheSidebar v-model:activeTab="activeTab" />
    
    <div class="flex-1">
      <TheHeader />
      <IniciativasHeader
        v-model:searchQuery="searchQuery"
        v-model:selectedArea="selectedArea"
      />
      
      <div class="p-2 sm:p-4">
        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Card de Iniciativas Cadastradas -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Iniciativas Cadastradas</h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ totalIniciativas }}</span>
              <DocumentTextIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Programas</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalPorTipo.programa }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Projetos</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalPorTipo.projeto }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Boas Práticas</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ totalPorTipo.boa_pratica }}</span>
              </div>
            </div>
          </div>

          <!-- Card de Iniciativas Finalizadas -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Iniciativas Finalizadas</h3>
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold text-green-600 dark:text-green-400">{{ totalFinalizadas }}</span>
              <CheckCircleIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Programas</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ finalizadasPorTipo.programa }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Projetos</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ finalizadasPorTipo.projeto }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Boas Práticas</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ finalizadasPorTipo.boa_pratica }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Iniciativas MPSP</h2>
          <div class="flex items-center space-x-2">
            <BaseButton
              :variant="viewMode === 'cards' ? 'primary' : 'secondary'"
              @click="viewMode = 'cards'"
              class="!p-2"
              title="Visualização em cards"
            >
              <Squares2X2Icon class="w-5 h-5" />
            </BaseButton>
            <BaseButton
              :variant="viewMode === 'table' ? 'primary' : 'secondary'"
              @click="viewMode = 'table'"
              class="!p-2"
              title="Visualização em tabela"
            >
              <TableCellsIcon class="w-5 h-5" />
            </BaseButton>
          </div>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome da Iniciativa
                </th>
                <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ano
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th class="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unidade Gestora
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Selo
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="iniciativa in filteredIniciativas" 
                :key="iniciativa.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                @click="navigateToDetalhes(iniciativa.id)"
              >
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full inline-flex items-center': true,
                    'bg-indigo-100 text-indigo-800': iniciativa.tipo_iniciativa === 'projeto',
                    'bg-emerald-100 text-emerald-800': iniciativa.tipo_iniciativa === 'boa_pratica',
                    'bg-purple-100 text-purple-800': iniciativa.tipo_iniciativa === 'programa'
                  }">
                    <span class="w-2 h-2 rounded-full mr-1 sm:mr-2" :class="{
                      'bg-indigo-500': iniciativa.tipo_iniciativa === 'projeto',
                      'bg-emerald-500': iniciativa.tipo_iniciativa === 'boa_pratica',
                      'bg-purple-500': iniciativa.tipo_iniciativa === 'programa'
                    }"></span>
                    {{ formatTipoIniciativa(iniciativa.tipo_iniciativa) }}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-4">
                  <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{{ iniciativa.nome_iniciativa }}</div>
                  <!-- Informação móvel -->
                  <div class="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                    {{ iniciativa.ano_vigencia }} | {{ iniciativa.unidade_gestora }}
                  </div>
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {{ iniciativa.ano_vigencia }}
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full': true,
                    'bg-orange-100 text-orange-800': iniciativa.status_atual === 'nao_iniciado',
                    'bg-blue-100 text-blue-800': iniciativa.status_atual === 'em_andamento',
                    'bg-green-100 text-green-800': iniciativa.status_atual === 'concluido',
                    'bg-red-100 text-red-800': iniciativa.status_atual === 'suspenso'
                  }">
                    {{ formatStatus(iniciativa.status_atual) }}
                  </span>
                </td>
                <td class="hidden md:table-cell px-3 sm:px-6 py-4">
                  <div class="text-xs sm:text-sm text-gray-900 dark:text-white">{{ iniciativa.unidade_gestora }}</div>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span v-if="iniciativa.selo" :class="{
                      'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full cursor-pointer': true,
                      'bg-red-100 text-red-800': iniciativa.selo === 'PGJ',
                      'bg-blue-100 text-blue-800': iniciativa.selo === 'CG Cidadã',
                      'bg-green-100 text-green-800': iniciativa.selo === 'Inovação',
                      'bg-purple-100 text-purple-800': iniciativa.selo === 'Sustentabilidade'
                    }">
                      {{ iniciativa.selo }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards View -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="iniciativa in filteredIniciativas"
            :key="iniciativa.id"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToDetalhes(iniciativa.id)"
          >
            <div class="flex flex-col gap-3">
              <span :class="{
                'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full inline-flex items-center w-fit': true,
                'bg-indigo-100 text-indigo-800': iniciativa.tipo_iniciativa === 'projeto',
                'bg-emerald-100 text-emerald-800': iniciativa.tipo_iniciativa === 'boa_pratica',
                'bg-purple-100 text-purple-800': iniciativa.tipo_iniciativa === 'programa'
              }">
                <span class="w-2 h-2 rounded-full mr-1 sm:mr-2" :class="{
                  'bg-indigo-500': iniciativa.tipo_iniciativa === 'projeto',
                  'bg-emerald-500': iniciativa.tipo_iniciativa === 'boa_pratica',
                  'bg-purple-500': iniciativa.tipo_iniciativa === 'programa'
                }"></span>
                {{ formatTipoIniciativa(iniciativa.tipo_iniciativa) }}
              </span>
              
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{{ iniciativa.nome_iniciativa }}</h3>
              
              <div class="flex flex-wrap items-center gap-2">
                <span :class="{
                  'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full': true,
                  'bg-orange-100 text-orange-800': iniciativa.status_atual === 'nao_iniciado',
                  'bg-blue-100 text-blue-800': iniciativa.status_atual === 'em_andamento',
                  'bg-green-100 text-green-800': iniciativa.status_atual === 'concluido',
                  'bg-red-100 text-red-800': iniciativa.status_atual === 'suspenso'
                }">
                  {{ formatStatus(iniciativa.status_atual) }}
                </span>
                <span v-if="iniciativa.selo" :class="{
                  'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full cursor-pointer': true,
                  'bg-red-100 text-red-800': iniciativa.selo === 'PGJ',
                  'bg-blue-100 text-blue-800': iniciativa.selo === 'CG Cidadã',
                  'bg-green-100 text-green-800': iniciativa.selo === 'Inovação',
                  'bg-purple-100 text-purple-800': iniciativa.selo === 'Sustentabilidade'
                }">
                  {{ iniciativa.selo }}
                </span>
                <span v-if="iniciativa.premios?.length" class="flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                  <TrophyIcon class="w-4 h-4 mr-1" />
                  {{ iniciativa.premios.length }}
                </span>
              </div>
            </div>
            
            <div class="mt-4 space-y-1">
              <div class="text-xs sm:text-sm text-gray-900 dark:text-white font-medium line-clamp-2">{{ iniciativa.unidade_gestora }}</div>
              <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ iniciativa.ano_vigencia }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Squares2X2Icon, 
  TableCellsIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  TrophyIcon 
} from '@heroicons/vue/24/outline';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';
import IniciativasHeader from '../components/layout/IniciativasHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';

const router = useRouter();
const activeTab = ref('iniciativas-mpsp');
const searchQuery = ref('');
const selectedArea = ref('Todas as áreas');
const viewMode = ref<'cards' | 'table'>('table');

// Mock data - replace with actual API call
const iniciativas = [
  {
    id: 1,
    nome_iniciativa: 'Estratégia Jurídica',
    tipo_iniciativa: 'projeto',
    unidade_gestora: 'SUBPROCURADORIA-GERAL DE JUSTIÇA JURÍDICA',
    status_atual: 'nao_iniciado',
    ano_vigencia: 2024,
    selo: 'PGJ',
    premios: [
      {
        id: 1,
        nome: 'Prêmio Inovação MPSP 2023',
        data_premiacao: '2023-12-15'
      }
    ]
  },
  {
    id: 2,
    nome_iniciativa: 'Acolhendo o Futuro',
    tipo_iniciativa: 'projeto',
    unidade_gestora: 'PROMOTORIA DE JUSTIÇA DE SÃO BERNARDO DO CAMPO',
    status_atual: 'em_andamento',
    ano_vigencia: 2024,
    selo: 'PGJ'
  },
  {
    id: 3,
    nome_iniciativa: 'Prevenção ao Abuso Sexual Infantil em Escolas',
    tipo_iniciativa: 'boa_pratica',
    unidade_gestora: 'Promotoria de Justiça de Jundiaí - Subárea de Apoio Administrativo',
    status_atual: 'em_andamento',
    ano_vigencia: 2022,
    selo: 'PGJ'
  }
];

const filteredIniciativas = computed(() => {
  return iniciativas.filter(iniciativa => {
    const matchesSearch = 
      iniciativa.nome_iniciativa.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      iniciativa.unidade_gestora.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesArea = selectedArea.value === 'Todas as áreas' || 
      iniciativa.unidade_gestora.toLowerCase().includes(selectedArea.value.toLowerCase());
    
    return matchesSearch && matchesArea;
  });
});

const formatTipoIniciativa = (tipo: string) => {
  const formats = {
    projeto: 'Projeto',
    boa_pratica: 'Boa Prática',
    programa: 'Programa'
  };
  return formats[tipo as keyof typeof formats] || tipo;
};

const formatStatus = (status: string) => {
  const formats = {
    nao_iniciado: 'Não Iniciado',
    em_andamento: 'Em andamento',
    concluido: 'Concluído',
    suspenso: 'Suspenso'
  };
  return formats[status as keyof typeof formats] || status;
};

const navigateToDetalhes = (id: number) => {
  router.push({ name: 'iniciativa-detalhes', params: { id: id.toString() } });
};

// Cálculos de totalização
const totalIniciativas = computed(() => iniciativas.length);

const totalPorTipo = computed(() => {
  return {
    programa: iniciativas.filter(i => i.tipo_iniciativa === 'programa').length,
    projeto: iniciativas.filter(i => i.tipo_iniciativa === 'projeto').length,
    boa_pratica: iniciativas.filter(i => i.tipo_iniciativa === 'boa_pratica').length
  };
});

const totalFinalizadas = computed(() => 
  iniciativas.filter(i => i.status_atual === 'concluido').length
);

const finalizadasPorTipo = computed(() => {
  return {
    programa: iniciativas.filter(i => i.tipo_iniciativa === 'programa' && i.status_atual === 'concluido').length,
    projeto: iniciativas.filter(i => i.tipo_iniciativa === 'projeto' && i.status_atual === 'concluido').length,
    boa_pratica: iniciativas.filter(i => i.tipo_iniciativa === 'boa_pratica' && i.status_atual === 'concluido').length
  };
});
</script>

<style scoped>
.iniciativas-mpsp {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 