<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Publicidade } from '../../types/iniciativas';
import { usePublicidades } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const publicidadesService = usePublicidades(props.iniciativaId);
const publicidades = ref<Publicidade[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingPublicidade = ref<Publicidade | null>(null);

const novaPublicidade = ref<Omit<Publicidade, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  nome_ferramenta: '',
  publico_alvo: '',
  frequencia: 'unica',
  usuario_responsavel_id: 0,
  data_publicacao: new Date().toISOString().split('T')[0]
});

onMounted(async () => {
  await carregarPublicidades();
});

const carregarPublicidades = async () => {
  loading.value = true;
  try {
    publicidades.value = await publicidadesService.getPublicidades();
  } catch (error) {
    console.error('Erro ao carregar publicidades:', error);
  } finally {
    loading.value = false;
  }
};

const salvarPublicidade = async () => {
  saving.value = true;
  try {
    if (editingPublicidade.value) {
      await publicidadesService.atualizarPublicidade(editingPublicidade.value.id, novaPublicidade.value);
    } else {
      await publicidadesService.adicionarPublicidade(novaPublicidade.value);
    }
    await carregarPublicidades();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar publicidade:', error);
  } finally {
    saving.value = false;
  }
};

const editarPublicidade = (publicidade: Publicidade) => {
  editingPublicidade.value = publicidade;
  novaPublicidade.value = {
    nome_ferramenta: publicidade.nome_ferramenta,
    publico_alvo: publicidade.publico_alvo,
    frequencia: publicidade.frequencia,
    usuario_responsavel_id: publicidade.usuario_responsavel_id,
    data_publicacao: publicidade.data_publicacao
  };
  showForm.value = true;
};

const removerPublicidade = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover esta publicidade?')) return;

  try {
    await publicidadesService.removerPublicidade(id);
    await carregarPublicidades();
  } catch (error) {
    console.error('Erro ao remover publicidade:', error);
  }
};

const resetForm = () => {
  novaPublicidade.value = {
    nome_ferramenta: '',
    publico_alvo: '',
    frequencia: 'unica',
    usuario_responsavel_id: 0,
    data_publicacao: new Date().toISOString().split('T')[0]
  };
  editingPublicidade.value = null;
  showForm.value = false;
};

const frequencias = [
  { value: 'unica', label: 'Única' },
  { value: 'diaria', label: 'Diária' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'bimestral', label: 'Bimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' }
];

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Publicidades da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Publicidade
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
              Ferramenta de Publicidade *
            </label>
            <input
              v-model="novaPublicidade.nome_ferramenta"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Público Alvo *
            </label>
            <input
              v-model="novaPublicidade.publico_alvo"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Frequência *
            </label>
            <select
              v-model="novaPublicidade.frequencia"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="freq in frequencias" :key="freq.value" :value="freq.value">
                {{ freq.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Data de Publicação *
            </label>
            <input
              v-model="novaPublicidade.data_publicacao"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Usuário Responsável *
            </label>
            <select
              v-model="novaPublicidade.usuario_responsavel_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <!-- TODO: Carregar usuários do backend -->
              <option :value="0" disabled>Selecione um usuário</option>
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
            @click="salvarPublicidade"
            :disabled="
              saving ||
              !novaPublicidade.nome_ferramenta ||
              !novaPublicidade.publico_alvo ||
              !novaPublicidade.usuario_responsavel_id
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingPublicidade ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Publicidades -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="publicidade in publicidades" :key="publicidade.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-gray-900">{{ publicidade.nome_ferramenta }}</h4>
                  <div class="flex space-x-2">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ frequencias.find(f => f.value === publicidade.frequencia)?.label }}
                    </span>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{ formatarData(publicidade.data_publicacao) }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      Público: {{ publicidade.publico_alvo }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <!-- TODO: Mostrar nome do usuário -->
                    Responsável: {{ publicidade.usuario_responsavel_id }}
                  </div>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="editarPublicidade(publicidade)"
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
                    @click="removerPublicidade(publicidade.id)"
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