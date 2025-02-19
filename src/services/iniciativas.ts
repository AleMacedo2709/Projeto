import type { User } from './auth';
import api from './api';
import { mockIniciativas } from '../mocks/iniciativas';

export interface Iniciativa {
  id: number;
  nome_iniciativa: string;
  tipo_iniciativa: 'projeto' | 'boa_pratica' | 'programa';
  unidade_gestora_id: number;
  selo_id?: number;
  programa_id?: number;
  objetivo_estrategico_id?: number;
  descricao_iniciativa: string;
  promocao_objetivo: string;
  publico_impactado: string;
  ano_vigencia: number;
  status_atual: 'nao_iniciado' | 'em_andamento' | 'concluido' | 'suspenso';
  status_aprovacao: 'aguardando_aprovacao' | 'aprovado' | 'devolvido';
  data_ultima_atualizacao?: string;
  caminho_imagem?: string;
  data_criacao: string;
  data_atualizacao: string;
  percentual_conclusao: number;
  data_ultima_avaliacao?: string;
}

export interface IniciativaComPapel extends Iniciativa {
  tipo_papel: 'cadastrador' | 'autor' | 'equipe' | 'gerente_projeto' | 'patrocinador';
}

// Helper function to simulate API delay in development
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const useIniciativas = () => {
  const getMinhasIniciativas = async (userId: number): Promise<IniciativaComPapel[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        // Convert mock data to array and add tipo_papel
        return Object.values(mockIniciativas).map(iniciativa => ({
          ...iniciativa,
          tipo_papel: 'gerente_projeto'
        }));
      }
      const response = await api.get(`/iniciativas/usuario/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar iniciativas:', error);
      return [];
    }
  };

  const getIniciativasPorPapel = async (userId: number, papel: IniciativaComPapel['tipo_papel']): Promise<IniciativaComPapel[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return Object.values(mockIniciativas)
          .filter(iniciativa => iniciativa.id % 2 === 0) // Simulate filtering
          .map(iniciativa => ({
            ...iniciativa,
            tipo_papel: papel
          }));
      }
      const response = await api.get(`/iniciativas/usuario/${userId}/papel/${papel}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar iniciativas por papel:', error);
      return [];
    }
  };

  const getIniciativa = async (id: number): Promise<Iniciativa | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockIniciativas[id.toString()] || null;
      }
      const response = await api.get(`/iniciativas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar iniciativa:', error);
      return null;
    }
  };

  const criarIniciativa = async (iniciativa: Omit<Iniciativa, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<Iniciativa | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newId = Math.max(...Object.keys(mockIniciativas).map(Number)) + 1;
        const now = new Date().toISOString();
        const newIniciativa: Iniciativa = {
          ...iniciativa,
          id: newId,
          data_criacao: now,
          data_atualizacao: now
        };
        mockIniciativas[newId.toString()] = newIniciativa;
        return newIniciativa;
      }
      const response = await api.post('/iniciativas', iniciativa);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar iniciativa:', error);
      return null;
    }
  };

  const atualizarIniciativa = async (id: number, iniciativa: Partial<Iniciativa>): Promise<Iniciativa | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const existingIniciativa = mockIniciativas[id.toString()];
        if (!existingIniciativa) return null;
        const updatedIniciativa: Iniciativa = {
          ...existingIniciativa,
          ...iniciativa,
          data_atualizacao: new Date().toISOString()
        };
        mockIniciativas[id.toString()] = updatedIniciativa;
        return updatedIniciativa;
      }
      const response = await api.put(`/iniciativas/${id}`, iniciativa);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar iniciativa:', error);
      return null;
    }
  };

  const excluirIniciativa = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        if (!mockIniciativas[id.toString()]) return false;
        delete mockIniciativas[id.toString()];
        return true;
      }
      await api.delete(`/iniciativas/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir iniciativa:', error);
      return false;
    }
  };

  return {
    getMinhasIniciativas,
    getIniciativasPorPapel,
    getIniciativa,
    criarIniciativa,
    atualizarIniciativa,
    excluirIniciativa
  };
}; 