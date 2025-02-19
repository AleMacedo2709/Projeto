<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Acao } from '../../types/iniciativas';
import { useAcoes } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const acoesService = useAcoes(props.iniciativaId);
const acoes = ref<Acao[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingAcao = ref<Acao | null>(null);

const novaAcao = ref<Omit<Acao, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  nome_acao: '',
  unidade_responsavel: '',
  usuario_responsavel_id: 0,
  data_inicio_planejada: '',
  data_fim_planejada: '',
  data_inicio_real: '',
  data_fim_real: '',
  status_acao: 'nao_iniciado'
});

onMounted(async () => {
  await carregarAcoes();
});

const carregarAcoes = async () => {
  loading.value = true;
  try {
    acoes.value = await acoesService.getAcoes();
  } catch (error) {
    console.error('Erro ao carregar ações:', error);
  } finally {
    loading.value = false;
  }
};

const salvarAcao = async () => {
  saving.value = true;
  try {
    if (editingAcao.value) {
      await acoesService.atualizarAcao(editingAcao.value.id, novaAcao.value);
    } else {
      await acoesService.adicionarAcao(novaAcao.value);
    }
    await carregarAcoes();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar ação:', error);
  } finally {
    saving.value = false;
  }
};

const editarAcao = (acao: Acao) => {
  editingAcao.value = acao;
  novaAcao.value = {
    nome_acao: acao.nome_acao,
    unidade_responsavel: acao.unidade_responsavel,
    usuario_responsavel_id: acao.usuario_responsavel_id,
    data_inicio_planejada: acao.data_inicio_planejada || '',
    data_fim_planejada: acao.data_fim_planejada || '',
    data_inicio_real: acao.data_inicio_real || '',
    data_fim_real: acao.data_fim_real || '',
    status_acao: acao.status_acao
  };
  showForm.value = true;
};

const removerAcao = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover esta ação?')) return;

  try {
    await acoesService.removerAcao(id);
    await carregarAcoes();
  } catch (error) {
    console.error('Erro ao remover ação:', error);
  }
};

const resetForm = () => {
  novaAcao.value = {
    nome_acao: '',
    unidade_responsavel: '',
    usuario_responsavel_id: 0,
    data_inicio_planejada: '',
    data_fim_planejada: '',
    data_inicio_real: '',
    data_fim_real: '',
    status_acao: 'nao_iniciado'
  };
  editingAcao.value = null;
  showForm.value = false;
};

const statusAcao = [
  { value: 'nao_iniciado', label: 'Não Iniciado' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluido', label: 'Concluído' }
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Ações da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Ação
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white shadow sm:rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">
              Nome da Ação *
            </label>
            <input
              v-model="novaAcao.nome_acao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Unidade Responsável *
            </label>
            <input
              v-model="novaAcao.unidade_responsavel"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Usuário Responsável *
            </label>
            <select
              v-model="novaAcao.usuario_responsavel_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <!-- TODO: Carregar usuários do backend -->
              <option :value="0" disabled>Selecione um usuário</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Data de Início Planejada
            </label>
            <input
              v-model="novaAcao.data_inicio_planejada"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Data de Fim Planejada
            </label>
            <input
              v-model="novaAcao.data_fim_planejada"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Data de Início Real
            </label>
            <input
              v-model="novaAcao.data_inicio_real"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Data de Fim Real
            </label>
            <input
              v-model="novaAcao.data_fim_real"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Status da Ação *
            </label>
            <select
              v-model="novaAcao.status_acao"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="status in statusAcao" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
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
            @click="salvarAcao"
            :disabled="saving || !novaAcao.nome_acao || !novaAcao.unidade_responsavel || !novaAcao.usuario_responsavel_id"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingAcao ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Ações -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="acao in acoes" :key="acao.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ acao.nome_acao }}</h4>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      {{ acao.unidade_responsavel }}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <!-- TODO: Mostrar nome do usuário -->
                      Responsável: {{ acao.usuario_responsavel_id }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        {
                          'bg-yellow-100 text-yellow-800': acao.status_acao === 'nao_iniciado',
                          'bg-blue-100 text-blue-800': acao.status_acao === 'em_andamento',
                          'bg-green-100 text-green-800': acao.status_acao === 'concluido'
                        }
                      ]"
                    >
                      {{ statusAcao.find(s => s.value === acao.status_acao)?.label }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="editarAcao(acao)"
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
                    @click="removerAcao(acao.id)"
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