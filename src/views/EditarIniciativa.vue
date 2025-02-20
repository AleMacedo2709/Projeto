<template>
  <div class="min-h-screen flex">
    <TheSidebar v-model:activeTab="activeTab" />
    
    <div class="flex-1">
      <TheHeader />
      
      <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Iniciativa
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ iniciativa?.nome_iniciativa }}
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

        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>

        <template v-else>
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
              </button>
            </nav>
          </div>

          <!-- Content -->
          <div class="space-y-6">
            <!-- Dados Básicos -->
            <div v-show="currentTab === 'dados-basicos'">
              <form @submit.prevent="salvarDadosBasicos" class="space-y-6">
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
                      Programa
                    </label>
                    <BaseSelect
                      v-model="form.programa_id"
                      :options="programas"
                      :disabled="form.tipo_iniciativa === 'boa_pratica'"
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
                      Selo
                    </label>
                    <BaseSelect
                      v-model="form.selo_id"
                      :options="selos"
                      :disabled="form.tipo_iniciativa === 'boa_pratica'"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Ano de Vigência <span class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="form.ano_vigencia"
                      type="number"
                      :min="2000"
                      :max="2100"
                      required
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Status Atual
                    </label>
                    <BaseSelect
                      v-model="form.status_atual"
                      :options="[
                        { value: 'nao_iniciado', label: 'Não Iniciado' },
                        { value: 'em_andamento', label: 'Em Andamento' },
                        { value: 'concluido', label: 'Concluído' },
                        { value: 'suspenso', label: 'Suspenso' }
                      ]"
                      disabled
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

                <div class="flex justify-end">
                  <BaseButton
                    variant="primary"
                    type="submit"
                    :loading="saving"
                  >
                    Salvar Alterações
                  </BaseButton>
                </div>
              </form>
            </div>

            <!-- Objetivos -->
            <div v-show="currentTab === 'objetivos'">
              <form @submit.prevent="salvarObjetivos" class="space-y-6">
                <div class="space-y-6">
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
                      Público Impactado <span class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="form.publico_impactado"
                      required
                    />
                  </div>
                </div>

                <div class="flex justify-end">
                  <BaseButton
                    variant="primary"
                    type="submit"
                    :loading="saving"
                  >
                    Salvar Alterações
                  </BaseButton>
                </div>
              </form>
            </div>

            <!-- Tabs de Relacionamentos -->
            <div v-show="currentTab === 'cronograma' && form.tipo_iniciativa !== 'boa_pratica'">
              <CronogramaTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'financeiro' && form.tipo_iniciativa !== 'boa_pratica'">
              <FinanceiroTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'contatos'">
              <ContatosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'acoes'">
              <AcoesTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'riscos'">
              <RiscosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'desafios' && form.tipo_iniciativa !== 'boa_pratica'">
              <DesafiosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'justificativas'">
              <JustificativasTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'resultados'">
              <ResultadosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'anexos'">
              <AnexosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'orgaos-envolvidos'">
              <OrgaosEnvolvidosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'premios'">
              <PremiosTab :iniciativa-id="iniciativaId" />
            </div>

            <div v-show="currentTab === 'publicidades'">
              <PublicidadesTab :iniciativa-id="iniciativaId" />
            </div>
          </div>
        </template>
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
import CronogramaTab from '../components/iniciativas/CronogramaTab.vue';
import FinanceiroTab from '../components/iniciativas/FinanceiroTab.vue';
import ContatosTab from '../components/iniciativas/ContatosTab.vue';
import AcoesTab from '../components/iniciativas/AcoesTab.vue';
import RiscosTab from '../components/iniciativas/RiscosTab.vue';
import DesafiosTab from '../components/iniciativas/DesafiosTab.vue';
import JustificativasTab from '../components/iniciativas/JustificativasTab.vue';
import ResultadosTab from '../components/iniciativas/ResultadosTab.vue';
import AnexosTab from '../components/iniciativas/AnexosTab.vue';
import OrgaosEnvolvidosTab from '../components/iniciativas/OrgaosEnvolvidosTab.vue';
import PremiosTab from '../components/iniciativas/PremiosTab.vue';
import PublicidadesTab from '../components/iniciativas/PublicidadesTab.vue';

import { useIniciativas } from '../services/iniciativas';
import type { Iniciativa } from '../types/iniciativas';

const router = useRouter();
const route = useRoute();
const iniciativaId = Number(route.params.id);
const iniciativasService = useIniciativas();

const activeTab = ref('minhas-iniciativas');
const currentTab = ref('dados-basicos');
const loading = ref(true);
const saving = ref(false);
const iniciativa = ref<Iniciativa | null>(null);

// Form data
const form = ref<Partial<Iniciativa>>({
  tipo_iniciativa: '',
  nome_iniciativa: '',
  unidade_gestora_id: undefined,
  selo_id: undefined,
  programa_id: undefined,
  objetivo_estrategico_id: undefined,
  descricao_iniciativa: '',
  promocao_objetivo: '',
  publico_impactado: '',
  ano_vigencia: String(new Date().getFullYear()),
  status_atual: 'nao_iniciado',
  status_aprovacao: 'aguardando_aprovacao',
  percentual_conclusao: 0
});

// Tabs configuration
const tabs = [
  { id: 'dados-basicos', label: 'Dados Básicos' },
  { id: 'objetivos', label: 'Objetivos' },
  { id: 'cronograma', label: 'Cronograma' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'contatos', label: 'Contatos' },
  { id: 'acoes', label: 'Ações' },
  { id: 'riscos', label: 'Riscos' },
  { id: 'desafios', label: 'Desafios' },
  { id: 'justificativas', label: 'Justificativas' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'anexos', label: 'Anexos' },
  { id: 'orgaos-envolvidos', label: 'Órgãos Envolvidos' },
  { id: 'premios', label: 'Prêmios' },
  { id: 'publicidades', label: 'Publicidade' }
];

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

// Methods
const carregarIniciativa = async () => {
  loading.value = true;
  try {
    const response = await iniciativasService.getIniciativa(iniciativaId);
    if (response) {
      iniciativa.value = response;
      form.value = {
        ...response,
        ano_vigencia: String(response.ano_vigencia) // Convert to string for the form
      };
    }
  } catch (error) {
    console.error('Erro ao carregar iniciativa:', error);
  } finally {
    loading.value = false;
  }
};

const salvarDadosBasicos = async () => {
  saving.value = true;
  try {
    const dadosBasicos = {
      ...form.value,
      ano_vigencia: Number(form.value.ano_vigencia) // Convert back to number for API
    };
    await iniciativasService.atualizarIniciativa(iniciativaId, dadosBasicos);
    await carregarIniciativa();
  } catch (error) {
    console.error('Erro ao salvar dados básicos:', error);
  } finally {
    saving.value = false;
  }
};

const salvarObjetivos = async () => {
  saving.value = true;
  try {
    await iniciativasService.atualizarIniciativa(iniciativaId, form.value);
    // TODO: Mostrar mensagem de sucesso
  } catch (error) {
    console.error('Erro ao salvar objetivos:', error);
    // TODO: Mostrar mensagem de erro
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await carregarIniciativa();
});
</script> 