<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Risco } from '../../types/iniciativas';
import { useRiscos } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const riscosService = useRiscos(props.iniciativaId);
const riscos = ref<Risco[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingRisco = ref<Risco | null>(null);

const novoRisco = ref<Omit<Risco, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  tipo_risco_id: 0,
  descricao_risco: '',
  probabilidade: 'media',
  impacto: 'leve',
  acao_mitigacao: '',
  usuario_responsavel_id: 0
});

onMounted(async () => {
  await carregarRiscos();
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
    probabilidade: 'media',
    impacto: 'leve',
    acao_mitigacao: '',
    usuario_responsavel_id: 0
  };
  editingRisco.value = null;
  showForm.value = false;
};

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

const tiposRisco = [
  { value: 1, label: 'Cronograma' },
  { value: 2, label: 'Escopo' },
  { value: 3, label: 'Financeiro' },
  { value: 4, label: 'Pessoal' },
  { value: 5, label: 'Político' },
  { value: 6, label: 'Qualidade' },
  { value: 7, label: 'Resultado' },
  { value: 8, label: 'Tecnológico' }
];

const getCorRisco = (probabilidade: string, impacto: string) => {
  const nivelProbabilidade = {
    raro: 1,
    baixa: 2,
    media: 3,
    alta: 4,
    quase_certo: 5
  }[probabilidade] || 0;

  const nivelImpacto = {
    sem_impacto: 1,
    leve: 2,
    grave: 3,
    gravissimo: 4
  }[impacto] || 0;

  const nivelRisco = nivelProbabilidade * nivelImpacto;

  if (nivelRisco <= 4) return 'bg-green-100 text-green-800'; // Baixo
  if (nivelRisco <= 8) return 'bg-yellow-100 text-yellow-800'; // Médio
  if (nivelRisco <= 12) return 'bg-orange-100 text-orange-800'; // Alto
  return 'bg-red-100 text-red-800'; // Crítico
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Riscos da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Risco
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
              Tipo de Risco *
            </label>
            <select
              v-model="novoRisco.tipo_risco_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="0" disabled>Selecione um tipo</option>
              <option v-for="tipo in tiposRisco" :key="tipo.value" :value="tipo.value">
                {{ tipo.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Usuário Responsável *
            </label>
            <select
              v-model="novoRisco.usuario_responsavel_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <!-- TODO: Carregar usuários do backend -->
              <option :value="0" disabled>Selecione um usuário</option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">
              Descrição do Risco *
            </label>
            <textarea
              v-model="novoRisco.descricao_risco"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Probabilidade *
            </label>
            <select
              v-model="novoRisco.probabilidade"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="prob in probabilidades" :key="prob.value" :value="prob.value">
                {{ prob.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Impacto *
            </label>
            <select
              v-model="novoRisco.impacto"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="imp in impactos" :key="imp.value" :value="imp.value">
                {{ imp.label }}
              </option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">
              Ação de Mitigação *
            </label>
            <textarea
              v-model="novoRisco.acao_mitigacao"
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
            @click="salvarRisco"
            :disabled="saving || !novoRisco.tipo_risco_id || !novoRisco.descricao_risco || !novoRisco.acao_mitigacao || !novoRisco.usuario_responsavel_id"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingRisco ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Riscos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="risco in riscos" :key="risco.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">
                    {{ tiposRisco.find(t => t.value === risco.tipo_risco_id)?.label }}
                  </p>
                  <div class="flex space-x-2">
                    <span
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getCorRisco(risco.probabilidade, risco.impacto)
                      ]"
                    >
                      {{ probabilidades.find(p => p.value === risco.probabilidade)?.label }} /
                      {{ impactos.find(i => i.value === risco.impacto)?.label }}
                    </span>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-600">{{ risco.descricao_risco }}</p>
                  <p class="mt-2 text-sm text-gray-500">
                    <span class="font-medium">Mitigação:</span> {{ risco.acao_mitigacao }}
                  </p>
                </div>
                <div class="mt-2 text-sm text-gray-500">
                  <!-- TODO: Mostrar nome do usuário -->
                  Responsável: {{ risco.usuario_responsavel_id }}
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="editarRisco(risco)"
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
                    @click="removerRisco(risco.id)"
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