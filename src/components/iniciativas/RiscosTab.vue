<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Risco } from '../../types/iniciativas';
import { useRiscos } from '../../services/iniciativaRelacionamentos';
import { useUsuarios } from '../../services/usuarios';

const props = defineProps<{
  iniciativaId: number;
}>();

const riscosService = useRiscos(props.iniciativaId);
const usuariosService = useUsuarios();
const riscos = ref<Risco[]>([]);
const usuarios = ref<any[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingRisco = ref<Risco | null>(null);

const novoRisco = ref<Omit<Risco, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  tipo_risco_id: 0,
  descricao_risco: '',
  probabilidade: 'raro',
  impacto: 'sem_impacto',
  acao_mitigacao: '',
  usuario_responsavel_id: 0
});

// Mock data - substituir por chamadas à API
const tiposRisco = [
  { id: 1, nome_tipo: 'Cronograma' },
  { id: 2, nome_tipo: 'Escopo' },
  { id: 3, nome_tipo: 'Financeiro' },
  { id: 4, nome_tipo: 'Pessoal' },
  { id: 5, nome_tipo: 'Político' },
  { id: 6, nome_tipo: 'Qualidade' },
  { id: 7, nome_tipo: 'Resultado' },
  { id: 8, nome_tipo: 'Tecnológico' }
];

const probabilidades = [
  { value: 'raro', label: 'Raro' },
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'quase_certo', label: 'Quase Certo' }
];

const impactos = [
  { value: 'sem_impacto', label: 'Sem Impacto' },
  { value: 'leve', label: 'Leve' },
  { value: 'grave', label: 'Grave' },
  { value: 'gravissimo', label: 'Gravíssimo' }
];

onMounted(async () => {
  await Promise.all([
    carregarRiscos(),
    carregarUsuarios()
  ]);
});

const carregarRiscos = async () => {
  loading.value = true;
  try {
    riscos.value = await riscosService.getRiscos();
  } catch (error) {
    console.error('Erro ao carregar riscos:', error);
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

const salvarRisco = async () => {
  saving.value = true;
  try {
    if (editingRisco.value) {
      await riscosService.atualizarRisco(editingRisco.value.id, novoRisco.value);
    } else {
      await riscosService.adicionarRisco(novoRisco.value);
    }
    await carregarRiscos();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar risco:', error);
  } finally {
    saving.value = false;
  }
};

const editarRisco = (risco: Risco) => {
  editingRisco.value = risco;
  novoRisco.value = {
    tipo_risco_id: risco.tipo_risco_id,
    descricao_risco: risco.descricao_risco,
    probabilidade: risco.probabilidade,
    impacto: risco.impacto,
    acao_mitigacao: risco.acao_mitigacao,
    usuario_responsavel_id: risco.usuario_responsavel_id
  };
  showForm.value = true;
};

const removerRisco = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este risco?')) return;

  try {
    await riscosService.removerRisco(id);
    await carregarRiscos();
  } catch (error) {
    console.error('Erro ao remover risco:', error);
  }
};

const resetForm = () => {
  novoRisco.value = {
    tipo_risco_id: 0,
    descricao_risco: '',
    probabilidade: 'raro',
    impacto: 'sem_impacto',
    acao_mitigacao: '',
    usuario_responsavel_id: 0
  };
  editingRisco.value = null;
  showForm.value = false;
};

const getTipoRiscoNome = (id: number) => {
  return tiposRisco.find(tipo => tipo.id === id)?.nome_tipo || '';
};

const getProbabilidadeLabel = (value: string) => {
  return probabilidades.find(prob => prob.value === value)?.label || '';
};

const getImpactoLabel = (value: string) => {
  return impactos.find(imp => imp.value === value)?.label || '';
};

const validarEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const getUsuarioLabel = (usuarioId: number) => {
  const usuario = usuarios.value.find(u => u.id === usuarioId);
  return usuario ? usuario.nome_usuario : 'Usuário não encontrado';
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Riscos da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Risco
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tipo de Risco *
            </label>
            <select
              v-model="novoRisco.tipo_risco_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option v-for="tipo in tiposRisco" :key="tipo.id" :value="tipo.id">
                {{ tipo.nome_tipo }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Probabilidade *
            </label>
            <select
              v-model="novoRisco.probabilidade"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option v-for="prob in probabilidades" :key="prob.value" :value="prob.value">
                {{ prob.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Impacto *
            </label>
            <select
              v-model="novoRisco.impacto"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option v-for="imp in impactos" :key="imp.value" :value="imp.value">
                {{ imp.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Responsável *
            </label>
            <select
              v-model="novoRisco.usuario_responsavel_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                {{ usuario.nome_usuario }}
              </option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Descrição do Risco *
            </label>
            <textarea
              v-model="novoRisco.descricao_risco"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            ></textarea>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Ação de Mitigação *
            </label>
            <textarea
              v-model="novoRisco.acao_mitigacao"
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
            @click="salvarRisco"
            :disabled="
              saving ||
              !novoRisco.tipo_risco_id ||
              !novoRisco.probabilidade ||
              !novoRisco.impacto ||
              !novoRisco.descricao_risco ||
              !novoRisco.acao_mitigacao ||
              !novoRisco.usuario_responsavel_id
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 dark:disabled:opacity-40"
          >
            {{ saving ? 'Salvando...' : (editingRisco ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Riscos -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo/Probabilidade
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Impacto
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
            <tr v-for="risco in riscos" :key="risco.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="text-gray-900 dark:text-gray-100">{{ getTipoRiscoNome(risco.tipo_risco_id) }}</div>
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': risco.probabilidade === 'raro',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': risco.probabilidade === 'baixa',
                      'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200': risco.probabilidade === 'media',
                      'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200': risco.probabilidade === 'alta',
                      'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200': risco.probabilidade === 'quase_certo'
                    }
                  ]"
                >
                  {{ getProbabilidadeLabel(risco.probabilidade) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': risco.impacto === 'sem_impacto',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': risco.impacto === 'leve',
                      'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200': risco.impacto === 'grave',
                      'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200': risco.impacto === 'gravissimo'
                    }
                  ]"
                >
                  {{ getImpactoLabel(risco.impacto) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                <div>{{ risco.descricao_risco }}</div>
                <div class="text-gray-500 dark:text-gray-400 mt-1">
                  Mitigação: {{ risco.acao_mitigacao }}
                </div>
                <div class="text-gray-500 dark:text-gray-400 mt-1">
                  Responsável: {{ getUsuarioLabel(risco.usuario_responsavel_id) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarRisco(risco)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerRisco(risco.id)"
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