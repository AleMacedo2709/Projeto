<template>
  <div class="space-y-6">
    <div class="flex justify-between items-start">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {{ iniciativa.nome_iniciativa }}
      </h1>
      <BotoesExportacao :iniciativa="iniciativa" />
    </div>

    <DashboardIniciativa 
      :iniciativa="iniciativa"
      :indicadores="indicadores"
    />
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="space-y-6">
          <section>
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Detalhes da Iniciativa
            </h2>
            <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Nome da Iniciativa
                </dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ iniciativa.nome_iniciativa }}
                </dd>
              </div>
              
              <div class="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Tipo de Iniciativa
                </dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {{ iniciativa.tipo_iniciativa }}
                </dd>
              </div>
              
              <div class="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Unidade Gestora
                </dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ iniciativa.unidade_gestora }}
                </dd>
              </div>
              
              <div class="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Público Impactado
                </dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ iniciativa.publico_impactado }}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Descrição
            </h2>
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {{ iniciativa.descricao_iniciativa }}
              </p>
            </div>
          </section>

          <section>
            <AnexosIniciativa :iniciativa-id="iniciativa.id" />
          </section>

          <section>
            <ComentariosIniciativa :iniciativa-id="iniciativa.id" />
          </section>
        </div>
      </div>

      <div class="lg:col-span-1">
        <AtividadesIniciativa :atividades="atividades" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardIniciativa from './DashboardIniciativa.vue';
import AtividadesIniciativa from './AtividadesIniciativa.vue';
import BotoesExportacao from './BotoesExportacao.vue';
import ComentariosIniciativa from './ComentariosIniciativa.vue';
import AnexosIniciativa from './AnexosIniciativa.vue';
import { calcularIndicadoresIniciativa } from '../../services/calculosIniciativa';
import { getAtividadesIniciativa } from '../../services/atividadesIniciativa';
import type { Iniciativa } from '../../types/iniciativas';
import type { Atividade } from '../../services/atividadesIniciativa';

const props = defineProps<{
  iniciativa: Iniciativa;
}>();

const atividades = ref<Atividade[]>([]);
const carregando = ref(false);
const erro = ref<string | null>(null);

const indicadores = computed(() => calcularIndicadoresIniciativa(props.iniciativa));

const carregarAtividades = async () => {
  carregando.value = true;
  erro.value = null;
  
  try {
    atividades.value = await getAtividadesIniciativa(props.iniciativa.id);
  } catch (error) {
    erro.value = 'Erro ao carregar atividades';
    console.error(error);
  } finally {
    carregando.value = false;
  }
};

onMounted(() => {
  carregarAtividades();
});
</script> 