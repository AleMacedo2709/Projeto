<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Resultado } from '../../types/iniciativas';
import { useResultados } from '../../services/iniciativaRelacionamentos';

const props = defineProps<{
  iniciativaId: number;
}>();

const resultadosService = useResultados(props.iniciativaId);
const resultados = ref<Resultado[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingResultado = ref<Resultado | null>(null);

const novoResultado = ref<Omit<Resultado, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  descricao_resultado: '',
  status_resultado: 'alcancado'
});

onMounted(async () => {
  await carregarResultados();
});

const carregarResultados = async () => {
  loading.value = true;
  try {
    resultados.value = await resultadosService.getResultados();
  } catch (error) {
    console.error('Erro ao carregar resultados:', error);
  } finally {
    loading.value = false;
  }
};

const salvarResultado = async () => {
  saving.value = true;
  try {
    if (editingResultado.value) {
      await resultadosService.atualizarResultado(editingResultado.value.id, novoResultado.value);
    } else {
      await resultadosService.adicionarResultado(novoResultado.value);
    }
    await carregarResultados();
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
  } finally {
    saving.value = false;
  }
};

const editarResultado = (resultado: Resultado) => {
  editingResultado.value = resultado;
  novoResultado.value = {
    descricao_resultado: resultado.descricao_resultado,
    status_resultado: resultado.status_resultado
  };
  showForm.value = true;
};

const removerResultado = async (id: number) => {
  if (!confirm('Tem certeza que deseja remover este resultado?')) return;

  try {
    await resultadosService.removerResultado(id);
    await carregarResultados();
  } catch (error) {
    console.error('Erro ao remover resultado:', error);
  }
};

const resetForm = () => {
  novoResultado.value = {
    descricao_resultado: '',
    status_resultado: 'alcancado'
  };
  editingResultado.value = null;
  showForm.value = false;
};

const statusResultado = [
  { value: 'alcancado', label: 'Alcançado' },
  { value: 'parcialmente_alcancado', label: 'Parcialmente Alcançado' },
  { value: 'nao_alcancado', label: 'Não Alcançado' }
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Resultados da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Adicionar Resultado
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <template v-else>
      <!-- Formulário -->
      <div v-if="showForm" class="bg-white shadow sm:rounded-lg p-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Descrição do Resultado *
            </label>
            <textarea
              v-model="novoResultado.descricao_resultado"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Status do Resultado *
            </label>
            <select
              v-model="novoResultado.status_resultado"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option v-for="status in statusResultado" :key="status.value" :value="status.value">
                {{ status.label }}
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
            @click="salvarResultado"
            :disabled="saving || !novoResultado.descricao_resultado"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saving ? 'Salvando...' : (editingResultado ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Resultados -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="resultado in resultados" :key="resultado.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-900">{{ resultado.descricao_resultado }}</p>
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      {
                        'bg-green-100 text-green-800': resultado.status_resultado === 'alcancado',
                        'bg-yellow-100 text-yellow-800': resultado.status_resultado === 'parcialmente_alcancado',
                        'bg-red-100 text-red-800': resultado.status_resultado === 'nao_alcancado'
                      }
                    ]"
                  >
                    {{ statusResultado.find(s => s.value === resultado.status_resultado)?.label }}
                  </span>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0">
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="editarResultado(resultado)"
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
                    @click="removerResultado(resultado.id)"
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