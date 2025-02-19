<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Cronograma } from '../../types/iniciativas';
import { useCronograma } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const cronogramaService = useCronograma(props.iniciativaId);
const cronograma = ref<Cronograma | null>(null);
const loading = ref(false);
const saving = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    cronograma.value = await cronogramaService.getCronograma();
    if (!cronograma.value) {
      cronograma.value = {
        iniciativa_id: props.iniciativaId,
        data_inicio_planejada: '',
        data_fim_planejada: '',
        data_inicio_real: '',
        data_fim_real: ''
      } as Cronograma;
    }
  } catch (error) {
    console.error('Erro ao carregar cronograma:', error);
  } finally {
    loading.value = false;
  }
});

const salvarCronograma = async () => {
  if (!cronograma.value) return;

  saving.value = true;
  try {
    const { id, iniciativa_id, data_criacao, data_atualizacao, ...cronogramaData } = cronograma.value;
    
    if (id) {
      await cronogramaService.atualizarCronograma(cronogramaData);
    } else {
      await cronogramaService.salvarCronograma(cronogramaData);
    }
  } catch (error) {
    console.error('Erro ao salvar cronograma:', error);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Data de Início Planejada *
          </label>
          <input
            v-model="cronograma.data_inicio_planejada"
            type="date"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Data de Fim Planejada *
          </label>
          <input
            v-model="cronograma.data_fim_planejada"
            type="date"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Data de Início Real
          </label>
          <input
            v-model="cronograma.data_inicio_real"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Data de Fim Real
          </label>
          <input
            v-model="cronograma.data_fim_real"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          type="button"
          @click="salvarCronograma"
          :disabled="saving"
          class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {{ saving ? 'Salvando...' : 'Salvar Cronograma' }}
        </button>
      </div>
    </template>
  </div>
</template> 