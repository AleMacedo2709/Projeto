<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Resultado } from '../../types/iniciativas';
import { useResultados } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const resultadosService = useResultados(props.iniciativaId);
const resultados = ref<Resultado[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingResultado = ref<Resultado | null>(null);

const novoResultado = ref<Omit<Resultado, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  descricao_resultado: '',
  status_resultado: 'nao_alcancado'
});

const dataAtual = computed(() => {
  const hoje = new Date();
  return hoje.toISOString().split('T')[0];
});

onMounted(async () => {
  await carregarResultados();
});

const carregarResultados = async () => {
  loading.value = true;
  try {
    resultados.value = await resultadosService.getResultados();
  } catch (error) {
    console.error('Erro ao carregar resultados:', error);
  } finally {
    loading.value = false;
  }
};

const salvarResultado = async () => {
  saving.value = true;
  try {
    if (editingResultado.value) {
      await resultadosService.atualizarResultado(editingResultado.value.id, novoResultado.value);
    } else {
      await resultadosService.adicionarResultado(novoResultado.value);
    }
    await carregarResultados();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
  } finally {
    saving.value = false;
  }
};

const editarResultado = (resultado: Resultado) => {
  editingResultado.value = resultado;
  novoResultado.value = {
    descricao_resultado: resultado.descricao_resultado,
    status_resultado: resultado.status_resultado
  };
  showForm.value = true;
};

const removerResultado = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este resultado?')) return;

  try {
    await resultadosService.removerResultado(id);
    await carregarResultados();
  } catch (error) {
    console.error('Erro ao remover resultado:', error);
  }
};

const resetForm = () => {
  novoResultado.value = {
    descricao_resultado: '',
    status_resultado: 'nao_alcancado'
  };
  editingResultado.value = null;
  showForm.value = false;
};

const getStatusResultadoLabel = (status: string) => {
  const statusMap = {
    alcancado: 'Alcançado',
    parcialmente_alcancado: 'Parcialmente Alcançado',
    nao_alcancado: 'Não Alcançado'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Resultados da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Resultado
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Descrição do Resultado *
            </label>
            <textarea
              v-model="novoResultado.descricao_resultado"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Status do Resultado *
            </label>
            <select
              v-model="novoResultado.status_resultado"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="alcancado">Alcançado</option>
              <option value="parcialmente_alcancado">Parcialmente Alcançado</option>
              <option value="nao_alcancado">Não Alcançado</option>
            </select>
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
            @click="salvarResultado"
            :disabled="saving || !novoResultado.descricao_resultado || !novoResultado.status_resultado"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingResultado ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Resultados -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Descrição
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="resultado in resultados" :key="resultado.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': resultado.status_resultado === 'alcancado',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': resultado.status_resultado === 'parcialmente_alcancado',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': resultado.status_resultado === 'nao_alcancado'
                    }
                  ]"
                >
                  {{ getStatusResultadoLabel(resultado.status_resultado) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ resultado.descricao_resultado }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarResultado(resultado)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerResultado(resultado.id)"
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