import type { Iniciativa, Acao, Financeiro, Risco } from '../types/iniciativas';

export interface MetricasUnidade {
  total_iniciativas: number;
  percentual_conclusao_medio: number;
  economia_total: number;
  nivel_risco_medio: number;
  iniciativas_atrasadas: number;
  desempenho_geral: number;
}

export interface MetricasPrograma {
  total_iniciativas: number;
  percentual_conclusao_medio: number;
  orcamento_total: number;
  economia_total: number;
  nivel_risco_medio: number;
  desempenho_geral: number;
}

export interface Tendencia {
  valor_atual: number;
  valor_projetado: number;
  variacao_percentual: number;
  tendencia: 'crescente' | 'estavel' | 'decrescente';
}

// Cálculo de métricas por unidade gestora
export const calcularMetricasUnidade = (iniciativas: Iniciativa[]): MetricasUnidade => {
  if (!iniciativas.length) {
    return {
      total_iniciativas: 0,
      percentual_conclusao_medio: 0,
      economia_total: 0,
      nivel_risco_medio: 0,
      iniciativas_atrasadas: 0,
      desempenho_geral: 0
    };
  }

  const total_iniciativas = iniciativas.length;
  const percentual_conclusao_medio = iniciativas.reduce((acc, ini) => acc + ini.percentual_conclusao, 0) / total_iniciativas;
  const iniciativas_atrasadas = iniciativas.filter(ini => {
    const dataLimite = new Date(ini.data_ultima_avaliacao || '');
    return dataLimite < new Date() && ini.percentual_conclusao < 100;
  }).length;

  // Cálculo do desempenho geral (0-100)
  const desempenho_geral = Math.round(
    (percentual_conclusao_medio * 0.4) + 
    ((1 - iniciativas_atrasadas/total_iniciativas) * 100 * 0.6)
  );

  return {
    total_iniciativas,
    percentual_conclusao_medio,
    economia_total: 0, // Será calculado com dados financeiros
    nivel_risco_medio: 0, // Será calculado com dados de risco
    iniciativas_atrasadas,
    desempenho_geral
  };
};

// Cálculo de métricas por programa
export const calcularMetricasPrograma = (iniciativas: Iniciativa[]): MetricasPrograma => {
  if (!iniciativas.length) {
    return {
      total_iniciativas: 0,
      percentual_conclusao_medio: 0,
      orcamento_total: 0,
      economia_total: 0,
      nivel_risco_medio: 0,
      desempenho_geral: 0
    };
  }

  const total_iniciativas = iniciativas.length;
  const percentual_conclusao_medio = iniciativas.reduce((acc, ini) => acc + ini.percentual_conclusao, 0) / total_iniciativas;

  // Cálculo do desempenho geral (0-100)
  const desempenho_geral = Math.round(percentual_conclusao_medio);

  return {
    total_iniciativas,
    percentual_conclusao_medio,
    orcamento_total: 0, // Será calculado com dados financeiros
    economia_total: 0, // Será calculado com dados financeiros
    nivel_risco_medio: 0, // Será calculado com dados de risco
    desempenho_geral
  };
};

// Cálculo de tendências
export const calcularTendencia = (
  valoresHistoricos: number[],
  periodoProjecao: number = 3
): Tendencia => {
  if (valoresHistoricos.length < 2) {
    return {
      valor_atual: valoresHistoricos[0] || 0,
      valor_projetado: valoresHistoricos[0] || 0,
      variacao_percentual: 0,
      tendencia: 'estavel'
    };
  }

  // Cálculo de tendência linear simples
  const n = valoresHistoricos.length;
  const x = Array.from({length: n}, (_, i) => i);
  const y = valoresHistoricos;

  // Cálculo dos coeficientes da regressão linear (y = mx + b)
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumXX = x.reduce((a, b) => a + b * b, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  // Projeção
  const valor_atual = valoresHistoricos[valoresHistoricos.length - 1];
  const valor_projetado = m * (n + periodoProjecao) + b;
  const variacao_percentual = ((valor_projetado - valor_atual) / valor_atual) * 100;

  return {
    valor_atual,
    valor_projetado,
    variacao_percentual,
    tendencia: variacao_percentual > 1 ? 'crescente' : 
               variacao_percentual < -1 ? 'decrescente' : 
               'estavel'
  };
};

// Cálculo de projeções financeiras
export const calcularProjecaoFinanceira = (
  financeiro: Financeiro,
  percentualConclusao: number
): number => {
  if (!financeiro.custo_planejado) return 0;
  if (percentualConclusao === 0) return financeiro.custo_planejado;

  const custoRealAtual = financeiro.custo_real || 0;
  const projecaoCustoTotal = (custoRealAtual / percentualConclusao) * 100;

  return Math.round(projecaoCustoTotal * 100) / 100;
}; 