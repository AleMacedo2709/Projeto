<template>
  <div class="min-h-screen flex">
    <TheSidebar v-model:activeTab="activeTab" />
    
    <div class="flex-1">
      <TheHeader />
      
      <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <!-- Back Button -->
        <div class="mb-6">
          <button
            @click="router.back()"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          <!-- Main Info (Left) -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 h-full">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-4">
                    <span :class="{
                      'px-4 py-1.5 text-sm font-medium rounded-full inline-flex items-center': true,
                      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300': iniciativa.tipo_iniciativa === 'projeto',
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300': iniciativa.tipo_iniciativa === 'boa_pratica',
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': iniciativa.tipo_iniciativa === 'programa'
                    }">
                      <span class="w-2 h-2 rounded-full mr-2" :class="{
                        'bg-indigo-500 dark:bg-indigo-400': iniciativa.tipo_iniciativa === 'projeto',
                        'bg-emerald-500 dark:bg-emerald-400': iniciativa.tipo_iniciativa === 'boa_pratica',
                        'bg-purple-500 dark:bg-purple-400': iniciativa.tipo_iniciativa === 'programa'
                      }"></span>
                      {{ formatTipoIniciativa(iniciativa.tipo_iniciativa) }}
                    </span>
                    <span v-if="iniciativa.premios?.length" class="flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                      <TrophyIcon class="w-4 h-4 mr-2" />
                      {{ iniciativa.premios.length }} Prêmio{{ iniciativa.premios.length > 1 ? 's' : '' }}
                    </span>
                  </div>
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{{ iniciativa.nome_iniciativa }}</h1>
                  <div class="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                    <div class="flex items-center gap-3">
                      <CalendarIcon class="w-5 h-5 text-gray-400" />
                      <span>Ano: {{ iniciativa.ano_vigencia }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <ClockIcon class="w-5 h-5 text-gray-400" />
                      <span>Status: {{ formatStatus(iniciativa.status_atual) }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <CalendarDaysIcon class="w-5 h-5 text-gray-400" />
                      <span>Última Atualização: {{ formatDate(iniciativa.data_ultima_atualizacao) }}</span>
                    </div>
                                <!-- Program Card -->
                    <div class="bg-white dark:bg-gray-900/60 shadow rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Programa</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ iniciativa.programa }}</p>
                    </div>

                    <!-- Strategic Objective Card -->
                    <div class="bg-white dark:bg-gray-900/60 shadow rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Objetivo Estratégico</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ iniciativa.objetivo_estrategico }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side -->
          <div class="h-full">
            <!-- Project Image -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden h-full">
              <img 
                v-if="iniciativa.caminho_imagem" 
                :src="iniciativa.caminho_imagem" 
                :alt="iniciativa.nome_iniciativa"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <PhotoIcon class="w-20 h-20 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Interações -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between border-b dark:border-gray-700 pb-4">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <button 
                  @click="toggleLike"
                  class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  :class="{ 'text-blue-600 dark:text-blue-400': hasUserLiked }"
                >
                  <HeartIconSolid v-if="hasUserLiked" class="w-5 h-5" />
                  <HeartIconOutline v-else class="w-5 h-5" />
                  <span class="text-sm">{{ iniciativa.curtidas?.length || 0 }} curtidas</span>
                </button>
                <button 
                  @click="showCommentInput = true"
                  class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ChatBubbleLeftIcon class="w-5 h-5" />
                  <span class="text-sm">{{ iniciativa.comentarios?.length || 0 }} comentários</span>
                </button>
              </div>
              <!-- Lista de quem curtiu -->
              <div v-if="iniciativa.curtidas?.length" class="text-sm text-gray-500 dark:text-gray-400">
                Curtido por 
                <span v-for="(curtida, index) in curtidaComUsuarios" :key="curtida.id">
                  <span class="font-medium text-gray-900 dark:text-white">{{ curtida.usuario.nome_usuario }}</span>
                  <span v-if="index < iniciativa.curtidas.length - 2">, </span>
                  <span v-else-if="index === iniciativa.curtidas.length - 2"> e </span>
                </span>
              </div>
            </div>
            <button
              @click="downloadPDF"
              class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg transition-colors"
            >
              <DocumentArrowDownIcon class="w-5 h-5" />
              Baixar PDF
            </button>
          </div>

          <!-- Input de Comentário -->
          <div v-if="showCommentInput" class="mt-4">
            <div class="flex gap-4">
              <BaseInput
                v-model="newComment"
                placeholder="Adicione um comentário..."
                class="flex-1"
              />
              <BaseButton
                variant="primary"
                :disabled="!newComment.trim()"
                @click="addComment"
              >
                Comentar
              </BaseButton>
              <BaseButton
                variant="secondary"
                @click="showCommentInput = false"
              >
                Cancelar
              </BaseButton>
            </div>
          </div>

          <!-- Lista de Comentários -->
          <div v-if="iniciativa.comentarios?.length" class="mt-4 space-y-4">
            <div 
              v-for="comentario in sortedComments" 
              :key="comentario.id"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ comentario.usuario.nome_usuario }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {{ formatDate(comentario.data_criacao) }}
                  </span>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-300">{{ comentario.texto_comentario }}</p>
            </div>
          </div>
        </div>

        <!-- Seções de Conteúdo -->
        <div class="space-y-6 mt-6">
          <!-- Descritivo -->
          <section id="descritivo" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Descritivo</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição da Iniciativa</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ iniciativa.descricao_iniciativa }}</p>
              </div>
            </div>
          </section>

          <!-- Público Impactado -->
          <section id="publico-impactado" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Público Impactado</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ iniciativa.publico_alvo }}</p>
          </section>

          <!-- Como promove objetivo -->
          <section id="como-promove-objetivo" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Como promove objetivo</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ iniciativa.promocao_objetivo }}</p>
          </section>

          <!-- Contatos -->
          <section id="contatos" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contatos</h2>
            <div class="space-y-4">
              <div v-for="contato in iniciativa.contatos" :key="contato.id" class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">{{ contato.usuario.nome_usuario }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ contato.tipo_papel }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ contato.usuario.email_usuario }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Cronograma e Financeiro -->
          <section id="cronograma-financeiro" v-if="iniciativa.tipo_iniciativa === 'projeto'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cronograma e Financeiro</h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cronograma</h3>
                <div class="space-y-2">
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Início Planejado:</span> 
                    {{ iniciativa.cronograma?.data_inicio_planejada }}
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Fim Planejado:</span> 
                    {{ iniciativa.cronograma?.data_fim_planejada }}
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Início Real:</span> 
                    {{ iniciativa.cronograma?.data_inicio_real || '-' }}
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Fim Real:</span> 
                    {{ iniciativa.cronograma?.data_fim_real || '-' }}
                  </p>
                </div>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Financeiro</h3>
                <div class="space-y-2">
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Custo Planejado:</span> 
                    R$ {{ iniciativa.financeiro?.custo_planejado || '-' }}
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Custo Real:</span> 
                    R$ {{ iniciativa.financeiro?.custo_real || '-' }}
                  </p>
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Economia:</span> 
                    R$ {{ iniciativa.financeiro?.economia || '-' }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Ações -->
          <section id="acoes" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações</h2>
            <div class="space-y-4">
              <div v-for="acao in iniciativa.acoes" :key="acao.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ acao.nome_acao }}</h3>
                  <span :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300': acao.status_acao === 'nao_iniciado',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': acao.status_acao === 'em_andamento',
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': acao.status_acao === 'concluido'
                  }">
                    {{ formatStatus(acao.status_acao) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ acao.unidade_responsavel }}</p>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <p>Responsável: {{ acao.email_responsavel }}</p>
                  <p>Período: {{ acao.data_inicio_planejada }} - {{ acao.data_fim_planejada }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Riscos -->
          <section id="riscos" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Riscos</h2>
            <div class="space-y-4">
              <div v-for="risco in iniciativa.riscos" :key="risco.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div class="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Tipo: {{ risco.tipo_risco.nome_tipo }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ risco.descricao_risco }}</p>
                  </div>
                  <div>
                    <p class="text-sm"><span class="font-medium text-gray-700 dark:text-gray-200">Probabilidade:</span> <span class="text-gray-600 dark:text-gray-300">{{ risco.probabilidade }}</span></p>
                    <p class="text-sm"><span class="font-medium text-gray-700 dark:text-gray-200">Impacto:</span> <span class="text-gray-600 dark:text-gray-300">{{ risco.impacto }}</span></p>
                  </div>
                </div>
                <div class="mt-2">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Ação de Mitigação:</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ risco.acao_mitigacao }}</p>
                </div>
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>Responsável: {{ risco.nome_responsavel }} ({{ risco.email_responsavel }})</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Desafios -->
          <section id="desafios" v-if="iniciativa.tipo_iniciativa === 'projeto'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Desafios</h2>
            <div class="space-y-4">
              <div v-for="desafio in iniciativa.desafios" :key="desafio.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-start">
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ desafio.descricao_desafio }}</p>
                  <span :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300': desafio.status_desafio === 'pendente',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': desafio.status_desafio === 'em_andamento',
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': desafio.status_desafio === 'superado'
                  }">
                    {{ desafio.status_desafio }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Justificativas -->
          <section id="justificativas" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Justificativas</h2>
            <div class="space-y-4">
              <div v-for="justificativa in iniciativa.justificativas" :key="justificativa.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ justificativa.tipo_justificativa }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ justificativa.descricao_justificativa }}</p>
              </div>
            </div>
          </section>

          <!-- Resultados -->
          <section id="resultados" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resultados</h2>
            <div class="space-y-4">
              <div v-for="resultado in iniciativa.resultados" :key="resultado.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-start">
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ resultado.descricao_resultado }}</p>
                  <span :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': resultado.status_resultado === 'alcancado',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': resultado.status_resultado === 'parcialmente_alcancado',
                    'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': resultado.status_resultado === 'nao_alcancado'
                  }">
                    {{ resultado.status_resultado }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Anexos -->
          <section id="anexos" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Anexos</h2>
            <div class="space-y-4">
              <div v-for="anexo in iniciativa.anexos" :key="anexo.id" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ anexo.nome_anexo }}</p>
                  <p class="text-sm text-gray-500">{{ formatFileSize(anexo.tamanho_arquivo) }} - {{ anexo.tipo_arquivo }}</p>
                </div>
                <button 
                  @click="downloadAnexo(anexo)"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                  :title="`Baixar ${anexo.nome_anexo}`"
                >
                  <ArrowDownTrayIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          <!-- Órgãos Envolvidos -->
          <section id="orgaos-envolvidos" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Órgãos Envolvidos</h2>
            <div class="space-y-4">
              <div v-for="orgao in iniciativa.orgaos_envolvidos" :key="orgao.id" class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ orgao.nome_orgao }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Papel: {{ orgao.papel_orgao }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Contato: {{ orgao.nome_contato }} ({{ orgao.email_contato }})</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import html2pdf from 'html2pdf.js';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  CalendarDaysIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline';
import TheSidebar from '../components/layout/TheSidebar.vue';
import TheHeader from '../components/layout/TheHeader.vue';
import BaseInput from '../components/base/BaseInput.vue';
import BaseButton from '../components/base/BaseButton.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('iniciativas-mpsp');

// Mock data - substituir por chamada à API
const iniciativa = ref<any>({
  id: Number(route.params.id),
  nome_iniciativa: 'Estratégia Jurídica',
  tipo_iniciativa: 'projeto',
  caminho_imagem: '/images/projeto-estrategia-juridica.jpg',
  premios: [
    {
      id: 1,
      nome: 'Prêmio Inovação MPSP 2023',
      data_premiacao: '2023-12-15'
    }
  ],
  descricao_iniciativa: 'A Subprocuradoria-Geral de Justiça Jurídica requisitou ao setor de Jurimetria, vinculado à Subprocuradoria-Geral de Justiça de Estratégia e Inovação, o desenvolvimento de uma solução tecnológica destinada à manipulação e análise de dados processuais do acervo do Superior Tribunal de Justiça (STJ). Esta iniciativa tem como objetivo aprimorar e tornar mais eficiente a atuação do Ministério Público do Estado de São Paulo (MPSP) nos processos e recursos em trâmite naquela Corte Superior, com foco em gestão de precedentes e intervenções estratégicas.',
  objetivo_estrategico: 'Capacitação de membros e servidores',
  programa: 'III - Melhoria e inovação das atividades administrativas e de apoio',
  unidade_gestora: 'SUBPROCURADORIA-GERAL DE JUSTIÇA JURÍDICA',
  status_atual: 'nao_iniciado',
  status_aprovacao: 'aprovado',
  ano_vigencia: 2024,
  selo: 'PGJ',
  data_ultima_atualizacao: '2025-01-13T00:00:00',
  publico_alvo: 'Membros e servidores do MPSP',
  promocao_objetivo: 'Através de treinamentos e capacitações',
  recursos_estimados: 'R$ 100.000,00',
  contatos: [
    {
      id: 1,
      tipo_papel: 'Gestor',
      usuario: {
        nome_usuario: 'João Silva',
        email_usuario: 'joao.silva@mpsp.mp.br'
      }
    },
    {
      id: 2,
      tipo_papel: 'Responsável Técnico',
      usuario: {
        nome_usuario: 'Maria Santos',
        email_usuario: 'maria.santos@mpsp.mp.br'
      }
    }
  ],
  cronograma: {
    data_inicio_planejada: '01/02/2024',
    data_fim_planejada: '31/12/2024',
    data_inicio_real: null,
    data_fim_real: null
  },
  financeiro: {
    custo_planejado: '150000.00',
    custo_real: null,
    economia: null
  },
  acoes: [
    {
      id: 1,
      nome_acao: 'Levantamento de Requisitos',
      status_acao: 'nao_iniciado',
      unidade_responsavel: 'Setor de Jurimetria',
      email_responsavel: 'jurimetria@mpsp.mp.br',
      data_inicio_planejada: '01/02/2024',
      data_fim_planejada: '28/02/2024'
    },
    {
      id: 2,
      nome_acao: 'Desenvolvimento da Solução',
      status_acao: 'nao_iniciado',
      unidade_responsavel: 'DTI',
      email_responsavel: 'dti@mpsp.mp.br',
      data_inicio_planejada: '01/03/2024',
      data_fim_planejada: '31/10/2024'
    }
  ],
  riscos: [
    {
      id: 1,
      tipo_risco: { nome_tipo: 'Tecnológico' },
      descricao_risco: 'Dificuldade de integração com sistemas legados',
      probabilidade: 'Média',
      impacto: 'Alto',
      acao_mitigacao: 'Realizar análise prévia da arquitetura dos sistemas',
      nome_responsavel: 'Pedro Oliveira',
      email_responsavel: 'pedro.oliveira@mpsp.mp.br'
    }
  ],
  desafios: [
    {
      id: 1,
      descricao_desafio: 'Complexidade da integração com o sistema do STJ',
      status_desafio: 'pendente'
    }
  ],
  justificativas: [
    {
      id: 1,
      tipo_justificativa: 'Necessidade',
      descricao_justificativa: 'Otimização do processo de análise de precedentes'
    }
  ],
  resultados: [
    {
      id: 1,
      descricao_resultado: 'Redução do tempo de análise de precedentes',
      status_resultado: 'nao_alcancado'
    }
  ],
  anexos: [
    {
      id: 1,
      nome_anexo: 'Documento de Visão.pdf',
      tamanho_arquivo: 2048576,
      tipo_arquivo: 'PDF'
    }
  ],
  orgaos_envolvidos: [
    {
      id: 1,
      nome_orgao: 'Subprocuradoria-Geral de Justiça Jurídica',
      papel_orgao: 'Gestor',
      nome_contato: 'Ana Paula',
      email_contato: 'ana.paula@mpsp.mp.br',
      obrigatorio: true
    },
    {
      id: 2,
      nome_orgao: 'DTI',
      papel_orgao: 'Executor',
      nome_contato: 'Carlos Eduardo',
      email_contato: 'carlos.eduardo@mpsp.mp.br',
      obrigatorio: true
    }
  ],
  curtidas: [
    {
      id: 1,
      iniciativa_id: 1,
      usuario_id: 2,
      data_criacao: '2024-01-15T10:30:00'
    },
    {
      id: 2,
      iniciativa_id: 1,
      usuario_id: 3,
      data_criacao: '2024-01-16T14:20:00'
    }
  ],
  comentarios: [
    {
      id: 1,
      iniciativa_id: 1,
      usuario_id: 2,
      texto_comentario: 'Excelente iniciativa! Vai ajudar muito na eficiência do trabalho.',
      data_criacao: '2024-01-15T10:35:00',
      usuario: {
        nome_usuario: 'Maria Santos'
      }
    },
    {
      id: 2,
      iniciativa_id: 1,
      usuario_id: 3,
      texto_comentario: 'Importante projeto para modernização do MPSP.',
      data_criacao: '2024-01-16T14:25:00',
      usuario: {
        nome_usuario: 'Pedro Oliveira'
      }
    }
  ]
});

const formatTipoIniciativa = (tipo: string) => {
  const formats = {
    projeto: 'Projeto',
    boa_pratica: 'Boa Prática',
    programa: 'Programa'
  };
  return formats[tipo as keyof typeof formats] || tipo;
};

const formatStatus = (status: string) => {
  const formats = {
    nao_iniciado: 'Não Iniciado',
    em_andamento: 'Em andamento',
    concluido: 'Concluído',
    suspenso: 'Suspenso'
  };
  return formats[status as keyof typeof formats] || status;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const downloadAnexo = (anexo: any) => {
  // Criar um blob com conteúdo vazio (simulação)
  const blob = new Blob([''], { type: 'application/octet-stream' });
  
  // Criar URL do blob
  const url = window.URL.createObjectURL(blob);
  
  // Criar elemento de link temporário
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', anexo.nome_anexo);
  
  // Anexar o link ao documento
  document.body.appendChild(link);
  
  // Simular clique e remover o link
  link.click();
  link.parentNode?.removeChild(link);
  
  // Liberar a URL do objeto
  window.URL.revokeObjectURL(url);
};

// Estado para curtidas e comentários
const usuarioLogado = ref({
  id: 1, // Mock do ID do usuário logado
  nome: 'João Silva'
});

const hasUserLiked = computed(() => {
  return iniciativa.value.curtidas?.some(curtida => curtida.usuario_id === usuarioLogado.value.id) || false;
});

const showCommentInput = ref(false);
const newComment = ref('');

const sortedComments = computed(() => {
  if (!iniciativa.value.comentarios) return [];
  return [...iniciativa.value.comentarios].sort((a, b) => 
    new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
  );
});

const toggleLike = async () => {
  try {
    if (hasUserLiked.value) {
      // Remover curtida
      const curtidaIndex = iniciativa.value.curtidas.findIndex(
        curtida => curtida.usuario_id === usuarioLogado.value.id
      );
      iniciativa.value.curtidas.splice(curtidaIndex, 1);
    } else {
      // Adicionar curtida
      iniciativa.value.curtidas = iniciativa.value.curtidas || [];
      iniciativa.value.curtidas.push({
        id: Date.now(), // Temporário, será gerado pelo backend
        iniciativa_id: iniciativa.value.id,
        usuario_id: usuarioLogado.value.id,
        data_criacao: new Date().toISOString()
      });
    }
    // TODO: Integrar com API quando disponível
  } catch (error) {
    console.error('Erro ao processar curtida:', error);
  }
};

const addComment = async () => {
  try {
    if (!newComment.value.trim()) return;
    
    // Criar novo comentário
    const novoComentario = {
      id: Date.now(), // Temporário, será gerado pelo backend
      iniciativa_id: iniciativa.value.id,
      usuario_id: usuarioLogado.value.id,
      texto_comentario: newComment.value,
      data_criacao: new Date().toISOString(),
      usuario: {
        nome_usuario: usuarioLogado.value.nome
      }
    };
    
    // Adicionar à lista
    iniciativa.value.comentarios = iniciativa.value.comentarios || [];
    iniciativa.value.comentarios.push(novoComentario);
    
    // Limpar input e fechar
    newComment.value = '';
    showCommentInput.value = false;
    
    // TODO: Integrar com API quando disponível
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
  }
};

const formatDate = (dateString: string) => {
  try {
    // Se a data já estiver no formato dd/mm/yyyy, retorna ela mesma
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    // Tenta criar um objeto Date
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

const curtidaComUsuarios = computed(() => {
  return iniciativa.value.curtidas.map(curtida => ({
    ...curtida,
    usuario: iniciativa.value.contatos.find(c => c.usuario.id === curtida.usuario_id)?.usuario || {
      nome_usuario: curtida.usuario_id === 2 ? 'Maria Santos' : 
                   curtida.usuario_id === 3 ? 'Pedro Oliveira' : 
                   curtida.usuario_id === 1 ? 'João Silva' : 'Usuário'
    }
  }));
});

const downloadPDF = async () => {
  try {
    // Criar elemento temporário para o conteúdo do PDF
    const pdfContent = document.createElement('div');
    pdfContent.innerHTML = `
      <div style="padding: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">${iniciativa.value.nome_iniciativa}</h1>
        
        <div style="margin-bottom: 20px;">
          <p><strong>Tipo:</strong> ${formatTipoIniciativa(iniciativa.value.tipo_iniciativa)}</p>
          <p><strong>Status:</strong> ${formatStatus(iniciativa.value.status_atual)}</p>
          <p><strong>Unidade Gestora:</strong> ${iniciativa.value.unidade_gestora}</p>
          <p><strong>Ano:</strong> ${iniciativa.value.ano_vigencia}</p>
          ${iniciativa.value.selo ? `<p><strong>Selo:</strong> ${iniciativa.value.selo}</p>` : ''}
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Descritivo</h2>
          <p>${iniciativa.value.descricao_iniciativa}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Público Impactado</h2>
          <p>${iniciativa.value.publico_alvo}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Como promove objetivo</h2>
          <p>${iniciativa.value.promocao_objetivo}</p>
        </div>

        ${iniciativa.value.tipo_iniciativa === 'projeto' ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 18px; margin-bottom: 10px;">Cronograma</h2>
            <p><strong>Início Planejado:</strong> ${iniciativa.value.cronograma?.data_inicio_planejada}</p>
            <p><strong>Fim Planejado:</strong> ${iniciativa.value.cronograma?.data_fim_planejada}</p>
            ${iniciativa.value.cronograma?.data_inicio_real ? `<p><strong>Início Real:</strong> ${iniciativa.value.cronograma.data_inicio_real}</p>` : ''}
            ${iniciativa.value.cronograma?.data_fim_real ? `<p><strong>Fim Real:</strong> ${iniciativa.value.cronograma.data_fim_real}</p>` : ''}
          </div>

          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 18px; margin-bottom: 10px;">Financeiro</h2>
            <p><strong>Custo Planejado:</strong> R$ ${iniciativa.value.financeiro?.custo_planejado || '-'}</p>
            <p><strong>Custo Real:</strong> R$ ${iniciativa.value.financeiro?.custo_real || '-'}</p>
            <p><strong>Economia:</strong> R$ ${iniciativa.value.financeiro?.economia || '-'}</p>
          </div>
        ` : ''}

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Contatos</h2>
          ${iniciativa.value.contatos.map(contato => `
            <div style="margin-bottom: 10px;">
              <p><strong>${contato.tipo_papel}:</strong> ${contato.usuario.nome_usuario}</p>
              <p>${contato.usuario.email_usuario}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Ações</h2>
          ${iniciativa.value.acoes.map(acao => `
            <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc;">
              <p><strong>${acao.nome_acao}</strong></p>
              <p>Status: ${formatStatus(acao.status_acao)}</p>
              <p>Responsável: ${acao.email_responsavel}</p>
              <p>Período: ${acao.data_inicio_planejada} - ${acao.data_fim_planejada}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Configurações do PDF
    const opt = {
      margin: 10,
      filename: `iniciativa-${iniciativa.value.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Gerar PDF
    const pdf = await html2pdf().set(opt).from(pdfContent).save();
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
  }
};
</script>

<style scoped>
/* Estilo para scroll suave ao navegar entre seções */
html {
  scroll-behavior: smooth;
}

.outline-icon {
  @apply stroke-2;
}
</style> 