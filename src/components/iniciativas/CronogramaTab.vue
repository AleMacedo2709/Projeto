<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Cronograma da Iniciativa</h3>
      <button
        v-if="!showForm && !cronograma"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Cronograma
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Início Planejada *
            </label>
            <input
              v-model="novoCronograma.data_inicio_planejada"
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
              v-model="novoCronograma.data_fim_planejada"
              type="date"
              required
              :min="novoCronograma.data_inicio_planejada"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Início Real
            </label>
            <input
              v-model="novoCronograma.data_inicio_real"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Fim Real
            </label>
            <input
              v-model="novoCronograma.data_fim_real"
              type="date"
              :min="novoCronograma.data_inicio_real"
              :max="dataAtual"
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
            @click="salvarCronograma"
            :disabled="
              saving ||
              !novoCronograma.data_inicio_planejada ||
              !novoCronograma.data_fim_planejada
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (cronograma ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Visualização do Cronograma -->
      <div v-else-if="cronograma" class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Início Planejada</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ formatarData(cronograma.data_inicio_planejada) }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Fim Planejada</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ formatarData(cronograma.data_fim_planejada) }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Início Real</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {{ cronograma.data_inicio_real ? formatarData(cronograma.data_inicio_real) : '-' }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Data de Fim Real</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {{ cronograma.data_fim_real ? formatarData(cronograma.data_fim_real) : '-' }}
              </dd>
            </div>
          </dl>
          <div class="mt-4 flex justify-end">
            <button
              @click="showForm = true"
              class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Cronograma } from '../../types/iniciativas';
import { useCronograma } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const cronogramaService = useCronograma(props.iniciativaId);
const cronograma = ref<Cronograma | null>(null);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);

const novoCronograma = ref<Omit<Cronograma, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  data_inicio_planejada: '',
  data_fim_planejada: '',
  data_inicio_real: '',
  data_fim_real: ''
});

const dataAtual = computed(() => {
  const hoje = new Date();
  return hoje.toISOString().split('T')[0];
});

onMounted(async () => {
  await carregarCronograma();
});

const carregarCronograma = async () => {
  loading.value = true;
  try {
    cronograma.value = await cronogramaService.getCronograma();
    if (cronograma.value) {
      novoCronograma.value = {
        data_inicio_planejada: cronograma.value.data_inicio_planejada,
        data_fim_planejada: cronograma.value.data_fim_planejada,
        data_inicio_real: cronograma.value.data_inicio_real || '',
        data_fim_real: cronograma.value.data_fim_real || ''
      };
    }
  } catch (error) {
    console.error('Erro ao carregar cronograma:', error);
  } finally {
    loading.value = false;
  }
};

const salvarCronograma = async () => {
  saving.value = true;
  try {
    if (cronograma.value) {
      await cronogramaService.atualizarCronograma({
        ...novoCronograma.value,
        id: cronograma.value.id
      });
    } else {
      await cronogramaService.salvarCronograma(novoCronograma.value);
    }
    await carregarCronograma();
    showForm.value = false;
  } catch (error) {
    console.error('Erro ao salvar cronograma:', error);
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (cronograma.value) {
    novoCronograma.value = {
      data_inicio_planejada: cronograma.value.data_inicio_planejada,
      data_fim_planejada: cronograma.value.data_fim_planejada,
      data_inicio_real: cronograma.value.data_inicio_real || '',
      data_fim_real: cronograma.value.data_fim_real || ''
    };
  } else {
    novoCronograma.value = {
      data_inicio_planejada: '',
      data_fim_planejada: '',
      data_inicio_real: '',
      data_fim_real: ''
    };
  }
  showForm.value = false;
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script> 