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
  obrigatorio: true
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
    obrigatorio: true
  };
  editingOrgao.value = null;
  showForm.value = false;
};

const validarEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Órgãos Envolvidos na Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Órgão
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
              Nome do Órgão *
            </label>
            <input
              v-model="novoOrgao.nome_orgao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Papel do Órgão *
            </label>
            <input
              v-model="novoOrgao.papel_orgao"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Nome do Contato *
            </label>
            <input
              v-model="novoOrgao.nome_contato"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Email do Contato *
            </label>
            <input
              v-model="novoOrgao.email_contato"
              type="email"
              required
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
                { 'border-red-300': novoOrgao.email_contato && !validarEmail(novoOrgao.email_contato) }
              ]"
            />
            <p
              v-if="novoOrgao.email_contato && !validarEmail(novoOrgao.email_contato)"
              class="mt-1 text-sm text-red-600"
            >
              Email inválido
            </p>
          </div>

          <div class="col-span-2">
            <div class="relative flex items-start">
              <div class="flex items-center h-5">
                <input
                  v-model="novoOrgao.obrigatorio"
                  type="checkbox"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Participação Obrigatória</label>
                <p class="text-gray-500">Marque esta opção se a participação deste órgão é obrigatória para a iniciativa.</p>
              </div>
            </div>
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
            @click="salvarOrgao"
            :disabled="
              saving ||
              !novoOrgao.nome_orgao ||
              !novoOrgao.papel_orgao ||
              !novoOrgao.nome_contato ||
              !novoOrgao.email_contato ||
              !validarEmail(novoOrgao.email_contato)
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingOrgao ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Órgãos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="orgao in orgaos" :key="orgao.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-gray-900">{{ orgao.nome_orgao }}</h4>
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      orgao.obrigatorio ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ orgao.obrigatorio ? 'Obrigatório' : 'Opcional' }}
                  </span>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      {{ orgao.papel_orgao }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>{{ orgao.nome_contato }} ({{ orgao.email_contato }})</p>
                  </div>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="editarOrgao(orgao)"
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
                    @click="removerOrgao(orgao.id)"
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