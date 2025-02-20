<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Justificativa } from '../../types/iniciativas';
import { useJustificativas } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const justificativasService = useJustificativas(props.iniciativaId);
const justificativas = ref<Justificativa[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingJustificativa = ref<Justificativa | null>(null);

const novaJustificativa = ref<Omit<Justificativa, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  tipo_justificativa: '',
  descricao_justificativa: ''
});

onMounted(async () => {
  await carregarJustificativas();
});

const carregarJustificativas = async () => {
  loading.value = true;
  try {
    justificativas.value = await justificativasService.getJustificativas();
  } catch (error) {
    console.error('Erro ao carregar justificativas:', error);
  } finally {
    loading.value = false;
  }
};

const salvarJustificativa = async () => {
  saving.value = true;
  try {
    if (editingJustificativa.value) {
      await justificativasService.atualizarJustificativa(editingJustificativa.value.id, novaJustificativa.value);
    } else {
      await justificativasService.adicionarJustificativa(novaJustificativa.value);
    }
    await carregarJustificativas();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar justificativa:', error);
  } finally {
    saving.value = false;
  }
};

const editarJustificativa = (justificativa: Justificativa) => {
  editingJustificativa.value = justificativa;
  novaJustificativa.value = {
    tipo_justificativa: justificativa.tipo_justificativa,
    descricao_justificativa: justificativa.descricao_justificativa
  };
  showForm.value = true;
};

const removerJustificativa = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover esta justificativa?')) return;

  try {
    await justificativasService.removerJustificativa(id);
    await carregarJustificativas();
  } catch (error) {
    console.error('Erro ao remover justificativa:', error);
  }
};

const resetForm = () => {
  novaJustificativa.value = {
    tipo_justificativa: '',
    descricao_justificativa: ''
  };
  editingJustificativa.value = null;
  showForm.value = false;
};

const getTipoJustificativaLabel = (tipo: string) => {
  const tipos = {
    resolutividade: 'Resolutividade',
    inovacao: 'Inovação',
    transparencia: 'Transparência',
    proatividade: 'Proatividade',
    cooperacao: 'Cooperação'
  };
  return tipos[tipo as keyof typeof tipos] || tipo;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Justificativas da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Justificativa
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
              Tipo de Justificativa *
            </label>
            <select
              v-model="novaJustificativa.tipo_justificativa"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="resolutividade">Resolutividade</option>
              <option value="inovacao">Inovação</option>
              <option value="transparencia">Transparência</option>
              <option value="proatividade">Proatividade</option>
              <option value="cooperacao">Cooperação</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Descrição da Justificativa *
            </label>
            <textarea
              v-model="novaJustificativa.descricao_justificativa"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            ></textarea>
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
            @click="salvarJustificativa"
            :disabled="saving || !novaJustificativa.tipo_justificativa || !novaJustificativa.descricao_justificativa"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingJustificativa ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Justificativas -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
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
            <tr v-for="justificativa in justificativas" :key="justificativa.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ getTipoJustificativaLabel(justificativa.tipo_justificativa) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ justificativa.descricao_justificativa }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarJustificativa(justificativa)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerJustificativa(justificativa.id)"
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