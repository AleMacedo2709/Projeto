import type { Iniciativa } from '../types/iniciativas';

export interface Atividade {
  id: number;
  tipo: 'aprovacao' | 'documento' | 'comentario' | 'cronograma' | 'risco' | 'equipe' | 'financeiro' | 'geral';
  descricao: string;
  usuario: string;
  data: string;
  iniciativa_id: number;
}

// Mock data for development
const mockAtividades: Atividade[] = [
  {
    id: 1,
    tipo: 'aprovacao',
    descricao: 'Iniciativa aprovada',
    usuario: 'João Silva',
    data: '2024-03-20T10:30:00',
    iniciativa_id: 1
  },
  {
    id: 2,
    tipo: 'documento',
    descricao: 'Novo documento anexado: Plano de Trabalho',
    usuario: 'Maria Santos',
    data: '2024-03-19T15:45:00',
    iniciativa_id: 1
  },
  {
    id: 3,
    tipo: 'comentario',
    descricao: 'Comentário adicionado na seção de riscos',
    usuario: 'Pedro Costa',
    data: '2024-03-18T09:15:00',
    iniciativa_id: 1
  },
  {
    id: 4,
    tipo: 'cronograma',
    descricao: 'Cronograma atualizado: nova data de conclusão',
    usuario: 'Ana Oliveira',
    data: '2024-03-17T14:20:00',
    iniciativa_id: 1
  },
  {
    id: 5,
    tipo: 'risco',
    descricao: 'Novo risco identificado: Atraso na entrega',
    usuario: 'Carlos Souza',
    data: '2024-03-16T11:00:00',
    iniciativa_id: 1
  }
];

export const getAtividadesIniciativa = async (iniciativaId: number): Promise<Atividade[]> => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock delay
      return mockAtividades.filter(a => a.iniciativa_id === iniciativaId);
    }

    const response = await fetch(`/api/iniciativas/${iniciativaId}/atividades`);
    if (!response.ok) {
      throw new Error('Erro ao carregar atividades');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    return [];
  }
};

export const registrarAtividade = async (
  iniciativaId: number,
  tipo: Atividade['tipo'],
  descricao: string,
  usuario: string
): Promise<Atividade | null> => {
  const novaAtividade: Omit<Atividade, 'id'> = {
    tipo,
    descricao,
    usuario,
    data: new Date().toISOString(),
    iniciativa_id: iniciativaId
  };

  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock delay
      const mockAtividade: Atividade = {
        ...novaAtividade,
        id: Math.max(...mockAtividades.map(a => a.id)) + 1
      };
      mockAtividades.unshift(mockAtividade);
      return mockAtividade;
    }

    const response = await fetch(`/api/iniciativas/${iniciativaId}/atividades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaAtividade)
    });

    if (!response.ok) {
      throw new Error('Erro ao registrar atividade');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    return null;
  }
}; 