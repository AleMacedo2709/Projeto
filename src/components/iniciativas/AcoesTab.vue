<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Acao } from '../../types/iniciativas';
import { useAcoes } from '../../services/iniciativaRelacionamentos';
import { useUsuarios } from '../../services/usuarios';

const props = defineProps<{
  iniciativaId: number;
}>();

const acoesService = useAcoes(props.iniciativaId);
const usuariosService = useUsuarios();
const acoes = ref<Acao[]>([]);
const usuarios = ref<any[]>([]);
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

const dataAtual = computed(() => {
  const hoje = new Date();
  return hoje.toISOString().split('T')[0];
});

onMounted(async () => {
  await Promise.all([
    carregarAcoes(),
    carregarUsuarios()
  ]);
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

const carregarUsuarios = async () => {
  try {
    usuarios.value = await usuariosService.getUsuarios();
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
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
    data_inicio_planejada: acao.data_inicio_planejada,
    data_fim_planejada: acao.data_fim_planejada,
    data_inicio_real: acao.data_inicio_real,
    data_fim_real: acao.data_fim_real,
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

const getStatusAcaoLabel = (status: string) => {
  const statusMap = {
    nao_iniciado: 'Não Iniciado',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

const getUsuarioLabel = (usuarioId: number) => {
  const usuario = usuarios.value.find(u => u.id === usuarioId);
  return usuario ? usuario.nome_usuario : 'Usuário não encontrado';
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Ações da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Ação
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nome da Ação *
            </label>
            <input
              v-model="novaAcao.nome_acao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Unidade Responsável *
            </label>
            <input
              v-model="novaAcao.unidade_responsavel"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Responsável *
            </label>
            <select
              v-model="novaAcao.usuario_responsavel_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                {{ usuario.nome_usuario }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Status *
            </label>
            <select
              v-model="novaAcao.status_acao"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="nao_iniciado">Não Iniciado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Início Planejada *
            </label>
            <input
              v-model="novaAcao.data_inicio_planejada"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Fim Planejada *
            </label>
            <input
              v-model="novaAcao.data_fim_planejada"
              type="date"
              required
              :min="novaAcao.data_inicio_planejada"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Início Real
            </label>
            <input
              v-model="novaAcao.data_inicio_real"
              type="date"
              :disabled="novaAcao.status_acao === 'nao_iniciado'"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Fim Real
            </label>
            <input
              v-model="novaAcao.data_fim_real"
              type="date"
              :min="novaAcao.data_inicio_real"
              :disabled="novaAcao.status_acao !== 'concluido'"
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
            @click="salvarAcao"
            :disabled="
              saving ||
              !novaAcao.nome_acao ||
              !novaAcao.unidade_responsavel ||
              !novaAcao.usuario_responsavel_id ||
              !novaAcao.status_acao ||
              !novaAcao.data_inicio_planejada ||
              !novaAcao.data_fim_planejada
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingAcao ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Ações -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome/Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Responsável
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Datas
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="acao in acoes" :key="acao.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="text-gray-900 dark:text-gray-100">{{ acao.nome_acao }}</div>
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': acao.status_acao === 'nao_iniciado',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': acao.status_acao === 'em_andamento',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': acao.status_acao === 'concluido'
                    }
                  ]"
                >
                  {{ getStatusAcaoLabel(acao.status_acao) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                <div>{{ acao.unidade_responsavel }}</div>
                <div class="text-gray-500 dark:text-gray-400">
                  {{ getUsuarioLabel(acao.usuario_responsavel_id) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <div>Planejado: {{ formatarData(acao.data_inicio_planejada) }} - {{ formatarData(acao.data_fim_planejada) }}</div>
                <div v-if="acao.data_inicio_real" class="text-gray-500 dark:text-gray-400">
                  Real: {{ formatarData(acao.data_inicio_real) }}
                  {{ acao.data_fim_real ? ` - ${formatarData(acao.data_fim_real)}` : '' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarAcao(acao)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerAcao(acao.id)"
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