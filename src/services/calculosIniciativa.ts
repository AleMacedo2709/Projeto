import type { Iniciativa, Cronograma, Financeiro, Acao, Risco } from '../types/iniciativas';

// Cálculo do percentual de conclusão baseado em ações
export const calcularPercentualConclusao = (acoes: Acao[]): number => {
  if (!acoes.length) return 0;
  
  const acoesConcluidas = acoes.filter(acao => acao.status_acao === 'concluido').length;
  return Math.round((acoesConcluidas / acoes.length) * 100);
};

// Cálculo de atraso no cronograma
export const calcularAtraso = (cronograma: Cronograma): number => {
  if (!cronograma.data_fim_planejada) return 0;
  
  const dataFimPlanejada = new Date(cronograma.data_fim_planejada);
  const hoje = new Date();
  
  if (cronograma.data_fim_real) {
    const dataFimReal = new Date(cronograma.data_fim_real);
    const diffDias = Math.ceil((dataFimReal.getTime() - dataFimPlanejada.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDias);
  }
  
  if (hoje > dataFimPlanejada) {
    return Math.ceil((hoje.getTime() - dataFimPlanejada.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  return 0;
};

// Cálculo de economia financeira
export const calcularEconomia = (financeiro: Financeiro): number => {
  if (!financeiro.custo_planejado || !financeiro.custo_real) return 0;
  return financeiro.custo_planejado - financeiro.custo_real;
};

// Cálculo do nível de risco geral
export interface NivelRisco {
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  pontuacao: number;
}

export const calcularNivelRisco = (riscos: Risco[]): NivelRisco => {
  if (!riscos.length) return { nivel: 'baixo', pontuacao: 0 };

  const pontuacaoProbabilidade = {
    'raro': 1,
    'baixa': 2,
    'media': 3,
    'alta': 4,
    'quase_certo': 5
  };

  const pontuacaoImpacto = {
    'sem_impacto': 1,
    'leve': 2,
    'grave': 3,
    'gravissimo': 4
  };

  const pontuacaoTotal = riscos.reduce((acc, risco) => {
    const probPontos = pontuacaoProbabilidade[risco.probabilidade];
    const impactoPontos = pontuacaoImpacto[risco.impacto];
    return acc + (probPontos * impactoPontos);
  }, 0);

  const pontuacaoMedia = pontuacaoTotal / riscos.length;

  if (pontuacaoMedia <= 4) return { nivel: 'baixo', pontuacao: pontuacaoMedia };
  if (pontuacaoMedia <= 8) return { nivel: 'medio', pontuacao: pontuacaoMedia };
  if (pontuacaoMedia <= 12) return { nivel: 'alto', pontuacao: pontuacaoMedia };
  return { nivel: 'critico', pontuacao: pontuacaoMedia };
};

// Cálculo de indicadores gerais da iniciativa
export interface IndicadoresIniciativa {
  percentualConclusao: number;
  diasAtraso: number;
  economia: number;
  nivelRisco: NivelRisco;
  status: 'em_dia' | 'atrasado' | 'critico';
}

export const calcularIndicadores = (
  iniciativa: Iniciativa,
  acoes: Acao[],
  cronograma: Cronograma | null,
  financeiro: Financeiro | null,
  riscos: Risco[]
): IndicadoresIniciativa => {
  const percentualConclusao = calcularPercentualConclusao(acoes);
  const diasAtraso = cronograma ? calcularAtraso(cronograma) : 0;
  const economia = financeiro ? calcularEconomia(financeiro) : 0;
  const nivelRisco = calcularNivelRisco(riscos);

  let status: 'em_dia' | 'atrasado' | 'critico' = 'em_dia';
  if (diasAtraso > 30 || nivelRisco.nivel === 'critico') {
    status = 'critico';
  } else if (diasAtraso > 0 || nivelRisco.nivel === 'alto') {
    status = 'atrasado';
  }

  return {
    percentualConclusao,
    diasAtraso,
    economia,
    nivelRisco,
    status
  };
}; 