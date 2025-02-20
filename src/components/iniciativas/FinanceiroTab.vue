<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Financeiro da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Financeiro
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Custo Planejado (R$) *
            </label>
            <input
              v-model="novoFinanceiro.custo_planejado"
              type="number"
              step="0.01"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Custo Real (R$)
            </label>
            <input
              v-model="novoFinanceiro.custo_real"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Economia (R$)
            </label>
            <input
              v-model="novoFinanceiro.economia"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="salvarFinanceiro"
            :disabled="saving || !novoFinanceiro.custo_planejado"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (financeiro ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Registros Financeiros -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Custo Planejado
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Custo Real
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Economia
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data de Atualização
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="financeiro">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                R$ {{ formatarValor(financeiro.custo_planejado) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                R$ {{ formatarValor(financeiro.custo_real) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                R$ {{ formatarValor(financeiro.economia) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatarData(financeiro.data_atualizacao) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="showForm = true"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerFinanceiro(financeiro.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                >
                  Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Financeiro } from '../../types/iniciativas';
import { useFinanceiro } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const financeiroService = useFinanceiro(props.iniciativaId);
const financeiro = ref<Financeiro | null>(null);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);

const novoFinanceiro = ref<Omit<Financeiro, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  custo_planejado: 0,
  custo_real: 0,
  economia: 0
});

onMounted(async () => {
  await carregarFinanceiro();
});

const carregarFinanceiro = async () => {
  loading.value = true;
  try {
    financeiro.value = await financeiroService.getFinanceiro();
    if (financeiro.value) {
      novoFinanceiro.value = {
        custo_planejado: financeiro.value.custo_planejado || 0,
        custo_real: financeiro.value.custo_real || 0,
        economia: financeiro.value.economia || 0
      };
    }
  } catch (error) {
    console.error('Erro ao carregar financeiro:', error);
  } finally {
    loading.value = false;
  }
};

const salvarFinanceiro = async () => {
  saving.value = true;
  try {
    if (financeiro.value) {
      await financeiroService.atualizarFinanceiro({
        ...novoFinanceiro.value,
        id: financeiro.value.id
      });
    } else {
      await financeiroService.salvarFinanceiro(novoFinanceiro.value);
    }
    await carregarFinanceiro();
    showForm.value = false;
  } catch (error) {
    console.error('Erro ao salvar financeiro:', error);
  } finally {
    saving.value = false;
  }
};

const removerFinanceiro = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este registro financeiro?')) return;

  try {
    await financeiroService.removerFinanceiro(id);
    await carregarFinanceiro();
  } catch (error) {
    console.error('Erro ao remover financeiro:', error);
  }
};

const resetForm = () => {
  if (financeiro.value) {
    novoFinanceiro.value = {
      custo_planejado: financeiro.value.custo_planejado || 0,
      custo_real: financeiro.value.custo_real || 0,
      economia: financeiro.value.economia || 0
    };
  } else {
    novoFinanceiro.value = {
      custo_planejado: 0,
      custo_real: 0,
      economia: 0
    };
  }
  showForm.value = false;
};

const formatarValor = (valor: number | undefined) => {
  if (valor === undefined || valor === null) return '0,00';
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script> 