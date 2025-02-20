import type { Usuario, Iniciativa } from '../types/iniciativas';
import api from './api';
import { mockIniciativas } from '../mocks/iniciativas';
import { mockDelay } from '../utils/mockUtils';
import { useAuth } from './auth';

export interface IniciativaComPapel extends Iniciativa {
  tipo_papel: 'cadastrador' | 'autor' | 'equipe' | 'gerente_projeto' | 'patrocinador';
}

export const useIniciativas = () => {
  const auth = useAuth();

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

  const atualizarIniciativa = async (id: number, dados: Partial<Iniciativa>) => {
    const response = await api.patch<Iniciativa>(`/iniciativas/${id}`, dados);
    return response.data;
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

  const getIniciativasParaAprovacao = async () => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        // Convert mock data to array and filter for awaiting approval
        return Object.values(mockIniciativas).filter(iniciativa => 
          iniciativa.status_aprovacao === 'aguardando_aprovacao'
        );
      }
      
      const nivelAcesso = auth.getCurrentUser()?.nivel_acesso;
      const seloId = nivelAcesso === 'gestor_selo_pgj' ? 1 : 2; // 1 = PGJ, 2 = CG Cidadã
      
      const response = await api.get<Iniciativa[]>('/iniciativas', {
        params: {
          selo_id: seloId,
          status_aprovacao: 'aguardando_aprovacao'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar iniciativas para aprovação:', error);
      return [];
    }
  };

  const getIniciativas = async (params?: any) => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        // Filter mock data to only show approved initiatives
        const iniciativas = Object.values(mockIniciativas).filter(
          iniciativa => iniciativa.status_aprovacao === 'aprovado'
        );
        return iniciativas;
      }

      const response = await api.get<Iniciativa[]>('/iniciativas', { 
        params: {
          ...params,
          status_aprovacao: 'aprovado'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar iniciativas:', error);
      return [];
    }
  };

  const aprovarIniciativa = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const iniciativa = mockIniciativas[id.toString()];
        if (!iniciativa) return false;
        
        const now = new Date().toISOString();
        iniciativa.status_aprovacao = 'aprovado';
        iniciativa.data_aprovacao = now;
        iniciativa.data_atualizacao = now;
        return true;
      }
      
      await api.post(`/iniciativas/${id}/aprovar`);
      return true;
    } catch (error) {
      console.error('Erro ao aprovar iniciativa:', error);
      return false;
    }
  };

  const devolverIniciativa = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const iniciativa = mockIniciativas[id.toString()];
        if (!iniciativa) return false;
        
        const now = new Date().toISOString();
        iniciativa.status_aprovacao = 'retornado';
        iniciativa.data_retorno = now;
        iniciativa.data_atualizacao = now;
        return true;
      }
      
      await api.post(`/iniciativas/${id}/devolver`);
      return true;
    } catch (error) {
      console.error('Erro ao devolver iniciativa:', error);
      return false;
    }
  };

  const deletarIniciativa = async (id: number) => {
    await api.delete(`/iniciativas/${id}`);
  };

  return {
    getMinhasIniciativas,
    getIniciativasPorPapel,
    getIniciativa,
    criarIniciativa,
    atualizarIniciativa,
    excluirIniciativa,
    getIniciativasParaAprovacao,
    getIniciativas,
    deletarIniciativa,
    aprovarIniciativa,
    devolverIniciativa
  };
}; 