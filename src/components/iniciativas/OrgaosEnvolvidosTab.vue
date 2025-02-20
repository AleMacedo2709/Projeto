<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { OrgaoEnvolvido } from '../../types/iniciativas';
import { useOrgaosEnvolvidos } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const orgaosService = useOrgaosEnvolvidos(props.iniciativaId);
const orgaos = ref<OrgaoEnvolvido[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingOrgao = ref<OrgaoEnvolvido | null>(null);

const novoOrgao = ref<Omit<OrgaoEnvolvido, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  nome_orgao: '',
  papel_orgao: '',
  nome_contato: '',
  email_contato: '',
  obrigatorio: false
});

onMounted(async () => {
  await carregarOrgaos();
});

const carregarOrgaos = async () => {
  loading.value = true;
  try {
    orgaos.value = await orgaosService.getOrgaosEnvolvidos();
  } catch (error) {
    console.error('Erro ao carregar órgãos:', error);
  } finally {
    loading.value = false;
  }
};

const salvarOrgao = async () => {
  saving.value = true;
  try {
    if (editingOrgao.value) {
      await orgaosService.atualizarOrgaoEnvolvido(editingOrgao.value.id, novoOrgao.value);
    } else {
      await orgaosService.adicionarOrgaoEnvolvido(novoOrgao.value);
    }
    await carregarOrgaos();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar órgão:', error);
  } finally {
    saving.value = false;
  }
};

const editarOrgao = (orgao: OrgaoEnvolvido) => {
  editingOrgao.value = orgao;
  novoOrgao.value = {
    nome_orgao: orgao.nome_orgao,
    papel_orgao: orgao.papel_orgao,
    nome_contato: orgao.nome_contato,
    email_contato: orgao.email_contato,
    obrigatorio: orgao.obrigatorio
  };
  showForm.value = true;
};

const removerOrgao = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este órgão?')) return;

  try {
    await orgaosService.removerOrgaoEnvolvido(id);
    await carregarOrgaos();
  } catch (error) {
    console.error('Erro ao remover órgão:', error);
  }
};

const resetForm = () => {
  novoOrgao.value = {
    nome_orgao: '',
    papel_orgao: '',
    nome_contato: '',
    email_contato: '',
    obrigatorio: false
  };
  editingOrgao.value = null;
  showForm.value = false;
};

const getPapelOrgaoLabel = (papel: string) => {
  const papeis = {
    responsavel: 'Responsável',
    executor: 'Executor',
    parceiro: 'Parceiro',
    beneficiario: 'Beneficiário',
    outro: 'Outro'
  };
  return papeis[papel as keyof typeof papeis] || papel;
};

const validarEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Órgãos Envolvidos</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Órgão
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
              Nome do Órgão *
            </label>
            <input
              v-model="novoOrgao.nome_orgao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Papel do Órgão *
            </label>
            <select
              v-model="novoOrgao.papel_orgao"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="responsavel">Responsável</option>
              <option value="executor">Executor</option>
              <option value="parceiro">Parceiro</option>
              <option value="beneficiario">Beneficiário</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nome do Contato
            </label>
            <input
              v-model="novoOrgao.nome_contato"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email do Contato
            </label>
            <input
              v-model="novoOrgao.email_contato"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Obrigatório
            </label>
            <div class="mt-1">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="novoOrgao.obrigatorio"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-600">Sim</span>
              </label>
            </div>
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
            @click="salvarOrgao"
            :disabled="saving || !novoOrgao.nome_orgao || !novoOrgao.papel_orgao"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingOrgao ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Órgãos -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Órgão
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Papel
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contato
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Obrigatório
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="orgao in orgaos" :key="orgao.id">
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                <div>{{ orgao.nome_orgao }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ getPapelOrgaoLabel(orgao.papel_orgao) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                <div v-if="orgao.nome_contato">{{ orgao.nome_contato }}</div>
                <div v-if="orgao.email_contato" class="text-gray-500 dark:text-gray-400">
                  {{ orgao.email_contato }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ orgao.obrigatorio ? 'Sim' : 'Não' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarOrgao(orgao)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerOrgao(orgao.id)"
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