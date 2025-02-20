<template>
  <div class="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <TheSidebar
      v-model:activeTab="activeTab"
      class="flex-shrink-0"
    />

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <TheHeader />

      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div v-if="!isGestorIniciativa" class="text-center text-gray-600 dark:text-gray-400">
              <p>Você não tem permissão para acessar esta página.</p>
            </div>

            <template v-else>
              <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Gestão de Iniciativas
                </h1>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  Gerencie as iniciativas que necessitam de aprovação.
                </p>
              </div>

              <!-- Estatísticas -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Aguardando Aprovação
                          </dt>
                          <dd class="flex items-baseline">
                            <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                              {{ iniciativasAguardando.length }}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Aprovadas este mês
                          </dt>
                          <dd class="flex items-baseline">
                            <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                              {{ iniciativasAprovadasMes }}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Devolvidas este mês
                          </dt>
                          <dd class="flex items-baseline">
                            <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                              {{ iniciativasRetornadasMes }}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filtros -->
              <div class="mb-6 flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                  <input
                    type="text"
                    v-model="searchTerm"
                    placeholder="Buscar por nome ou descrição..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div class="w-full sm:w-48">
                  <select
                    v-model="tipoIniciativa"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="projeto">Projetos</option>
                    <option value="boa_pratica">Boas Práticas</option>
                    <option value="programa">Programas</option>
                  </select>
                </div>
              </div>

              <!-- Ações em Lote -->
              <div class="mb-4 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    :checked="selectedIniciativas.length === iniciativasAguardando.length && iniciativasAguardando.length > 0"
                    :indeterminate="selectedIniciativas.length > 0 && selectedIniciativas.length < iniciativasAguardando.length"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    {{ selectedIniciativas.length }} selecionado(s)
                  </span>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="aprovarIniciativas"
                    :disabled="!selectedIniciativas.length"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600"
                  >
                    Aprovar Selecionados
                  </button>
                  <button
                    @click="devolverIniciativas"
                    :disabled="!selectedIniciativas.length"
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Devolver Selecionados
                  </button>
                </div>
              </div>

              <!-- Lista de Iniciativas -->
              <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div v-if="loading" class="flex justify-center items-center h-64">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>

                <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" class="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <span class="sr-only">Selecionar</span>
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Iniciativa
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Unidade
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Data Submissão
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="iniciativa in iniciativasAguardando" :key="iniciativa.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          :checked="selectedIniciativas.includes(iniciativa.id)"
                          @change="(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                              selectedIniciativas.push(iniciativa.id);
                            } else {
                              selectedIniciativas = selectedIniciativas.filter(id => id !== iniciativa.id);
                            }
                          }"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {{ iniciativa.nome_iniciativa }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ iniciativa.descricao_iniciativa }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {{ getTipoIniciativaLabel(iniciativa.tipo_iniciativa) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {{ iniciativa.unidade_gestora }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {{ formatarData(iniciativa.data_criacao) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <router-link
                          :to="{ name: 'iniciativa-detalhes', params: { id: iniciativa.id }}"
                          class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                        >
                          Visualizar
                        </router-link>
                        <button
                          @click="aprovarIniciativa(iniciativa.id)"
                          class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-4"
                        >
                          Aprovar
                        </button>
                        <button
                          @click="devolverIniciativa(iniciativa.id)"
                          class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Devolver
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuth } from '../services/auth';
import { useIniciativas } from '../services/iniciativas';
import type { Iniciativa } from '../types/iniciativas';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';

const activeTab = ref('gestao-iniciativas');
const auth = useAuth();
const iniciativasService = useIniciativas();

const iniciativas = ref<Iniciativa[]>([]);
const loading = ref(false);
const selectedIniciativas = ref<number[]>([]);
const searchTerm = ref('');
const tipoIniciativa = ref('todos');

const isGestorIniciativa = computed(() => {
  return auth.currentUser.value?.nivel_acesso === 'gestor_cadastros' || 
         auth.currentUser.value?.nivel_acesso === 'admin';
});

const iniciativasAguardando = computed(() => {
  return iniciativas.value.filter(iniciativa => {
    const matchesSearch = searchTerm.value === '' || 
      iniciativa.nome_iniciativa.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      iniciativa.descricao_iniciativa.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    const matchesTipo = tipoIniciativa.value === 'todos' || 
      iniciativa.tipo_iniciativa === tipoIniciativa.value;

    return matchesSearch && matchesTipo;
  });
});

const iniciativasAprovadasMes = computed(() => {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  
  return iniciativas.value.filter(iniciativa => {
    const dataAprovacao = new Date(iniciativa.data_aprovacao);
    return dataAprovacao >= primeiroDiaMes && dataAprovacao <= hoje;
  }).length;
});

const iniciativasRetornadasMes = computed(() => {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  
  return iniciativas.value.filter(iniciativa => {
    const dataRetorno = new Date(iniciativa.data_retorno);
    return dataRetorno >= primeiroDiaMes && dataRetorno <= hoje;
  }).length;
});

const getTipoIniciativaLabel = (tipo: string) => {
  const labels = {
    projeto: 'Projeto',
    boa_pratica: 'Boa Prática',
    programa: 'Programa'
  };
  return labels[tipo as keyof typeof labels] || tipo;
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    selectedIniciativas.value = iniciativasAguardando.value.map(i => i.id);
  } else {
    selectedIniciativas.value = [];
  }
};

const aprovarIniciativa = async (id: number) => {
  try {
    await iniciativasService.aprovarIniciativa(id);
    await carregarIniciativas();
  } catch (error) {
    console.error('Erro ao aprovar iniciativa:', error);
  }
};

const devolverIniciativa = async (id: number) => {
  try {
    await iniciativasService.devolverIniciativa(id);
    await carregarIniciativas();
  } catch (error) {
    console.error('Erro ao devolver iniciativa:', error);
  }
};

const aprovarIniciativas = async () => {
  try {
    await Promise.all(selectedIniciativas.value.map(id => iniciativasService.aprovarIniciativa(id)));
    await carregarIniciativas();
    selectedIniciativas.value = [];
  } catch (error) {
    console.error('Erro ao aprovar iniciativas:', error);
  }
};

const devolverIniciativas = async () => {
  try {
    await Promise.all(selectedIniciativas.value.map(id => iniciativasService.devolverIniciativa(id)));
    await carregarIniciativas();
    selectedIniciativas.value = [];
  } catch (error) {
    console.error('Erro ao devolver iniciativas:', error);
  }
};

const carregarIniciativas = async () => {
  loading.value = true;
  try {
    iniciativas.value = await iniciativasService.getIniciativasParaAprovacao();
  } catch (error) {
    console.error('Erro ao carregar iniciativas:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  carregarIniciativas();
});
</script> 