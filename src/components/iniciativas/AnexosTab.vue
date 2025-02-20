<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Anexos da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Anexo
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nome do Anexo *
            </label>
            <input
              v-model="novoAnexo.nome_anexo"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Arquivo *
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Selecionar arquivo</span>
                    <input
                      id="file-upload"
                      type="file"
                      class="sr-only"
                      @change="handleFileUpload"
                      required
                    />
                  </label>
                  <p class="pl-1">ou arraste e solte</p>
                </div>
                <p class="text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG até 10MB
                </p>
              </div>
            </div>
            <div v-if="selectedFile" class="mt-2 text-sm text-gray-500">
              Arquivo selecionado: {{ selectedFile.name }}
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
            @click="salvarAnexo"
            :disabled="saving || !novoAnexo.nome_anexo || !selectedFile"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingAnexo ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Anexos -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tamanho
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data de Upload
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="anexo in anexos" :key="anexo.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <a
                  :href="anexo.caminho_arquivo"
                  target="_blank"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  {{ anexo.nome_anexo }}
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ anexo.tipo_arquivo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ formatarTamanho(anexo.tamanho_arquivo) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatarData(anexo.data_criacao) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="removerAnexo(anexo.id)"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Anexo } from '../../types/iniciativas';
import { useAnexos } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const anexosService = useAnexos(props.iniciativaId);
const anexos = ref<Anexo[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingAnexo = ref<Anexo | null>(null);
const selectedFile = ref<File | null>(null);

const novoAnexo = ref<Omit<Anexo, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao' | 'caminho_arquivo' | 'tipo_arquivo' | 'tamanho_arquivo' | 'usuario_upload_id'>>({
  nome_anexo: ''
});

onMounted(async () => {
  await carregarAnexos();
});

const carregarAnexos = async () => {
  loading.value = true;
  try {
    anexos.value = await anexosService.getAnexos();
  } catch (error) {
    console.error('Erro ao carregar anexos:', error);
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('O arquivo deve ter no máximo 10MB');
      input.value = '';
      selectedFile.value = null;
      return;
    }
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido');
      input.value = '';
      selectedFile.value = null;
      return;
    }

    selectedFile.value = file;
  }
};

const salvarAnexo = async () => {
  if (!selectedFile.value) return;

  saving.value = true;
  try {
    const formData = new FormData();
    formData.append('arquivo', selectedFile.value);
    formData.append('nome_anexo', novoAnexo.value.nome_anexo);

    await anexosService.adicionarAnexo(formData);
    await carregarAnexos();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar anexo:', error);
  } finally {
    saving.value = false;
  }
};

const removerAnexo = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este anexo?')) return;

  try {
    await anexosService.removerAnexo(id);
    await carregarAnexos();
  } catch (error) {
    console.error('Erro ao remover anexo:', error);
  }
};

const resetForm = () => {
  novoAnexo.value = {
    nome_anexo: ''
  };
  selectedFile.value = null;
  const input = document.getElementById('file-upload') as HTMLInputElement;
  if (input) input.value = '';
  showForm.value = false;
};

const formatarTamanho = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script> 