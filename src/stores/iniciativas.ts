import { defineStore } from 'pinia';
import type { Iniciativa } from '../types/iniciativas';
import { useIniciativas } from '../services/iniciativas';

interface State {
  iniciativas: Iniciativa[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  filters: {
    status?: string;
    tipo?: string;
    unidade?: number;
  };
}

export const useIniciativasStore = defineStore('iniciativas', {
  state: (): State => ({
    iniciativas: [],
    loading: false,
    error: null,
    lastFetch: null,
    filters: {}
  }),

  getters: {
    // Retorna iniciativas filtradas
    filteredIniciativas: (state) => {
      let filtered = [...state.iniciativas];
      
      if (state.filters.status) {
        filtered = filtered.filter(i => i.status_atual === state.filters.status);
      }
      
      if (state.filters.tipo) {
        filtered = filtered.filter(i => i.tipo_iniciativa === state.filters.tipo);
      }
      
      if (state.filters.unidade) {
        filtered = filtered.filter(i => i.unidade_gestora_id === state.filters.unidade);
      }
      
      return filtered;
    },

    // Retorna iniciativas por status
    iniciativasPorStatus: (state) => {
      const result: Record<string, number> = {
        nao_iniciado: 0,
        em_andamento: 0,
        concluido: 0,
        suspenso: 0
      };

      state.iniciativas.forEach(iniciativa => {
        result[iniciativa.status_atual]++;
      });

      return result;
    },

    // Calcula o percentual médio de conclusão
    percentualMedioConclusao: (state) => {
      if (!state.iniciativas.length) return 0;
      const soma = state.iniciativas.reduce((acc, ini) => acc + ini.percentual_conclusao, 0);
      return soma / state.iniciativas.length;
    },

    // Verifica se os dados precisam ser recarregados (cache de 5 minutos)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true;
      const CACHE_TIME = 5 * 60 * 1000; // 5 minutos
      return Date.now() - state.lastFetch > CACHE_TIME;
    }
  },

  actions: {
    setFilters(filters: Partial<State['filters']>) {
      this.filters = { ...this.filters, ...filters };
    },

    clearFilters() {
      this.filters = {};
    },

    async fetchIniciativas(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const iniciativasService = useIniciativas();
        const response = await iniciativasService.getIniciativas();
        this.iniciativas = response;
        this.lastFetch = Date.now();
      } catch (error) {
        console.error('Erro ao buscar iniciativas:', error);
        this.error = error instanceof Error ? error.message : 'Erro ao carregar iniciativas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async refreshIniciativa(id: number) {
      try {
        const iniciativasService = useIniciativas();
        const iniciativa = await iniciativasService.getIniciativa(id);
        
        if (iniciativa) {
          const index = this.iniciativas.findIndex(i => i.id === id);
          if (index !== -1) {
            this.iniciativas[index] = iniciativa;
          }
        }
      } catch (error) {
        console.error(`Erro ao atualizar iniciativa ${id}:`, error);
        throw error;
      }
    }
  }
}); 