<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Premio } from '../../types/iniciativas';
import { usePremios } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const premiosService = usePremios(props.iniciativaId);
const premios = ref<Premio[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingPremio = ref<Premio | null>(null);

const novoPremio = ref<Omit<Premio, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  nome_instituicao: '',
  tipo_classificacao: '',
  ano_premio: '',
  descricao_premio: ''
});

onMounted(async () => {
  await carregarPremios();
});

const carregarPremios = async () => {
  loading.value = true;
  try {
    premios.value = await premiosService.getPremios();
  } catch (error) {
    console.error('Erro ao carregar prêmios:', error);
  } finally {
    loading.value = false;
  }
};

const salvarPremio = async () => {
  saving.value = true;
  try {
    if (editingPremio.value) {
      await premiosService.atualizarPremio(editingPremio.value.id, novoPremio.value);
    } else {
      await premiosService.adicionarPremio(novoPremio.value);
    }
    await carregarPremios();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar prêmio:', error);
  } finally {
    saving.value = false;
  }
};

const editarPremio = (premio: Premio) => {
  editingPremio.value = premio;
  novoPremio.value = {
    nome_instituicao: premio.nome_instituicao,
    tipo_classificacao: premio.tipo_classificacao,
    ano_premio: premio.ano_premio,
    descricao_premio: premio.descricao_premio
  };
  showForm.value = true;
};

const removerPremio = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este prêmio?')) return;

  try {
    await premiosService.removerPremio(id);
    await carregarPremios();
  } catch (error) {
    console.error('Erro ao remover prêmio:', error);
  }
};

const resetForm = () => {
  novoPremio.value = {
    nome_instituicao: '',
    tipo_classificacao: '',
    ano_premio: '',
    descricao_premio: ''
  };
  editingPremio.value = null;
  showForm.value = false;
};

const validarAno = (ano: string) => {
  const anoAtual = new Date().getFullYear();
  const anoNumerico = parseInt(ano);
  return !isNaN(anoNumerico) && anoNumerico >= 1900 && anoNumerico <= anoAtual;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Prêmios da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Prêmio
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
              Nome da Instituição *
            </label>
            <input
              v-model="novoPremio.nome_instituicao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tipo de Classificação *
            </label>
            <input
              v-model="novoPremio.tipo_classificacao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Ano do Prêmio *
            </label>
            <input
              v-model="novoPremio.ano_premio"
              type="text"
              pattern="\d{4}"
              maxlength="4"
              placeholder="AAAA"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Descrição do Prêmio *
            </label>
            <textarea
              v-model="novoPremio.descricao_premio"
              rows="3"
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
            @click="salvarPremio"
            :disabled="
              saving ||
              !novoPremio.nome_instituicao ||
              !novoPremio.tipo_classificacao ||
              !novoPremio.ano_premio ||
              !novoPremio.descricao_premio ||
              !validarAno(novoPremio.ano_premio)
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingPremio ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Prêmios -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Instituição
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Classificação
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ano
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
            <tr v-for="premio in premios" :key="premio.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ premio.nome_instituicao }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ premio.tipo_classificacao }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ premio.ano_premio }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ premio.descricao_premio }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarPremio(premio)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerPremio(premio.id)"
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