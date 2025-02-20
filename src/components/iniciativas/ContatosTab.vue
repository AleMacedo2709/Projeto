<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Contato, Usuario } from '../../types/iniciativas';
import { useContatos } from '../../services/iniciativaRelacionamentos';
import { useUsuarios } from '../../services/usuarios';

const props = defineProps<{
  iniciativaId: number;
}>();

const contatosService = useContatos(props.iniciativaId);
const usuariosService = useUsuarios();
const contatos = ref<Contato[]>([]);
const usuarios = ref<Usuario[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingContato = ref<Contato | null>(null);

const novoContato = ref<Omit<Contato, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>>({
  usuario_id: 0,
  tipo_papel: 'equipe'
});

onMounted(async () => {
  await Promise.all([
    carregarContatos(),
    carregarUsuarios()
  ]);
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

const carregarUsuarios = async () => {
  try {
    usuarios.value = await usuariosService.getUsuarios();
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
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

const getTipoPapelLabel = (tipo: string) => {
  const tipos = {
    cadastrador: 'Cadastrador',
    autor: 'Autor',
    equipe: 'Equipe',
    gerente_projeto: 'Gerente de Projeto',
    patrocinador: 'Patrocinador'
  };
  return tipos[tipo as keyof typeof tipos] || tipo;
};

const getUsuarioNome = (usuarioId: number) => {
  const usuario = usuarios.value.find(u => u.id === usuarioId);
  return usuario ? usuario.nome_usuario : 'Usuário não encontrado';
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Contatos da Iniciativa</h3>
      <button
        v-if="!showForm"
        type="button"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      >
        Adicionar Contato
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
              Usuário *
            </label>
            <select
              v-model="novoContato.usuario_id"
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
              Tipo de Papel *
            </label>
            <select
              v-model="novoContato.tipo_papel"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            >
              <option value="cadastrador">Cadastrador</option>
              <option value="autor">Autor</option>
              <option value="equipe">Equipe</option>
              <option value="gerente_projeto">Gerente de Projeto</option>
              <option value="patrocinador">Patrocinador</option>
            </select>
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
            @click="salvarContato"
            :disabled="saving || !novoContato.usuario_id || !novoContato.tipo_papel"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : (editingContato ? 'Atualizar' : 'Adicionar') }}
          </button>
        </div>
      </div>

      <!-- Lista de Contatos -->
      <div v-else class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuário
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Papel
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="contato in contatos" :key="contato.id">
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ getUsuarioNome(contato.usuario_id) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ getTipoPapelLabel(contato.tipo_papel) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editarContato(contato)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="removerContato(contato.id)"
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