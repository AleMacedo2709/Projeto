import type { ValidationResult, Iniciativa, Cronograma, Financeiro, Acao } from '../types/iniciativas';

// Validação de datas
export const validarDatas = (inicio: string, fim: string): ValidationResult => {
  const errors: string[] = [];
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  if (isNaN(dataInicio.getTime())) {
    errors.push('Data de início inválida');
  }
  if (isNaN(dataFim.getTime())) {
    errors.push('Data de fim inválida');
  }
  if (dataFim <= dataInicio) {
    errors.push('Data de fim deve ser posterior à data de início');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de valores financeiros
export const validarValoresFinanceiros = (valor: number | null): ValidationResult => {
  const errors: string[] = [];

  if (valor !== null && valor < 0) {
    errors.push('Valor financeiro não pode ser negativo');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de dependências entre ações
export const validarDependenciasAcoes = (acao: Acao, acoesAnteriores: Acao[]): ValidationResult => {
  const errors: string[] = [];

  // Verifica se as ações anteriores estão concluídas
  for (const acaoAnterior of acoesAnteriores) {
    if (acaoAnterior.status_acao !== 'concluido') {
      errors.push(`Ação dependente "${acaoAnterior.nome_acao}" não está concluída`);
    }
  }

  // Verifica se as datas são consistentes com as dependências
  if (acao.data_inicio_planejada && acoesAnteriores.length > 0) {
    const dataInicioAcao = new Date(acao.data_inicio_planejada);
    for (const acaoAnterior of acoesAnteriores) {
      if (acaoAnterior.data_fim_planejada) {
        const dataFimAnterior = new Date(acaoAnterior.data_fim_planejada);
        if (dataInicioAcao < dataFimAnterior) {
          errors.push(`Data de início deve ser posterior à conclusão da ação "${acaoAnterior.nome_acao}"`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de status de aprovação
export const validarStatusAprovacao = (iniciativa: Iniciativa): ValidationResult => {
  const errors: string[] = [];

  if (iniciativa.status_aprovacao === 'aprovado') {
    if (!iniciativa.data_ultima_avaliacao) {
      errors.push('Iniciativa aprovada deve ter data de avaliação');
    }
  }

  if (iniciativa.status_aprovacao === 'devolvido' && !iniciativa.data_ultima_avaliacao) {
    errors.push('Iniciativa devolvida deve ter data de avaliação');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação completa de iniciativa
export const validarIniciativa = (iniciativa: Iniciativa): ValidationResult => {
  const errors: string[] = [];

  // Validações básicas
  if (!iniciativa.nome_iniciativa.trim()) {
    errors.push('Nome da iniciativa é obrigatório');
  }
  if (!iniciativa.descricao_iniciativa.trim()) {
    errors.push('Descrição da iniciativa é obrigatória');
  }
  if (!iniciativa.unidade_gestora_id) {
    errors.push('Unidade gestora é obrigatória');
  }

  // Validações específicas por tipo
  if (iniciativa.tipo_iniciativa === 'projeto' || iniciativa.tipo_iniciativa === 'programa') {
    if (!iniciativa.selo_id) {
      errors.push('Selo é obrigatório para projetos e programas');
    }
  }

  // Validações de datas
  if (iniciativa.data_ultima_atualizacao) {
    const dataAtualizacao = new Date(iniciativa.data_ultima_atualizacao);
    if (isNaN(dataAtualizacao.getTime())) {
      errors.push('Data de última atualização inválida');
    }
  }

  // Validações de percentual
  if (iniciativa.percentual_conclusao < 0 || iniciativa.percentual_conclusao > 100) {
    errors.push('Percentual de conclusão deve estar entre 0 e 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de cronograma
export const validarCronograma = (cronograma: Cronograma): ValidationResult => {
  const errors: string[] = [];

  // Validar datas planejadas
  const validacaoDatas = validarDatas(cronograma.data_inicio_planejada, cronograma.data_fim_planejada);
  errors.push(...validacaoDatas.errors);

  // Validar datas reais se existirem
  if (cronograma.data_inicio_real && cronograma.data_fim_real) {
    const validacaoDatasReais = validarDatas(cronograma.data_inicio_real, cronograma.data_fim_real);
    errors.push(...validacaoDatasReais.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de financeiro
export const validarFinanceiro = (financeiro: Financeiro): ValidationResult => {
  const errors: string[] = [];

  // Validar custos
  if (financeiro.custo_planejado !== null) {
    const validacaoCustoPlanejado = validarValoresFinanceiros(financeiro.custo_planejado);
    errors.push(...validacaoCustoPlanejado.errors);
  }

  if (financeiro.custo_real !== null) {
    const validacaoCustoReal = validarValoresFinanceiros(financeiro.custo_real);
    errors.push(...validacaoCustoReal.errors);
  }

  if (financeiro.economia !== null) {
    const validacaoEconomia = validarValoresFinanceiros(financeiro.economia);
    errors.push(...validacaoEconomia.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 