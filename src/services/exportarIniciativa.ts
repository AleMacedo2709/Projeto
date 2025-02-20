import type { Iniciativa } from '../types/iniciativas';
import type { IndicadoresIniciativa } from './calculosIniciativa';
import { calcularIndicadoresIniciativa } from './calculosIniciativa';

interface DadosExportacao {
  iniciativa: Iniciativa;
  indicadores: IndicadoresIniciativa;
  dataExportacao: string;
}

export const exportarParaPDF = async (iniciativa: Iniciativa): Promise<Blob | null> => {
  try {
    if (import.meta.env.DEV) {
      // Mock PDF generation in development
      await new Promise(resolve => setTimeout(resolve, 1000));
      return new Blob(['Mock PDF data'], { type: 'application/pdf' });
    }

    const response = await fetch(`/api/iniciativas/${iniciativa.id}/export/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prepararDadosExportacao(iniciativa))
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    return null;
  }
};

export const exportarParaExcel = async (iniciativa: Iniciativa): Promise<Blob | null> => {
  try {
    if (import.meta.env.DEV) {
      // Mock Excel generation in development
      await new Promise(resolve => setTimeout(resolve, 1000));
      return new Blob(['Mock Excel data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    const response = await fetch(`/api/iniciativas/${iniciativa.id}/export/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prepararDadosExportacao(iniciativa))
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar Excel');
    }

    return await response.blob();
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    return null;
  }
};

const prepararDadosExportacao = (iniciativa: Iniciativa): DadosExportacao => {
  return {
    iniciativa,
    indicadores: calcularIndicadoresIniciativa(iniciativa),
    dataExportacao: new Date().toISOString()
  };
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}; 