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
  ano_premio: new Date().getFullYear().toString(),
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
    ano_premio: new Date().getFullYear().toString(),
    descricao_premio: ''
  };
  editingPremio.value = null;
  showForm.value = false;
};

const anosDisponiveis = () => {
  const anoAtual = new Date().getFullYear();
  const anos = [];
  for (let i = anoAtual - 10; i <= anoAtual + 1; i++) {
    anos.push(i.toString());
  }
  return anos;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Prêmios da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Prêmio
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
              Instituição *
            </label>
            <input
              v-model="novoPremio.nome_instituicao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Classificação *
            </label>
            <input
              v-model="novoPremio.tipo_classificacao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Ano *
            </label>
            <select
              v-model="novoPremio.ano_premio"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="ano in anosDisponiveis()" :key="ano" :value="ano">
                {{ ano }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">
              Descrição do Prêmio *
            </label>
            <textarea
              v-model="novoPremio.descricao_premio"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
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
            @click="salvarPremio"
            :disabled="
              saving ||
              !novoPremio.nome_instituicao ||
              !novoPremio.tipo_classificacao ||
              !novoPremio.descricao_premio
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingPremio ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Prêmios -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="premio in premios" :key="premio.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-gray-900">{{ premio.nome_instituicao }}</h4>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ premio.ano_premio }}
                  </span>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-600">{{ premio.tipo_classificacao }}</p>
                  <p class="mt-1 text-sm text-gray-500">{{ premio.descricao_premio }}</p>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="editarPremio(premio)"
                    class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Editar</span>
                    <!-- Heroicon name: pencil -->
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="removerPremio(premio.id)"
                    class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span class="sr-only">Remover</span>
                    <!-- Heroicon name: trash -->
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template> 