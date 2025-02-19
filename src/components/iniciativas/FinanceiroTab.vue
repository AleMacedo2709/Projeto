<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Financeiro da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Financeiro
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white shadow sm:rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Custo Planejado (R$) *
            </label>
            <input
              v-model="novoFinanceiro.custo_planejado"
              type="number"
              step="0.01"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Custo Real (R$)
            </label>
            <input
              v-model="novoFinanceiro.custo_real"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Economia (R$)
            </label>
            <input
              v-model="novoFinanceiro.economia"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="salvarFinanceiro"
            :disabled="saving || !novoFinanceiro.custo_planejado"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingFinanceiro ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Registros Financeiros -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Custo Planejado
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Custo Real
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Economia
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Atualização
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="financeiro in financeiros" :key="financeiro.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R$ {{ formatarValor(financeiro.custo_planejado) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R$ {{ formatarValor(financeiro.custo_real) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                R$ {{ formatarValor(financeiro.economia) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatarData(financeiro.data_atualizacao) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarFinanceiro(financeiro)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerFinanceiro(financeiro.id)"
                  class="text-red-600 hover:text-red-900"
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
const financeiros = ref<Financeiro[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingFinanceiro = ref<Financeiro | null>(null);

const novoFinanceiro = ref<Omit<Financeiro, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  custo_planejado: 0,
  custo_real: 0,
  economia: 0
});

onMounted(async () => {
  await carregarFinanceiros();
});

const carregarFinanceiros = async () => {
  loading.value = true;
  try {
    financeiros.value = await financeiroService.getFinanceiros();
  } catch (error) {
    console.error('Erro ao carregar financeiros:', error);
  } finally {
    loading.value = false;
  }
};

const salvarFinanceiro = async () => {
  saving.value = true;
  try {
    if (editingFinanceiro.value) {
      await financeiroService.atualizarFinanceiro(editingFinanceiro.value.id, novoFinanceiro.value);
    } else {
      await financeiroService.adicionarFinanceiro(novoFinanceiro.value);
    }
    await carregarFinanceiros();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar financeiro:', error);
  } finally {
    saving.value = false;
  }
};

const editarFinanceiro = (financeiro: Financeiro) => {
  editingFinanceiro.value = financeiro;
  novoFinanceiro.value = {
    custo_planejado: financeiro.custo_planejado,
    custo_real: financeiro.custo_real,
    economia: financeiro.economia
  };
  showForm.value = true;
};

const removerFinanceiro = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este registro financeiro?')) return;

  try {
    await financeiroService.removerFinanceiro(id);
    await carregarFinanceiros();
  } catch (error) {
    console.error('Erro ao remover financeiro:', error);
  }
};

const resetForm = () => {
  novoFinanceiro.value = {
    custo_planejado: 0,
    custo_real: 0,
    economia: 0
  };
  editingFinanceiro.value = null;
  showForm.value = false;
};

const formatarValor = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script> 