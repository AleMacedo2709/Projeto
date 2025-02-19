<template>
  <div class="min-h-screen flex">
    <TheSidebar v-model:activeTab="activeTab" />
    
    <div class="flex-1">
      <TheHeader />
      
      <div class="p-4 sm:p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Gestão de Cadastros</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie os cadastros básicos do sistema.</p>
        </div>

        <!-- Tabs de navegação -->
        <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav class="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm',
                currentTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Conteúdo da tab atual -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-4 sm:p-6">
            <!-- Header com botão de adicionar -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ currentTabData.label }}
              </h3>
              <BaseButton
                variant="primary"
                @click="openModal"
                class="flex items-center gap-2"
              >
                <PlusIcon class="w-5 h-5" />
                Adicionar
              </BaseButton>
            </div>

            <!-- Tabela de dados -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th
                      v-for="column in currentTabData.columns"
                      :key="column.key"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {{ column.label }}
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="item in currentItems" :key="item.id">
                    <td
                      v-for="column in currentTabData.columns"
                      :key="column.key"
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                    >
                      {{ formatFieldValue(item[column.key], currentTabData.fields.find(f => f.key === column.key)) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="editItem(item)"
                        class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/50 transition-colors mr-2"
                        title="Editar"
                      >
                        <PencilIcon class="w-5 h-5" />
                      </button>
                      <button
                        @click="deleteItem(item)"
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                        title="Excluir"
                      >
                        <TrashIcon class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar/Editar -->
    <UsuarioModal
      v-if="showModal && currentTab === 'usuarios'"
      :show="showModal"
      :is-editing="isEditing"
      :initial-data="selectedItem"
      @close="closeModal"
      @save="saveItem"
    />

    <GestorModal
      v-if="showModal && currentTab === 'gestores'"
      :show="showModal"
      :is-editing="isEditing"
      :initial-data="selectedItem"
      :usuarios="usuariosFormatted"
      @close="closeModal"
      @save="saveItem"
    />

    <UnidadeModal
      v-if="showModal && currentTab === 'unidades'"
      :show="showModal"
      :is-editing="isEditing"
      :initial-data="selectedItem"
      @close="closeModal"
      @save="saveItem"
    />

    <DescricaoModal
      v-if="showModal && ['selos', 'programas', 'objetivos', 'tipos_risco', 'papeis'].includes(currentTab)"
      :show="showModal"
      :is-editing="isEditing"
      :initial-data="selectedItem"
      :entity-type="getEntityType(currentTab)"
      @close="closeModal"
      @save="saveItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import BaseModal from '../components/base/BaseModal.vue';
import BaseInput from '../components/base/BaseInput.vue';
import BaseSelect from '../components/base/BaseSelect.vue';
import { mockData } from '../mocks/cadastros';
import type { Tab, FormData } from '../types/cadastros';
import UsuarioModal from '../components/modals/UsuarioModal.vue';
import GestorModal from '../components/modals/GestorModal.vue';
import UnidadeModal from '../components/modals/UnidadeModal.vue';
import DescricaoModal from '../components/modals/DescricaoModal.vue';

const activeTab = ref('gestao-cadastros');
const currentTab = ref('usuarios');
const showModal = ref(false);
const isEditing = ref(false);
const selectedItem = ref(null);
const formData = ref({});

// Estado para armazenar dados das dropdowns
const usuarios = ref([]);
const selosData = ref([]);
const unidadesData = ref([]);
const programasData = ref([]);
const objetivosData = ref([]);
const tiposRiscoData = ref([]);

// Definição das tabs e seus campos
const tabs = [
  {
    id: 'usuarios',
    label: 'Usuários',
    columns: [
      { key: 'nome_usuario', label: 'Nome' },
      { key: 'email_usuario', label: 'E-mail' },
      { key: 'cargo_usuario', label: 'Cargo' }
    ],
    fields: [
      { key: 'nome_usuario', label: 'Nome do Usuário', type: 'text', required: true },
      { key: 'email_usuario', label: 'E-mail', type: 'email', required: true },
      { key: 'cargo_usuario', label: 'Cargo', type: 'text', required: true }
    ],
    endpoint: '/api/usuarios'
  },
  {
    id: 'unidades',
    label: 'Unidades Gestoras',
    columns: [
      { key: 'nome_unidade', label: 'Nome' },
      { key: 'sigla_unidade', label: 'Sigla' },
      { key: 'tipo_unidade', label: 'Tipo' },
      { key: 'ativa', label: 'Status' }
    ],
    fields: [
      { key: 'nome_unidade', label: 'Nome da Unidade', type: 'text', required: true },
      { key: 'sigla_unidade', label: 'Sigla', type: 'text', required: true },
      { 
        key: 'tipo_unidade', 
        label: 'Tipo', 
        type: 'select', 
        required: true,
        options: [
          { value: 'meio', label: 'Meio' },
          { value: 'fim', label: 'Fim' }
        ]
      },
      { 
        key: 'ativa', 
        label: 'Ativa', 
        type: 'select',
        required: true,
        options: [
          { value: true, label: 'Sim' },
          { value: false, label: 'Não' }
        ]
      }
    ],
    endpoint: '/api/unidades'
  },
  {
    id: 'selos',
    label: 'Selos',
    columns: [
      { key: 'nome_selo', label: 'Nome' },
      { key: 'descricao_selo', label: 'Descrição' }
    ],
    fields: [
      { key: 'nome_selo', label: 'Nome do Selo', type: 'text', required: true },
      { key: 'descricao_selo', label: 'Descrição', type: 'textarea', required: true }
    ],
    endpoint: '/api/selos'
  },
  {
    id: 'programas',
    label: 'Programas',
    columns: [
      { key: 'nome_programa', label: 'Nome' },
      { key: 'descricao_programa', label: 'Descrição' }
    ],
    fields: [
      { key: 'nome_programa', label: 'Nome do Programa', type: 'text', required: true },
      { key: 'descricao_programa', label: 'Descrição', type: 'textarea', required: true }
    ],
    endpoint: '/api/programas'
  },
  {
    id: 'objetivos',
    label: 'Objetivos Estratégicos',
    columns: [
      { key: 'nome_objetivo', label: 'Nome' },
      { key: 'descricao_objetivo', label: 'Descrição' }
    ],
    fields: [
      { key: 'nome_objetivo', label: 'Nome do Objetivo', type: 'text', required: true },
      { key: 'descricao_objetivo', label: 'Descrição', type: 'textarea', required: true }
    ],
    endpoint: '/api/objetivos'
  },
  {
    id: 'tipos_risco',
    label: 'Tipos de Risco',
    columns: [
      { key: 'nome_tipo', label: 'Nome' },
      { key: 'descricao_tipo', label: 'Descrição' }
    ],
    fields: [
      { key: 'nome_tipo', label: 'Nome do Tipo', type: 'text', required: true },
      { key: 'descricao_tipo', label: 'Descrição', type: 'textarea', required: true }
    ],
    endpoint: '/api/tipos-risco'
  },
  {
    id: 'papeis',
    label: 'Papéis na Equipe',
    columns: [
      { key: 'nome_papel', label: 'Nome' },
      { key: 'descricao_papel', label: 'Descrição' }
    ],
    fields: [
      { key: 'nome_papel', label: 'Nome do Papel', type: 'text', required: true },
      { key: 'descricao_papel', label: 'Descrição', type: 'textarea', required: true }
    ],
    endpoint: '/api/papeis'
  },
  {
    id: 'gestores',
    label: 'Gestores do Sistema',
    columns: [
      { key: 'usuario_id', label: 'Usuário' },
      { key: 'niveis_acesso', label: 'Níveis de Acesso' },
      { key: 'ativo', label: 'Status' }
    ],
    fields: [
      { 
        key: 'usuario_id', 
        label: 'Usuário', 
        type: 'select', 
        required: true,
        options: [] // Será preenchido com dados dos usuários
      },
      { 
        key: 'niveis_acesso', 
        label: 'Níveis de Acesso', 
        type: 'multiselect', 
        required: true,
        options: [
          { value: 'admin', label: 'Administrador' },
          { value: 'gestor_cadastros', label: 'Gestor de Cadastros' },
          { value: 'gestor_selo_pgj', label: 'Gestor Selo PGJ' },
          { value: 'gestor_selo_cg', label: 'Gestor Selo CG' }
        ]
      },
      { 
        key: 'ativo', 
        label: 'Ativo', 
        type: 'select',
        required: true,
        options: [
          { value: true, label: 'Sim' },
          { value: false, label: 'Não' }
        ]
      }
    ],
    endpoint: '/api/gestores'
  }
];

// Estado para armazenar dados das tabelas
const tableData = ref({
  usuarios: [],
  unidades: [],
  selos: [],
  programas: [],
  objetivos: [],
  tipos_risco: [],
  papeis: [],
  gestores: []
});

const currentTabData = computed(() => tabs.find(tab => tab.id === currentTab.value));
const currentItems = computed(() => tableData.value[currentTab.value as keyof typeof tableData.value]);

// Função para carregar dados das dropdowns
const loadDropdownData = async () => {
  try {
    // Simulando chamadas à API com mock
    usuarios.value = mockData.usuarios.map(u => ({
      value: u.id,
      label: `${u.nome_usuario} (${u.email_usuario})`
    }));
    
    selosData.value = mockData.selos.map(s => ({
      value: s.id,
      label: s.nome_selo
    }));

    unidadesData.value = mockData.unidades.map(u => ({
      value: u.id,
      label: `${u.nome_unidade} (${u.sigla_unidade})`
    }));

    programasData.value = mockData.programas.map(p => ({
      value: p.id,
      label: p.nome_programa
    }));

    objetivosData.value = mockData.objetivos.map(o => ({
      value: o.id,
      label: o.nome_objetivo
    }));

    tiposRiscoData.value = mockData.tipos_risco.map(t => ({
      value: t.id,
      label: t.nome_tipo
    }));

    // Atualizar as options do campo usuario_id na aba de gestores
    const gestoresTab = tabs.find(t => t.id === 'gestores');
    if (gestoresTab) {
      const usuarioField = gestoresTab.fields.find(f => f.key === 'usuario_id');
      if (usuarioField) {
        usuarioField.options = usuarios.value;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    alert('Erro ao carregar dados das dropdowns. Por favor, tente novamente.');
  }
};

// Função para carregar dados da tabela atual
const loadTableData = async () => {
  try {
    // Fazer uma cópia profunda dos dados do mock para o tableData
    tableData.value[currentTab.value] = JSON.parse(
      JSON.stringify(mockData[currentTab.value as keyof typeof mockData])
    );
  } catch (error: any) {
    console.error('Erro ao carregar dados:', error);
    alert(`Erro ao carregar dados: ${error.response?.data?.message || error.message}`);
  }
};

// Função para formatar valores de campos select
const formatFieldValue = (value: any, field: any) => {
  if (!field) return value;

  if (field.type === 'select') {
    if (field.key === 'usuario_id') {
      const user = mockData.usuarios.find(u => u.id === value);
      return user ? `${user.nome_usuario} (${user.email_usuario})` : value;
    }
    const option = field.options?.find((opt: any) => opt.value === value);
    return option?.label || value;
  }

  if (field.type === 'multiselect' && Array.isArray(value)) {
    return value.map(v => {
      const option = field.options?.find((opt: any) => opt.value === v);
      return option?.label || v;
    }).join(', ');
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }
  
  return value;
};

// Função para limpar o formulário
const resetForm = () => {
  formData.value = {};
  currentTabData.value?.fields.forEach(field => {
    if (field.type === 'select') {
      formData.value[field.key] = field.options[0].value;
    }
  });
};

const openModal = (item?: any) => {
  selectedItem.value = item ? { ...item } : {};
  isEditing.value = !!item;
  showModal.value = true;
};

const editItem = (item: any) => {
  isEditing.value = true;
  selectedItem.value = item;
  formData.value = { ...item };
  showModal.value = true;
};

const deleteItem = async (item: any) => {
  const itemName = item.nome_usuario || item.nome_unidade || item.nome_selo || 
                  item.nome_programa || item.nome_objetivo || item.nome_tipo || 
                  item.nome_papel || formatFieldValue(item.usuario_id, currentTabData.value?.fields.find(f => f.key === 'usuario_id'));
                  
  if (!confirm(`Tem certeza que deseja excluir ${currentTabData.value?.label.toLowerCase()} "${itemName}"?`)) {
    return;
  }

  try {
    // Verificar dependências antes de excluir
    if (currentTab.value === 'usuarios') {
      const hasGestores = mockData.gestores.some(g => g.usuario_id === item.id);
      if (hasGestores) {
        throw new Error('Não é possível excluir este usuário pois ele está vinculado a um ou mais gestores.');
      }
    }

    // Remover o item do mockData
    const currentData = mockData[currentTab.value as keyof typeof mockData] as any[];
    const index = currentData.findIndex((i: any) => i.id === item.id);
    
    if (index > -1) {
      currentData.splice(index, 1);
      
      // Atualizar o tableData diretamente
      tableData.value[currentTab.value] = [...currentData];
      
      // Se for usuário, atualizar também as dropdowns
      if (currentTab.value === 'usuarios') {
        await loadDropdownData();
      }
      
      alert('Item excluído com sucesso!');
    }
  } catch (error: any) {
    console.error('Erro ao excluir:', error);
    alert(error.message || 'Erro ao excluir. Por favor, tente novamente.');
  }
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {};
  selectedItem.value = null;
};

const validateForm = () => {
  const fields = currentTabData.value?.fields || [];
  
  for (const field of fields) {
    if (field.required) {
      if (field.type === 'multiselect') {
        if (!Array.isArray(formData.value[field.key]) || formData.value[field.key].length === 0) {
          throw new Error(`Selecione pelo menos um ${field.label.toLowerCase()}`);
        }
      } else if (!formData.value[field.key]) {
        throw new Error(`O campo ${field.label} é obrigatório.`);
      }
    }

    if (field.type === 'email' && formData.value[field.key]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.value[field.key])) {
        throw new Error(`O campo ${field.label} deve ser um e-mail válido.`);
      }
    }
  }

  // Validações específicas por tab
  if (currentTab.value === 'gestores') {
    // Verificar se já existe um gestor ativo com o mesmo nível de acesso
    const existingGestor = mockData.gestores.find(g => 
      g.niveis_acesso.includes(formData.value.niveis_acesso) && 
      g.ativo && 
      g.id !== selectedItem.value?.id
    );
    
    if (existingGestor && formData.value.ativo) {
      throw new Error(`Já existe um gestor ativo com o nível de acesso ${formatFieldValue(formData.value.niveis_acesso, currentTabData.value?.fields.find(f => f.key === 'niveis_acesso'))}.`);
    }
  }
};

const saveItem = async () => {
  try {
    validateForm();

    const currentData = mockData[currentTab.value as keyof typeof mockData];
    
    if (isEditing.value && selectedItem.value) {
      const index = currentData.findIndex((i: any) => i.id === selectedItem.value.id);
      if (index > -1) {
        currentData[index] = { 
          ...formData.value, 
          id: selectedItem.value.id 
        };
        
        // Atualizar dados relacionados se necessário
        if (currentTab.value === 'usuarios') {
          // Atualizar nome do usuário em gestores
          mockData.gestores.forEach(g => {
            if (g.usuario_id === selectedItem.value.id) {
              loadDropdownData(); // Recarregar dropdowns para atualizar labels
            }
          });
        }
        
        alert('Item atualizado com sucesso!');
      }
    } else {
      // Verificar unicidade de campos
      if (currentTab.value === 'usuarios') {
        const existingUser = currentData.find((u: any) => 
          u.email_usuario === formData.value.email_usuario
        );
        if (existingUser) {
          throw new Error('Já existe um usuário com este e-mail.');
        }
      }

      const newId = currentData.length > 0 
        ? Math.max(...currentData.map((i: any) => i.id)) + 1 
        : 1;
        
      currentData.push({ 
        ...formData.value, 
        id: newId 
      });
      
      alert('Item adicionado com sucesso!');
    }

    await loadTableData();
    await loadDropdownData(); // Recarregar dropdowns após alterações
    closeModal();
  } catch (error: any) {
    console.error('Erro ao salvar:', error);
    alert(error.message || 'Erro ao salvar. Por favor, tente novamente.');
  }
};

// Carregar dados iniciais
onMounted(() => {
  loadDropdownData();
  loadTableData();
});

// Recarregar dados quando mudar de tab
watch(currentTab, () => {
  loadTableData();
});

// Adicionar computed property para formatar usuários para o select
const usuariosFormatted = computed(() => {
  return tableData.usuarios?.map(user => ({
    value: user.id,
    label: `${user.nome_usuario} (${user.email_usuario})`
  })) || [];
});

// Adicionar função para converter o nome da tab para o tipo de entidade
const getEntityType = (tab: string) => {
  const mappings = {
    'selos': 'selo',
    'programas': 'programa',
    'objetivos': 'objetivo',
    'tipos_risco': 'tipo_risco',
    'papeis': 'papel'
  };
  return mappings[tab as keyof typeof mappings] || tab;
};
</script> 