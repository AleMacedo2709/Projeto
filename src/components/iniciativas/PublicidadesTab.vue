<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Publicidade, Usuario } from '../../types/iniciativas';
import { usePublicidades } from '../../services/iniciativaRelacionamentos';
import { useUsuarios } from '../../services/usuarios';

const props = defineProps<{
  iniciativaId: number;
}>();

const publicidadesService = usePublicidades(props.iniciativaId);
const usuariosService = useUsuarios();
const publicidades = ref<Publicidade[]>([]);
const usuarios = ref<Usuario[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingPublicidade = ref<Publicidade | null>(null);

const novaPublicidade = ref<Omit<Publicidade, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  nome_ferramenta: '',
  publico_alvo: '',
  frequencia: '',
  usuario_responsavel_id: 0,
  data_publicacao: ''
});

onMounted(async () => {
  await Promise.all([
    carregarPublicidades(),
    carregarUsuarios()
  ]);
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

const carregarUsuarios = async () => {
  try {
    usuarios.value = await usuariosService.getUsuarios();
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
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
    frequencia: '',
    usuario_responsavel_id: 0,
    data_publicacao: ''
  };
  editingPublicidade.value = null;
  showForm.value = false;
};

const getFrequenciaLabel = (frequencia: string) => {
  const frequencias = {
    diaria: 'Diária',
    semanal: 'Semanal',
    quinzenal: 'Quinzenal',
    mensal: 'Mensal',
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
    eventual: 'Eventual'
  };
  return frequencias[frequencia as keyof typeof frequencias] || frequencia;
};

const getUsuarioNome = (usuarioId: number) => {
  const usuario = usuarios.value.find(u => u.id === usuarioId);
  return usuario ? usuario.nome_usuario : 'Usuário não encontrado';
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Publicidades da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Publicidade
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
              Nome da Ferramenta *
            </label>
            <input
              v-model="novaPublicidade.nome_ferramenta"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Público Alvo *
            </label>
            <input
              v-model="novaPublicidade.publico_alvo"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Frequência *
            </label>
            <select
              v-model="novaPublicidade.frequencia"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="diaria">Diária</option>
              <option value="semanal">Semanal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
              <option value="eventual">Eventual</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Usuário Responsável *
            </label>
            <select
              v-model="novaPublicidade.usuario_responsavel_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                {{ usuario.nome_usuario }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Data de Publicação *
            </label>
            <input
              v-model="novaPublicidade.data_publicacao"
              type="date"
              required
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
            @click="salvarPublicidade"
            :disabled="
              saving ||
              !novaPublicidade.nome_ferramenta ||
              !novaPublicidade.publico_alvo ||
              !novaPublicidade.frequencia ||
              !novaPublicidade.usuario_responsavel_id ||
              !novaPublicidade.data_publicacao
            "
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingPublicidade ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Publicidades -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ferramenta
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Público Alvo
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Frequência
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Responsável
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="publicidade in publicidades" :key="publicidade.id">
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ publicidade.nome_ferramenta }}
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="text-gray-900 dark:text-gray-100">{{ publicidade.publico_alvo }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ getFrequenciaLabel(publicidade.frequencia) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ getUsuarioNome(publicidade.usuario_responsavel_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ formatarData(publicidade.data_publicacao) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarPublicidade(publicidade)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerPublicidade(publicidade.id)"
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