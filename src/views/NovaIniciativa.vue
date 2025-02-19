<template>
  <div class="min-h-screen flex">
    <TheSidebar v-model:activeTab="activeTab" />
    
    <div class="flex-1">
      <TheHeader />
      
      <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEditing ? 'Editar Iniciativa' : 'Nova Iniciativa' }}
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ isEditing ? 'Edite os dados da iniciativa' : 'Preencha os dados para criar uma nova iniciativa' }}
            </p>
          </div>
          <button
            @click="router.back()"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
          <nav class="flex space-x-4 border-b border-gray-200 dark:border-gray-700" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'px-3 py-2 text-sm font-medium border-b-2 -mb-px',
                currentTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ tab.label }}
              <span v-if="tab.hasRequiredFields" class="text-red-500 ml-1">*</span>
            </button>
          </nav>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Dados Básicos -->
          <div v-show="currentTab === 'dados-basicos'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Tipo de Iniciativa <span class="text-red-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.tipo_iniciativa"
                  :options="[
                    { value: 'projeto', label: 'Projeto' },
                    { value: 'boa_pratica', label: 'Boa Prática' },
                    { value: 'programa', label: 'Programa' }
                  ]"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nome da Iniciativa <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.nome_iniciativa"
                  placeholder="Digite o nome da iniciativa"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Unidade Gestora <span class="text-red-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.unidade_gestora_id"
                  :options="unidadesGestoras"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Ano de Vigência <span class="text-red-500">*</span>
                </label>
                <BaseInput
                  v-model="form.ano_vigencia"
                  type="number"
                  min="2024"
                  max="2100"
                  required
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Descrição da Iniciativa <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.descricao_iniciativa"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>
          </div>

          <!-- Objetivos -->
          <div v-show="currentTab === 'objetivos'" class="space-y-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Promoção do Objetivo <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.promocao_objetivo"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Público Alvo <span class="text-red-500">*</span>
              </label>
              <BaseInput
                v-model="form.publico_impactado"
                placeholder="Digite o público alvo"
                required
              />
            </div>
          </div>

          <!-- Justificativas -->
          <div v-show="currentTab === 'justificativas'" class="space-y-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Resolutividade <span class="text-red-500">*</span>
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Contribuição decisiva para prevenir ou solucionar conflito ou controvérsia, envolvendo a concretização de direitos ou interesses para cuja defesa e proteção é legitimado o Ministério Público
              </p>
              <textarea
                v-model="form.justificativas.resolutividade"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Inovação <span class="text-red-500">*</span>
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Introdução de novidade que resulte em produtos, serviços ou processos, ou que compreenda a agregação de funcionalidades, acarretando ganho de qualidade ou desempenho
              </p>
              <textarea
                v-model="form.justificativas.inovacao"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Transparência <span class="text-red-500">*</span>
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Clareza na gestão e divulgação de dados, informações e recursos
              </p>
              <textarea
                v-model="form.justificativas.transparencia"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Proatividade <span class="text-red-500">*</span>
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Atuação com busca espontânea de oportunidades de mudança, prognóstico de cenários, antecipação de problemas ou neutralização de ações hostis
              </p>
              <textarea
                v-model="form.justificativas.proatividade"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Cooperação <span class="text-red-500">*</span>
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Atuação colaborativa intra e interinstitucional ou em parceria com a sociedade civil
              </p>
              <textarea
                v-model="form.justificativas.cooperacao"
                rows="4"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>
          </div>

          <!-- Órgãos Envolvidos -->
          <div v-show="currentTab === 'orgaos-envolvidos'" class="space-y-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Órgãos Envolvidos</h3>
              <BaseButton
                variant="secondary"
                type="button"
                @click="addOrgaoEnvolvido"
              >
                Adicionar Órgão
              </BaseButton>
            </div>

            <div v-for="(orgao, index) in form.orgaos_envolvidos" :key="index" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
              <div class="flex justify-between items-start">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Órgão {{ index + 1 }}</h4>
                <button
                  @click="removeOrgaoEnvolvido(index)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remover
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Nome do Órgão <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="orgao.nome_orgao"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Papel do Órgão <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="orgao.papel_orgao"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Nome do Contato <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="orgao.nome_contato"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email do Contato <span class="text-red-500">*</span>
                  </label>
                  <BaseInput
                    v-model="orgao.email_contato"
                    type="email"
                    required
                  />
                </div>
              </div>
            </div>

            <p v-if="form.orgaos_envolvidos.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
              Nenhum órgão envolvido cadastrado. Clique em "Adicionar Órgão" para começar.
            </p>
          </div>

          <!-- Vínculos -->
          <div v-show="currentTab === 'vinculos'" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Programa <span class="text-red-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.programa_id"
                  :options="programas"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Objetivo Estratégico <span class="text-red-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.objetivo_estrategico_id"
                  :options="objetivosEstrategicos"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Selo <span class="text-red-500">*</span>
                </label>
                <BaseSelect
                  v-model="form.selo_id"
                  :options="selos"
                  :disabled="form.tipo_iniciativa === 'boa_pratica'"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <BaseButton
              variant="secondary"
              type="button"
              @click="router.back()"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              variant="primary"
              type="submit"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Salvar Alterações' : 'Criar Iniciativa' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import BaseInput from '../components/base/BaseInput.vue';
import BaseSelect from '../components/base/BaseSelect.vue';
import { useAuth } from '../services/auth';
import type { Iniciativa } from '../types/iniciativas';
import { useIniciativas } from '../services/iniciativas';
import {
  useCronograma,
  useFinanceiro,
  useContatos,
  useAcoes,
  useRiscos,
  useDesafios,
  useJustificativas,
  useResultados,
  useAnexos,
  useOrgaosEnvolvidos,
  usePremios,
  usePublicidades
} from '../services/iniciativaRelacionamentos';

const router = useRouter();
const route = useRoute();
const { currentUser } = useAuth();

const isEditing = computed(() => route.name === 'editar-iniciativa');
const activeTab = ref('minhas-iniciativas');
const currentTab = ref('dados-basicos');

// Mock data - substituir por chamadas à API
const unidadesGestoras = [
  { value: '1', label: 'SUBPROCURADORIA-GERAL DE JUSTIÇA JURÍDICA' },
  { value: '2', label: 'PROMOTORIA DE JUSTIÇA' },
  { value: '3', label: 'DTI' }
];

const programas = [
  { value: '1', label: 'Programa de Excelência' },
  { value: '2', label: 'Programa de Inovação' }
];

const objetivosEstrategicos = [
  { value: '1', label: 'Modernização Tecnológica' },
  { value: '2', label: 'Eficiência Operacional' }
];

const selos = [
  { value: '1', label: 'PGJ' },
  { value: '2', label: 'CG Cidadã' }
];

const tabs = [
  { id: 'dados-basicos', label: 'Dados Básicos' },
  { id: 'objetivos', label: 'Objetivos' },
  { id: 'justificativas', label: 'Justificativas' },
  { id: 'orgaos-envolvidos', label: 'Órgãos Envolvidos' },
  { id: 'vinculos', label: 'Vínculos' }
];

const form = ref({
  tipo_iniciativa: '',
  nome_iniciativa: '',
  descricao_iniciativa: '',
  unidade_gestora_id: '',
  ano_vigencia: String(new Date().getFullYear()),
  promocao_objetivo: '',
  publico_impactado: '',
  programa_id: '',
  objetivo_estrategico_id: '',
  selo_id: '',
  justificativas: {
    resolutividade: '',
    inovacao: '',
    transparencia: '',
    proatividade: '',
    cooperacao: ''
  },
  orgaos_envolvidos: []
});

const isFormValid = computed(() => {
  // Validate Dados Básicos
  const hasDadosBasicos = [
    'tipo_iniciativa',
    'nome_iniciativa',
    'descricao_iniciativa',
    'unidade_gestora_id',
    'ano_vigencia'
  ].every(field => !!form.value[field]);

  // Validate Objetivos
  const hasObjetivos = [
    'promocao_objetivo',
    'publico_impactado'
  ].every(field => !!form.value[field]);

  // Validate Justificativas
  const hasAllJustificativas = Object.values(form.value.justificativas).every(j => !!j);

  // Validate Órgãos Envolvidos
  const hasOrgaosEnvolvidos = form.value.orgaos_envolvidos.length > 0 &&
    form.value.orgaos_envolvidos.every(orgao => 
      !!orgao.nome_orgao && 
      !!orgao.papel_orgao && 
      !!orgao.nome_contato && 
      !!orgao.email_contato
    );

  // Validate Vínculos (all fields are required)
  const hasVinculos = [
    'programa_id',
    'objetivo_estrategico_id',
    'selo_id'
  ].every(field => !!form.value[field]);

  return hasDadosBasicos && 
         hasObjetivos && 
         hasAllJustificativas && 
         hasOrgaosEnvolvidos &&
         hasVinculos;
});

const handleSubmit = async () => {
  try {
    const submitData = {
      ...form.value,
      unidade_gestora_id: form.value.unidade_gestora_id ? Number(form.value.unidade_gestora_id) : null,
      programa_id: form.value.programa_id ? Number(form.value.programa_id) : null,
      objetivo_estrategico_id: form.value.objetivo_estrategico_id ? Number(form.value.objetivo_estrategico_id) : null,
      selo_id: form.value.selo_id ? Number(form.value.selo_id) : null,
      ano_vigencia: Number(form.value.ano_vigencia),
      status_atual: 'nao_iniciado',
      status_aprovacao: 'aguardando_aprovacao',
      percentual_conclusao: 0
    };
    
    // TODO: Implementar chamada à API
    console.log('Form submitted:', submitData);
    router.push({ name: 'minhas-iniciativas' });
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const addOrgaoEnvolvido = () => {
  form.value.orgaos_envolvidos.push({
    nome_orgao: '',
    papel_orgao: '',
    nome_contato: '',
    email_contato: '',
    obrigatorio: true
  });
};

const removeOrgaoEnvolvido = (index: number) => {
  form.value.orgaos_envolvidos.splice(index, 1);
};

onMounted(async () => {
  if (isEditing.value) {
    const id = route.params.id;
    try {
      // TODO: Buscar dados da iniciativa
      // const response = await api.get(`/iniciativas/${id}`);
      // form.value = response.data;
    } catch (error) {
      console.error('Error fetching initiative:', error);
    }
  }
});
</script> 