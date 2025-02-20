interface Anexo {
  id: number;
  nome: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  usuario: string;
  iniciativa_id: number;
  url: string;
}

// Mock data for development
const mockAnexos: Anexo[] = [
  {
    id: 1,
    nome: 'Plano de Trabalho.pdf',
    tipo: 'application/pdf',
    tamanho: 2500000,
    data_upload: '2024-03-20T10:30:00',
    usuario: 'João Silva',
    iniciativa_id: 1,
    url: '/mock/plano-trabalho.pdf'
  },
  {
    id: 2,
    nome: 'Cronograma Detalhado.xlsx',
    tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    tamanho: 1500000,
    data_upload: '2024-03-19T15:45:00',
    usuario: 'Maria Santos',
    iniciativa_id: 1,
    url: '/mock/cronograma.xlsx'
  }
];

export const getAnexosIniciativa = async (iniciativaId: number): Promise<Anexo[]> => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAnexos.filter(a => a.iniciativa_id === iniciativaId);
    }

    const response = await fetch(`/api/iniciativas/${iniciativaId}/anexos`);
    if (!response.ok) {
      throw new Error('Erro ao carregar anexos');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar anexos:', error);
    return [];
  }
};

export const uploadAnexo = async (
  iniciativaId: number,
  arquivo: File
): Promise<Anexo | null> => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAnexo: Anexo = {
        id: Math.max(...mockAnexos.map(a => a.id)) + 1,
        nome: arquivo.name,
        tipo: arquivo.type,
        tamanho: arquivo.size,
        data_upload: new Date().toISOString(),
        usuario: 'Usuário Atual',
        iniciativa_id: iniciativaId,
        url: `/mock/${arquivo.name}`
      };
      mockAnexos.push(mockAnexo);
      return mockAnexo;
    }

    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const response = await fetch(`/api/iniciativas/${iniciativaId}/anexos`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload do anexo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao fazer upload do anexo:', error);
    return null;
  }
};

export const downloadAnexo = async (anexo: Anexo): Promise<void> => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate download in development
      const link = document.createElement('a');
      link.href = anexo.url;
      link.download = anexo.nome;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    const response = await fetch(anexo.url);
    if (!response.ok) {
      throw new Error('Erro ao baixar anexo');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = anexo.nome;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar anexo:', error);
    throw error;
  }
};

export const excluirAnexo = async (anexoId: number): Promise<boolean> => {
  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockAnexos.findIndex(a => a.id === anexoId);
      if (index !== -1) {
        mockAnexos.splice(index, 1);
      }
      return true;
    }

    const response = await fetch(`/api/iniciativas/anexos/${anexoId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir anexo');
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir anexo:', error);
    return false;
  }
};

export const formatarTamanhoArquivo = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}; 