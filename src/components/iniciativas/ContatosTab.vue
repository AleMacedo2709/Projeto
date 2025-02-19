<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Contato } from '../../types/iniciativas';
import { useContatos } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const contatosService = useContatos(props.iniciativaId);
const contatos = ref<Contato[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingContato = ref<Contato | null>(null);

const novoContato = ref<Omit<Contato, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  usuario_id: 0,
  tipo_papel: 'equipe'
});

onMounted(async () => {
  await carregarContatos();
});

const carregarContatos = async () => {
  loading.value = true;
  try {
    contatos.value = await contatosService.getContatos();
  } catch (error) {
    console.error('Erro ao carregar contatos:', error);
  } finally {
    loading.value = false;
  }
};

const salvarContato = async () => {
  saving.value = true;
  try {
    if (editingContato.value) {
      await contatosService.atualizarContato(editingContato.value.id, novoContato.value);
    } else {
      await contatosService.adicionarContato(novoContato.value);
    }
    await carregarContatos();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
  } finally {
    saving.value = false;
  }
};

const editarContato = (contato: Contato) => {
  editingContato.value = contato;
  novoContato.value = {
    usuario_id: contato.usuario_id,
    tipo_papel: contato.tipo_papel
  };
  showForm.value = true;
};

const removerContato = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este contato?')) return;

  try {
    await contatosService.removerContato(id);
    await carregarContatos();
  } catch (error) {
    console.error('Erro ao remover contato:', error);
  }
};

const resetForm = () => {
  novoContato.value = {
    usuario_id: 0,
    tipo_papel: 'equipe'
  };
  editingContato.value = null;
  showForm.value = false;
};

const papeis = [
  { value: 'cadastrador', label: 'Cadastrador' },
  { value: 'autor', label: 'Autor' },
  { value: 'equipe', label: 'Equipe' },
  { value: 'gerente_projeto', label: 'Gerente do Projeto' },
  { value: 'patrocinador', label: 'Patrocinador' }
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Contatos da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Contato
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
              Usuário *
            </label>
            <select
              v-model="novoContato.usuario_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <!-- TODO: Carregar usuários do backend -->
              <option :value="0" disabled>Selecione um usuário</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Papel na Iniciativa *
            </label>
            <select
              v-model="novoContato.tipo_papel"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="papel in papeis" :key="papel.value" :value="papel.value">
                {{ papel.label }}
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
            @click="salvarContato"
            :disabled="saving || !novoContato.usuario_id"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingContato ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Contatos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="contato in contatos" :key="contato.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    <!-- TODO: Mostrar nome do usuário -->
                    Usuário ID: {{ contato.usuario_id }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ papeis.find(p => p.value === contato.tipo_papel)?.label }}
                  </p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="editarContato(contato)"
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
                  @click="removerContato(contato.id)"
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
          </li>
        </ul>
      </div>
    </template>
  </div>
</template> 