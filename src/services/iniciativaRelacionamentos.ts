import api from './api';
import { mockRelacionamentos } from '../mocks/iniciativaRelacionamentos';
import type {
  Cronograma,
  Financeiro,
  Contato,
  Acao,
  Risco,
  Desafio,
  Justificativa,
  Resultado,
  Anexo,
  OrgaoEnvolvido,
  Premio,
  Publicidade,
  Marco
} from '../types/iniciativas';
import { mockDelay } from '../utils/mockUtils';

// Type definitions for mock data structure
type MockRecord<T> = { [key: string]: T };
type MockArray<T> = { [key: string]: T[] };

type MockData = {
  cronogramas: MockRecord<Cronograma>;
  financeiros: MockRecord<Financeiro>;
  contatos: MockArray<Contato>;
  acoes: MockArray<Acao>;
  riscos: MockArray<Risco>;
  desafios: MockArray<Desafio>;
  justificativas: MockArray<Justificativa>;
  resultados: MockArray<Resultado>;
  anexos: MockArray<Anexo>;
  orgaos_envolvidos: MockArray<OrgaoEnvolvido>;
  premios: MockArray<Premio>;
  publicidades: MockArray<Publicidade>;
  marcos: MockArray<Marco>;
};

// Cast mock data to the correct type
const mockData = mockRelacionamentos as unknown as MockData;

// Cronograma
export const useCronograma = (iniciativaId: number) => {
  const getCronograma = async (): Promise<Cronograma | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.cronogramas[iniciativaId.toString()] || null;
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/cronograma`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cronograma:', error);
      return null;
    }
  };

  const getMarcos = async (): Promise<Marco[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.marcos[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/marcos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar marcos:', error);
      return [];
    }
  };

  const adicionarMarco = async (marco: Omit<Marco, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Marco | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newMarco: Marco = {
          ...marco,
          id: Date.now(),
          iniciativa_id: iniciativaId,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        if (!mockData.marcos[iniciativaId.toString()]) {
          mockData.marcos[iniciativaId.toString()] = [];
        }
        mockData.marcos[iniciativaId.toString()].push(newMarco);
        return newMarco;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/marcos`, marco);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar marco:', error);
      return null;
    }
  };

  const atualizarMarco = async (id: number, marco: Partial<Marco>): Promise<Marco | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const marcos = mockData.marcos[iniciativaId.toString()] || [];
        const index = marcos.findIndex(m => m.id === id);
        if (index === -1) return null;
        
        const updatedMarco = {
          ...marcos[index],
          ...marco,
          data_atualizacao: new Date().toISOString()
        };
        marcos[index] = updatedMarco;
        return updatedMarco;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/marcos/${id}`, marco);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar marco:', error);
      return null;
    }
  };

  const removerMarco = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const marcos = mockData.marcos[iniciativaId.toString()] || [];
        const index = marcos.findIndex(m => m.id === id);
        if (index === -1) return false;
        
        marcos.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/marcos/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover marco:', error);
      return false;
    }
  };

  const salvarCronograma = async (cronograma: Omit<Cronograma, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Cronograma | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newCronograma: Cronograma = {
          ...cronograma,
          id: Date.now(),
          iniciativa_id: iniciativaId,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        mockData.cronogramas[iniciativaId.toString()] = newCronograma;
        return newCronograma;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/cronograma`, cronograma);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar cronograma:', error);
      return null;
    }
  };

  const atualizarCronograma = async (cronograma: Partial<Cronograma>): Promise<Cronograma | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const existingCronograma = mockData.cronogramas[iniciativaId.toString()];
        if (!existingCronograma) return null;
        const updatedCronograma: Cronograma = {
          ...existingCronograma,
          ...cronograma,
          data_atualizacao: new Date().toISOString()
        };
        mockData.cronogramas[iniciativaId.toString()] = updatedCronograma;
        return updatedCronograma;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/cronograma`, cronograma);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cronograma:', error);
      return null;
    }
  };

  return {
    getCronograma,
    salvarCronograma,
    atualizarCronograma,
    getMarcos,
    adicionarMarco,
    atualizarMarco,
    removerMarco
  };
};

// Financeiro
export const useFinanceiro = (iniciativaId: number) => {
  const getFinanceiro = async (): Promise<Financeiro | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.financeiros[iniciativaId.toString()] || null;
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/financeiro`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar financeiro:', error);
      return null;
    }
  };

  const salvarFinanceiro = async (financeiro: Omit<Financeiro, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Financeiro | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const novoFinanceiro = {
          id: Date.now(),
          iniciativa_id: iniciativaId,
          ...financeiro,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        mockData.financeiros[iniciativaId.toString()] = novoFinanceiro;
        return novoFinanceiro;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/financeiro`, financeiro);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar financeiro:', error);
      return null;
    }
  };

  const atualizarFinanceiro = async (financeiro: Partial<Financeiro>): Promise<Financeiro | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const financeiroAtual = mockData.financeiros[iniciativaId.toString()];
        if (!financeiroAtual) return null;
        
        const financeiroAtualizado = {
          ...financeiroAtual,
          ...financeiro,
          data_atualizacao: new Date().toISOString()
        };
        mockData.financeiros[iniciativaId.toString()] = financeiroAtualizado;
        return financeiroAtualizado;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/financeiro`, financeiro);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar financeiro:', error);
      return null;
    }
  };

  const removerFinanceiro = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        delete mockData.financeiros[iniciativaId.toString()];
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/financeiro/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover financeiro:', error);
      return false;
    }
  };

  return {
    getFinanceiro,
    salvarFinanceiro,
    atualizarFinanceiro,
    removerFinanceiro
  };
};

// Contatos
export const useContatos = (iniciativaId: number) => {
  const getContatos = async (): Promise<Contato[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.contatos[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/contatos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      return [];
    }
  };

  const adicionarContato = async (contato: Omit<Contato, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Contato | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newContato: Contato = {
          ...contato,
          id: Date.now(),
          iniciativa_id: iniciativaId,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        const iniciativaKey = iniciativaId.toString();
        if (!mockData.contatos[iniciativaKey]) {
          mockData.contatos[iniciativaKey] = [];
        }
        mockData.contatos[iniciativaKey].push(newContato);
        return newContato;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/contatos`, contato);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      return null;
    }
  };

  const atualizarContato = async (id: number, contato: Partial<Contato>): Promise<Contato | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const contatos = mockData.contatos[iniciativaId.toString()] || [];
        const index = contatos.findIndex(c => c.id === id);
        if (index === -1) return null;
        const updatedContato: Contato = {
          ...contatos[index],
          ...contato,
          data_atualizacao: new Date().toISOString()
        };
        contatos[index] = updatedContato;
        return updatedContato;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/contatos/${id}`, contato);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      return null;
    }
  };

  const removerContato = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const contatos = mockData.contatos[iniciativaId.toString()] || [];
        const index = contatos.findIndex(c => c.id === id);
        if (index === -1) return false;
        contatos.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/contatos/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover contato:', error);
      return false;
    }
  };

  return {
    getContatos,
    adicionarContato,
    atualizarContato,
    removerContato
  };
};

// Ações
export const useAcoes = (iniciativaId: number) => {
  const getAcoes = async (): Promise<Acao[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.acoes[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/acoes`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
      if (import.meta.env.DEV) {
        return mockData.acoes[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarAcao = async (acao: Omit<Acao, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Acao | null> => {
    try {
      const response = await api.post(`/iniciativas/${iniciativaId}/acoes`, acao);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar ação:', error);
      return null;
    }
  };

  const atualizarAcao = async (id: number, acao: Partial<Acao>): Promise<Acao | null> => {
    try {
      const response = await api.put(`/iniciativas/${iniciativaId}/acoes/${id}`, acao);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar ação:', error);
      return null;
    }
  };

  const removerAcao = async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/iniciativas/${iniciativaId}/acoes/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover ação:', error);
      return false;
    }
  };

  return {
    getAcoes,
    adicionarAcao,
    atualizarAcao,
    removerAcao
  };
};

// Riscos
export const useRiscos = (iniciativaId: number) => {
  const getRiscos = async (): Promise<Risco[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.riscos[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/riscos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar riscos:', error);
      if (import.meta.env.DEV) {
        return mockData.riscos[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarRisco = async (risco: Omit<Risco, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Risco | null> => {
    try {
      const response = await api.post(`/iniciativas/${iniciativaId}/riscos`, risco);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar risco:', error);
      return null;
    }
  };

  const atualizarRisco = async (id: number, risco: Partial<Risco>): Promise<Risco | null> => {
    try {
      const response = await api.put(`/iniciativas/${iniciativaId}/riscos/${id}`, risco);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar risco:', error);
      return null;
    }
  };

  const removerRisco = async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/iniciativas/${iniciativaId}/riscos/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover risco:', error);
      return false;
    }
  };

  return {
    getRiscos,
    adicionarRisco,
    atualizarRisco,
    removerRisco
  };
};

// Desafios
export const useDesafios = (iniciativaId: number) => {
  const getDesafios = async (): Promise<Desafio[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.desafios[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/desafios`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar desafios:', error);
      if (import.meta.env.DEV) {
        return mockData.desafios[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarDesafio = async (desafio: Omit<Desafio, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Desafio | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newDesafio: Desafio = {
          ...desafio,
          id: Date.now(),
          iniciativa_id: iniciativaId,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        if (!mockData.desafios[iniciativaId.toString()]) {
          mockData.desafios[iniciativaId.toString()] = [];
        }
        mockData.desafios[iniciativaId.toString()].push(newDesafio);
        return newDesafio;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/desafios`, desafio);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar desafio:', error);
      return null;
    }
  };

  const atualizarDesafio = async (id: number, desafio: Partial<Desafio>): Promise<Desafio | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const desafios = mockData.desafios[iniciativaId.toString()] || [];
        const index = desafios.findIndex(d => d.id === id);
        if (index === -1) return null;
        
        const updatedDesafio = {
          ...desafios[index],
          ...desafio,
          data_atualizacao: new Date().toISOString()
        };
        desafios[index] = updatedDesafio;
        return updatedDesafio;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/desafios/${id}`, desafio);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar desafio:', error);
      return null;
    }
  };

  const removerDesafio = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const desafios = mockData.desafios[iniciativaId.toString()] || [];
        const index = desafios.findIndex(d => d.id === id);
        if (index === -1) return false;
        
        desafios.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/desafios/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover desafio:', error);
      return false;
    }
  };

  return {
    getDesafios,
    adicionarDesafio,
    atualizarDesafio,
    removerDesafio
  };
};

// Justificativas
export const useJustificativas = (iniciativaId: number) => {
  const getJustificativas = async (): Promise<Justificativa[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.justificativas[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/justificativas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar justificativas:', error);
      if (import.meta.env.DEV) {
        return mockData.justificativas[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarJustificativa = async (justificativa: Omit<Justificativa, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Justificativa | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newJustificativa: Justificativa = {
          ...justificativa,
          id: Date.now(),
          iniciativa_id: iniciativaId,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        if (!mockData.justificativas[iniciativaId.toString()]) {
          mockData.justificativas[iniciativaId.toString()] = [];
        }
        mockData.justificativas[iniciativaId.toString()].push(newJustificativa);
        return newJustificativa;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/justificativas`, justificativa);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar justificativa:', error);
      return null;
    }
  };

  const atualizarJustificativa = async (id: number, justificativa: Partial<Justificativa>): Promise<Justificativa | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const justificativas = mockData.justificativas[iniciativaId.toString()] || [];
        const index = justificativas.findIndex(j => j.id === id);
        if (index === -1) return null;
        
        const updatedJustificativa = {
          ...justificativas[index],
          ...justificativa,
          data_atualizacao: new Date().toISOString()
        };
        justificativas[index] = updatedJustificativa;
        return updatedJustificativa;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/justificativas/${id}`, justificativa);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar justificativa:', error);
      return null;
    }
  };

  const removerJustificativa = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const justificativas = mockData.justificativas[iniciativaId.toString()] || [];
        const index = justificativas.findIndex(j => j.id === id);
        if (index === -1) return false;
        
        justificativas.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/justificativas/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover justificativa:', error);
      return false;
    }
  };

  return {
    getJustificativas,
    adicionarJustificativa,
    atualizarJustificativa,
    removerJustificativa
  };
};

// Resultados
export const useResultados = (iniciativaId: number) => {
  const getResultados = async (): Promise<Resultado[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.resultados[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/resultados`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      if (import.meta.env.DEV) {
        return mockData.resultados[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarResultado = async (resultado: Omit<Resultado, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Resultado | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const newResultado: Resultado = {
          ...resultado,
          id: Date.now(),
          iniciativa_id: iniciativaId,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        if (!mockData.resultados[iniciativaId.toString()]) {
          mockData.resultados[iniciativaId.toString()] = [];
        }
        mockData.resultados[iniciativaId.toString()].push(newResultado);
        return newResultado;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/resultados`, resultado);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar resultado:', error);
      return null;
    }
  };

  const atualizarResultado = async (id: number, resultado: Partial<Resultado>): Promise<Resultado | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const resultados = mockData.resultados[iniciativaId.toString()] || [];
        const index = resultados.findIndex(r => r.id === id);
        if (index === -1) return null;
        
        const updatedResultado = {
          ...resultados[index],
          ...resultado,
          data_atualizacao: new Date().toISOString()
        };
        resultados[index] = updatedResultado;
        return updatedResultado;
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/resultados/${id}`, resultado);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar resultado:', error);
      return null;
    }
  };

  const removerResultado = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const resultados = mockData.resultados[iniciativaId.toString()] || [];
        const index = resultados.findIndex(r => r.id === id);
        if (index === -1) return false;
        
        resultados.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/resultados/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover resultado:', error);
      return false;
    }
  };

  return {
    getResultados,
    adicionarResultado,
    atualizarResultado,
    removerResultado
  };
};

// Anexos
export const useAnexos = (iniciativaId: number) => {
  const getAnexos = async (): Promise<Anexo[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.anexos[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/anexos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      if (import.meta.env.DEV) {
        return mockData.anexos[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarAnexo = async (formData: FormData): Promise<Anexo | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const arquivo = formData.get('arquivo') as File;
        const nome_anexo = formData.get('nome_anexo') as string;
        
        const newAnexo: Anexo = {
          id: Date.now(),
          iniciativa_id: iniciativaId,
          nome_anexo,
          nome_arquivo: arquivo.name,
          caminho_arquivo: URL.createObjectURL(arquivo),
          tipo_arquivo: arquivo.type,
          tamanho_arquivo: arquivo.size,
          usuario_upload_id: 1, // Mock user ID
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        
        if (!mockData.anexos[iniciativaId.toString()]) {
          mockData.anexos[iniciativaId.toString()] = [];
        }
        mockData.anexos[iniciativaId.toString()].push(newAnexo);
        return newAnexo;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/anexos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar anexo:', error);
      return null;
    }
  };

  const removerAnexo = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const anexos = mockData.anexos[iniciativaId.toString()] || [];
        const index = anexos.findIndex(a => a.id === id);
        if (index === -1) return false;
        
        anexos.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/anexos/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover anexo:', error);
      return false;
    }
  };

  return {
    getAnexos,
    adicionarAnexo,
    removerAnexo
  };
};

// Órgãos Envolvidos
export const useOrgaosEnvolvidos = (iniciativaId: number) => {
  const getOrgaosEnvolvidos = async (): Promise<OrgaoEnvolvido[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.orgaos_envolvidos[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/orgaos-envolvidos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar órgãos envolvidos:', error);
      if (import.meta.env.DEV) {
        return mockData.orgaos_envolvidos[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarOrgaoEnvolvido = async (orgao: Omit<OrgaoEnvolvido, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<OrgaoEnvolvido | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const novoOrgao: OrgaoEnvolvido = {
          id: Date.now(),
          iniciativa_id: iniciativaId,
          ...orgao,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        
        if (!mockData.orgaos_envolvidos[iniciativaId.toString()]) {
          mockData.orgaos_envolvidos[iniciativaId.toString()] = [];
        }
        mockData.orgaos_envolvidos[iniciativaId.toString()].push(novoOrgao);
        return novoOrgao;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/orgaos-envolvidos`, orgao);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar órgão envolvido:', error);
      return null;
    }
  };

  const atualizarOrgaoEnvolvido = async (id: number, orgao: Partial<OrgaoEnvolvido>): Promise<OrgaoEnvolvido | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const orgaos = mockData.orgaos_envolvidos[iniciativaId.toString()] || [];
        const index = orgaos.findIndex(o => o.id === id);
        if (index === -1) return null;
        
        orgaos[index] = {
          ...orgaos[index],
          ...orgao,
          data_atualizacao: new Date().toISOString()
        };
        return orgaos[index];
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/orgaos-envolvidos/${id}`, orgao);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar órgão envolvido:', error);
      return null;
    }
  };

  const removerOrgaoEnvolvido = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const orgaos = mockData.orgaos_envolvidos[iniciativaId.toString()] || [];
        const index = orgaos.findIndex(o => o.id === id);
        if (index === -1) return false;
        
        orgaos.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/orgaos-envolvidos/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover órgão envolvido:', error);
      return false;
    }
  };

  return {
    getOrgaosEnvolvidos,
    adicionarOrgaoEnvolvido,
    atualizarOrgaoEnvolvido,
    removerOrgaoEnvolvido
  };
};

// Prêmios
export const usePremios = (iniciativaId: number) => {
  const getPremios = async (): Promise<Premio[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.premios[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/premios`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prêmios:', error);
      if (import.meta.env.DEV) {
        return mockData.premios[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarPremio = async (premio: Omit<Premio, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Premio | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const novoPremio: Premio = {
          id: Date.now(),
          iniciativa_id: iniciativaId,
          ...premio,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        
        if (!mockData.premios[iniciativaId.toString()]) {
          mockData.premios[iniciativaId.toString()] = [];
        }
        mockData.premios[iniciativaId.toString()].push(novoPremio);
        return novoPremio;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/premios`, premio);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar prêmio:', error);
      return null;
    }
  };

  const atualizarPremio = async (id: number, premio: Partial<Premio>): Promise<Premio | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const premios = mockData.premios[iniciativaId.toString()] || [];
        const index = premios.findIndex(p => p.id === id);
        if (index === -1) return null;
        
        premios[index] = {
          ...premios[index],
          ...premio,
          data_atualizacao: new Date().toISOString()
        };
        return premios[index];
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/premios/${id}`, premio);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar prêmio:', error);
      return null;
    }
  };

  const removerPremio = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const premios = mockData.premios[iniciativaId.toString()] || [];
        const index = premios.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        premios.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/premios/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover prêmio:', error);
      return false;
    }
  };

  return {
    getPremios,
    adicionarPremio,
    atualizarPremio,
    removerPremio
  };
};

// Publicidades
export const usePublicidades = (iniciativaId: number) => {
  const getPublicidades = async (): Promise<Publicidade[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockData.publicidades[iniciativaId.toString()] || [];
      }
      const response = await api.get(`/iniciativas/${iniciativaId}/publicidades`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar publicidades:', error);
      if (import.meta.env.DEV) {
        return mockData.publicidades[iniciativaId.toString()] || [];
      }
      return [];
    }
  };

  const adicionarPublicidade = async (publicidade: Omit<Publicidade, 'id' | 'iniciativa_id' | 'data_criacao' | 'data_atualizacao'>): Promise<Publicidade | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const novaPublicidade: Publicidade = {
          id: Date.now(),
          iniciativa_id: iniciativaId,
          ...publicidade,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        };
        
        if (!mockData.publicidades[iniciativaId.toString()]) {
          mockData.publicidades[iniciativaId.toString()] = [];
        }
        mockData.publicidades[iniciativaId.toString()].push(novaPublicidade);
        return novaPublicidade;
      }
      const response = await api.post(`/iniciativas/${iniciativaId}/publicidades`, publicidade);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar publicidade:', error);
      return null;
    }
  };

  const atualizarPublicidade = async (id: number, publicidade: Partial<Publicidade>): Promise<Publicidade | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const publicidades = mockData.publicidades[iniciativaId.toString()] || [];
        const index = publicidades.findIndex(p => p.id === id);
        if (index === -1) return null;
        
        publicidades[index] = {
          ...publicidades[index],
          ...publicidade,
          data_atualizacao: new Date().toISOString()
        };
        return publicidades[index];
      }
      const response = await api.put(`/iniciativas/${iniciativaId}/publicidades/${id}`, publicidade);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar publicidade:', error);
      return null;
    }
  };

  const removerPublicidade = async (id: number): Promise<boolean> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        const publicidades = mockData.publicidades[iniciativaId.toString()] || [];
        const index = publicidades.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        publicidades.splice(index, 1);
        return true;
      }
      await api.delete(`/iniciativas/${iniciativaId}/publicidades/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover publicidade:', error);
      return false;
    }
  };

  return {
    getPublicidades,
    adicionarPublicidade,
    atualizarPublicidade,
    removerPublicidade
  };
}; 