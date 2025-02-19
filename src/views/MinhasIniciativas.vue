<template>
  <div class="min-h-screen flex">
    <TheSidebar v-model:activeTab="activeTab" />
    
    <div class="flex-1">
      <TheHeader />
      
      <div class="p-2 sm:p-4">
        <!-- Cabeçalho com Botão Nova Iniciativa -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Minhas Iniciativas</h2>
          <BaseButton
            variant="primary"
            @click="router.push({ name: 'nova-iniciativa' })"
            class="flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Nova Iniciativa
          </BaseButton>
        </div>

        <!-- Minhas Iniciativas -->
        <div class="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Iniciativas que Gerencio</h3>
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
          <div v-if="viewMode === 'table'" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ano</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selo</th>
                  <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="iniciativa in minhasIniciativas" 
                    :key="iniciativa.id" 
                    class="hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer"
                    @click="router.push({ name: 'iniciativa-detalhes', params: { id: iniciativa.id } })"
                >
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span :class="{
                      'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full inline-flex items-center': true,
                      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300': iniciativa.tipo_iniciativa === 'projeto',
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300': iniciativa.tipo_iniciativa === 'boa_pratica',
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': iniciativa.tipo_iniciativa === 'programa'
                    }">
                      <span class="w-2 h-2 rounded-full mr-2" :class="{
                        'bg-indigo-500 dark:bg-indigo-400': iniciativa.tipo_iniciativa === 'projeto',
                        'bg-emerald-500 dark:bg-emerald-400': iniciativa.tipo_iniciativa === 'boa_pratica',
                        'bg-purple-500 dark:bg-purple-400': iniciativa.tipo_iniciativa === 'programa'
                      }"></span>
                      {{ formatTipoIniciativa(iniciativa.tipo_iniciativa) }}
                    </span>
                  </td>
                  <td class="px-3 sm:px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white">{{ iniciativa.nome_iniciativa }}</div>
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ iniciativa.ano_vigencia }}</div>
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span :class="{
                      'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full': true,
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300': iniciativa.status_atual === 'nao_iniciado',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': iniciativa.status_atual === 'em_andamento',
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': iniciativa.status_atual === 'concluido',
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': iniciativa.status_atual === 'suspenso'
                    }">
                      {{ formatStatus(iniciativa.status_atual) }}
                    </span>
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span v-if="iniciativa.selo" :class="{
                      'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full': true,
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': iniciativa.selo === 'PGJ',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': iniciativa.selo === 'CG Cidadã',
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': iniciativa.selo === 'Inovação',
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': iniciativa.selo === 'Sustentabilidade'
                    }">
                      {{ iniciativa.selo }}
                    </span>
                  </td>
                  <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <button
                        @click.stop="router.push({ name: 'iniciativa-detalhes', params: { id: iniciativa.id } })"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                        title="Ver detalhes"
                      >
                        <EyeIcon class="w-5 h-5" />
                      </button>
                      <button
                        @click.stop="router.push({ name: 'editar-iniciativa', params: { id: iniciativa.id } })"
                        class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/50 transition-colors"
                        title="Editar"
                      >
                        <PencilIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Cards View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div
              v-for="iniciativa in minhasIniciativas"
              :key="iniciativa.id"
              class="bg-white dark:bg-gray-800/30 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              @click="router.push({ name: 'iniciativa-detalhes', params: { id: iniciativa.id } })"
            >
              <div class="flex flex-col gap-3">
                <span :class="{
                  'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full inline-flex items-center w-fit': true,
                  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300': iniciativa.tipo_iniciativa === 'projeto',
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300': iniciativa.tipo_iniciativa === 'boa_pratica',
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': iniciativa.tipo_iniciativa === 'programa'
                }">
                  <span class="w-2 h-2 rounded-full mr-1 sm:mr-2" :class="{
                    'bg-indigo-500 dark:bg-indigo-400': iniciativa.tipo_iniciativa === 'projeto',
                    'bg-emerald-500 dark:bg-emerald-400': iniciativa.tipo_iniciativa === 'boa_pratica',
                    'bg-purple-500 dark:bg-purple-400': iniciativa.tipo_iniciativa === 'programa'
                  }"></span>
                  {{ formatTipoIniciativa(iniciativa.tipo_iniciativa) }}
                </span>
                
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{{ iniciativa.nome_iniciativa }}</h3>
                
                <div class="flex flex-wrap items-center gap-2">
                  <span :class="{
                    'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full': true,
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300': iniciativa.status_atual === 'nao_iniciado',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': iniciativa.status_atual === 'em_andamento',
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': iniciativa.status_atual === 'concluido',
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': iniciativa.status_atual === 'suspenso'
                  }">
                    {{ formatStatus(iniciativa.status_atual) }}
                  </span>
                  <span v-if="iniciativa.selo" :class="{
                    'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full cursor-pointer': true,
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': iniciativa.selo === 'PGJ',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': iniciativa.selo === 'CG Cidadã',
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': iniciativa.selo === 'Inovação',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': iniciativa.selo === 'Sustentabilidade'
                  }">
                    {{ iniciativa.selo }}
                  </span>
                </div>
              </div>
              
              <div class="mt-4 space-y-1">
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ iniciativa.ano_vigencia }}</div>
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="router.push({ name: 'editar-iniciativa', params: { id: iniciativa.id } })"
                    class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/50 transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Minhas Interações -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Iniciativas Curtidas -->
          <div class="bg-white dark:bg-gray-800/30 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Iniciativas Curtidas</h3>
            <div class="space-y-4">
              <div
                v-for="curtida in minhasCurtidas"
                :key="curtida.id"
                class="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
                @click="router.push({ name: 'iniciativa-detalhes', params: { id: curtida.iniciativa.id } })"
              >
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ curtida.iniciativa.nome_iniciativa }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Curtido em {{ formatDate(curtida.data_criacao) }}</p>
                </div>
                <button
                  @click.stop="router.push({ name: 'iniciativa-detalhes', params: { id: curtida.iniciativa.id } })"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <EyeIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Meus Comentários -->
          <div class="bg-white dark:bg-gray-800/30 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meus Comentários</h3>
            <div class="space-y-4">
              <div
                v-for="comentario in meusComentarios"
                :key="comentario.id"
                class="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
                @click="router.push({ name: 'iniciativa-detalhes', params: { id: comentario.iniciativa.id } })"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ comentario.iniciativa.nome_iniciativa }}</h4>
                  <button
                    @click.stop="router.push({ name: 'iniciativa-detalhes', params: { id: comentario.iniciativa.id } })"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ comentario.texto_comentario }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Comentado em {{ formatDate(comentario.data_criacao) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Squares2X2Icon,
  TableCellsIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import { useAuth } from '../services/auth';
import { useIniciativas, type IniciativaComPapel } from '../services/iniciativas';

const router = useRouter();
const activeTab = ref('minhas-iniciativas');
const viewMode = ref<'cards' | 'table'>('table');

const { currentUser } = useAuth();
const { getMinhasIniciativas, getIniciativasPorPapel } = useIniciativas();

const minhasIniciativas = ref<IniciativaComPapel[]>([]);
const minhasCurtidas = ref([
  {
    id: 1,
    iniciativa: {
      id: 3,
      nome_iniciativa: 'Acolhendo o Futuro'
    },
    data_criacao: '2024-01-15T10:30:00'
  }
]);

const meusComentarios = ref([
  {
    id: 1,
    iniciativa: {
      id: 3,
      nome_iniciativa: 'Acolhendo o Futuro'
    },
    texto_comentario: 'Excelente iniciativa! Parabéns aos envolvidos.',
    data_criacao: '2024-01-15T10:35:00'
  }
]);

const carregarIniciativas = async () => {
  if (currentUser.value?.id) {
    try {
      const iniciativas = await getMinhasIniciativas(currentUser.value.id);
      minhasIniciativas.value = iniciativas;
    } catch (error) {
      console.error('Erro ao carregar iniciativas:', error);
      // TODO: Adicionar tratamento de erro adequado
    }
  }
};

onMounted(async () => {
  await carregarIniciativas();
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>

<style scoped>
.minhas-iniciativas {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 