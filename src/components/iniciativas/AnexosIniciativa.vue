<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Anexos</h2>
    </div>

    <div class="p-4">
      <div class="mb-6">
        <label
          for="upload"
          class="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div
            class="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
            :class="{ 'bg-gray-50 dark:bg-gray-700': arrastando }"
            @dragenter.prevent="arrastando = true"
            @dragleave.prevent="arrastando = false"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="space-y-1 text-center">
              <DocumentArrowUpIcon 
                class="mx-auto h-12 w-12 text-gray-400"
                :class="{ 'animate-bounce': arrastando }"
              />
              <div class="flex text-sm text-gray-600 dark:text-gray-400">
                <span>Arraste arquivos ou</span>
                <span class="pl-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  selecione no computador
                </span>
                <input
                  id="upload"
                  type="file"
                  class="sr-only"
                  multiple
                  @change="handleFileSelect"
                >
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PDF, Word, Excel, PowerPoint até 10MB
              </p>
            </div>
          </div>
        </label>
      </div>

      <div class="space-y-4">
        <div v-if="carregando" class="flex justify-center py-4">
          <ArrowPathIcon class="h-8 w-8 animate-spin text-gray-400" />
        </div>

        <div v-else-if="erro" class="text-center py-4 text-red-600 dark:text-red-400">
          {{ erro }}
        </div>

        <div v-else-if="!anexos.length" class="text-center py-4 text-gray-500 dark:text-gray-400">
          Nenhum anexo ainda.
        </div>

        <div 
          v-for="anexo in anexosOrdenados" 
          :key="anexo.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <component 
                :is="tipoArquivoIcon(anexo.tipo)"
                class="h-8 w-8 text-gray-400"
              />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ anexo.nome }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatarTamanhoArquivo(anexo.tamanho) }} • {{ formatarData(anexo.data_upload) }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="downloadAnexo(anexo)"
              :disabled="baixando === anexo.id"
              class="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowDownTrayIcon 
                class="h-5 w-5"
                :class="{ 'animate-bounce': baixando === anexo.id }"
              />
            </button>
            
            <button
              @click="confirmarExclusao(anexo)"
              :disabled="excluindo === anexo.id"
              class="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon 
                class="h-5 w-5"
                :class="{ 'animate-spin': excluindo === anexo.id }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon
} from '@heroicons/vue/24/outline';
import type { Anexo } from '../../services/anexosIniciativa';
import {
  getAnexosIniciativa,
  uploadAnexo,
  downloadAnexo as downloadAnexoService,
  excluirAnexo as excluirAnexoService,
  formatarTamanhoArquivo
} from '../../services/anexosIniciativa';

const props = defineProps<{
  iniciativaId: number;
}>();

const anexos = ref<Anexo[]>([]);
const carregando = ref(false);
const erro = ref<string | null>(null);
const arrastando = ref(false);
const baixando = ref<number | null>(null);
const excluindo = ref<number | null>(null);

const anexosOrdenados = computed(() => {
  return [...anexos.value].sort((a, b) => 
    new Date(b.data_upload).getTime() - new Date(a.data_upload).getTime()
  );
});

const tipoArquivoIcon = (tipo: string) => {
  if (tipo.includes('pdf')) return DocumentTextIcon;
  if (tipo.includes('spreadsheet')) return TableCellsIcon;
  if (tipo.includes('presentation')) return PresentationChartBarIcon;
  return DocumentIcon;
};

const carregarAnexos = async () => {
  carregando.value = true;
  erro.value = null;

  try {
    anexos.value = await getAnexosIniciativa(props.iniciativaId);
  } catch (error) {
    erro.value = 'Erro ao carregar anexos';
    console.error(error);
  } finally {
    carregando.value = false;
  }
};

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  await uploadArquivos(Array.from(input.files));
  input.value = ''; // Reset input
};

const handleDrop = async (event: DragEvent) => {
  arrastando.value = false;
  const files = event.dataTransfer?.files;
  if (!files?.length) return;

  await uploadArquivos(Array.from(files));
};

const uploadArquivos = async (arquivos: File[]) => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  for (const arquivo of arquivos) {
    if (arquivo.size > MAX_SIZE) {
      erro.value = `Arquivo ${arquivo.name} excede o limite de 10MB`;
      continue;
    }

    if (!ALLOWED_TYPES.includes(arquivo.type)) {
      erro.value = `Tipo de arquivo não permitido: ${arquivo.name}`;
      continue;
    }

    try {
      const anexo = await uploadAnexo(props.iniciativaId, arquivo);
      if (anexo) {
        anexos.value.unshift(anexo);
      }
    } catch (error) {
      erro.value = `Erro ao fazer upload de ${arquivo.name}`;
      console.error(error);
    }
  }
};

const downloadAnexo = async (anexo: Anexo) => {
  if (baixando.value) return;
  
  baixando.value = anexo.id;
  try {
    await downloadAnexoService(anexo);
  } catch (error) {
    erro.value = 'Erro ao baixar anexo';
    console.error(error);
  } finally {
    baixando.value = null;
  }
};

const confirmarExclusao = async (anexo: Anexo) => {
  if (!confirm(`Deseja realmente excluir o anexo "${anexo.nome}"?`)) return;
  await excluirAnexo(anexo);
};

const excluirAnexo = async (anexo: Anexo) => {
  if (excluindo.value) return;

  excluindo.value = anexo.id;
  try {
    const sucesso = await excluirAnexoService(anexo.id);
    if (sucesso) {
      anexos.value = anexos.value.filter(a => a.id !== anexo.id);
    } else {
      throw new Error('Erro ao excluir anexo');
    }
  } catch (error) {
    erro.value = 'Erro ao excluir anexo';
    console.error(error);
  } finally {
    excluindo.value = null;
  }
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

onMounted(() => {
  carregarAnexos();
});
</script> 