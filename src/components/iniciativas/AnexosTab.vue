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
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

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

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('arquivo', file);
  formData.append('nome_anexo', file.name);
  formData.append('tipo_arquivo', file.type);
  formData.append('tamanho_arquivo', file.size.toString());

  uploading.value = true;
  try {
    await anexosService.adicionarAnexo(formData);
    await carregarAnexos();
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Erro ao fazer upload do anexo:', error);
  } finally {
    uploading.value = false;
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

const formatarTamanho = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getIconePorTipo = (tipo: string) => {
  if (tipo.startsWith('image/')) {
    return 'M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z';
  }
  if (tipo.startsWith('application/pdf')) {
    return 'M4 4v16h12V8.83L11.17 4H4zm1 1h6v4h4v10H5V5zm7 .17L15.83 9H12V5.17z';
  }
  if (tipo.startsWith('application/msword') || tipo.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml')) {
    return 'M4 4v16h12V8.83L11.17 4H4zm1 1h6v4h4v10H5V5zm7 .17L15.83 9H12V5.17z';
  }
  if (tipo.startsWith('application/vnd.ms-excel') || tipo.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml')) {
    return 'M4 4v16h12V8.83L11.17 4H4zm1 1h6v4h4v10H5V5zm7 .17L15.83 9H12V5.17z';
  }
  return 'M4 4v16h12V8.83L11.17 4H4zm1 1h6v4h4v10H5V5zm7 .17L15.83 9H12V5.17z';
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Anexos da Iniciativa</h3>
      <div class="flex items-center space-x-3">
        <input
          ref="fileInput"
          type="file"
          @change="handleFileUpload"
          class="hidden"
          :disabled="uploading"
        />
        <button
          type="button"
          @click="fileInput?.click()"
          :disabled="uploading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          {{ uploading ? 'Enviando...' : 'Adicionar Anexo' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <template v-else>
      <!-- Lista de Anexos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="anexo in anexos" :key="anexo.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center flex-1 min-w-0">
                <div class="flex-shrink-0">
                  <svg
                    class="h-10 w-10 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path :d="getIconePorTipo(anexo.tipo_arquivo)" />
                  </svg>
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {{ anexo.nome_anexo }}
                    </p>
                    <div class="ml-2 flex-shrink-0 flex">
                      <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ formatarTamanho(anexo.tamanho_arquivo) }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-2 flex justify-between">
                    <div class="flex items-center text-sm text-gray-500">
                      <p>Enviado em {{ formatarData(anexo.data_criacao) }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <a
                        :href="anexo.caminho_arquivo"
                        target="_blank"
                        class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span class="sr-only">Download</span>
                        <!-- Heroicon name: download -->
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                      <button
                        type="button"
                        @click="removerAnexo(anexo.id)"
                        class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <span class="sr-only">Remover</span>
                        <!-- Heroicon name: trash -->
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template> 