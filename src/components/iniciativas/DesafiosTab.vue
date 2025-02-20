<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Desafio } from '../../types/iniciativas';
import { useDesafios } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const desafiosService = useDesafios(props.iniciativaId);
const desafios = ref<Desafio[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingDesafio = ref<Desafio | null>(null);

const novoDesafio = ref<Omit<Desafio, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  descricao_desafio: '',
  status_desafio: 'pendente'
});

const dataAtual = computed(() => {
  const hoje = new Date();
  return hoje.toISOString().split('T')[0];
});

onMounted(async () => {
  await carregarDesafios();
});

const carregarDesafios = async () => {
  loading.value = true;
  try {
    desafios.value = await desafiosService.getDesafios();
  } catch (error) {
    console.error('Erro ao carregar desafios:', error);
  } finally {
    loading.value = false;
  }
};

const salvarDesafio = async () => {
  saving.value = true;
  try {
    if (editingDesafio.value) {
      await desafiosService.atualizarDesafio(editingDesafio.value.id, novoDesafio.value);
    } else {
      await desafiosService.adicionarDesafio(novoDesafio.value);
    }
    await carregarDesafios();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar desafio:', error);
  } finally {
    saving.value = false;
  }
};

const editarDesafio = (desafio: Desafio) => {
  editingDesafio.value = desafio;
  novoDesafio.value = {
    descricao_desafio: desafio.descricao_desafio,
    status_desafio: desafio.status_desafio
  };
  showForm.value = true;
};

const removerDesafio = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este desafio?')) return;

  try {
    await desafiosService.removerDesafio(id);
    await carregarDesafios();
  } catch (error) {
    console.error('Erro ao remover desafio:', error);
  }
};

const resetForm = () => {
  novoDesafio.value = {
    descricao_desafio: '',
    status_desafio: 'pendente'
  };
  editingDesafio.value = null;
  showForm.value = false;
};

const getStatusDesafioLabel = (status: string) => {
  const statusMap = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    superado: 'Superado'
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
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Desafios da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Desafio
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
              Descrição do Desafio *
            </label>
            <textarea
              v-model="novoDesafio.descricao_desafio"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Status do Desafio *
            </label>
            <select
              v-model="novoDesafio.status_desafio"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="superado">Superado</option>
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
            @click="salvarDesafio"
            :disabled="saving || !novoDesafio.descricao_desafio || !novoDesafio.status_desafio"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingDesafio ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Desafios -->
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
            <tr v-for="desafio in desafios" :key="desafio.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': desafio.status_desafio === 'pendente',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': desafio.status_desafio === 'em_andamento',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': desafio.status_desafio === 'superado'
                    }
                  ]"
                >
                  {{ getStatusDesafioLabel(desafio.status_desafio) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ desafio.descricao_desafio }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarDesafio(desafio)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerDesafio(desafio.id)"
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