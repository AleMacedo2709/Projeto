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
  Publicidade
} from '../types/iniciativas';

export const mockRelacionamentos = {
  cronogramas: {
    '1': {
      id: 1,
      iniciativa_id: 1,
      data_inicio_planejada: '2024-01-01',
      data_fim_planejada: '2024-12-31',
      data_inicio_real: '2024-01-15',
      data_fim_real: null,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  },
  marcos: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        tipo_marco: 'inicio',
        status_marco: 'concluido',
        descricao_marco: 'Início do Projeto',
        data_prevista: '2024-01-01',
        data_conclusao: '2024-01-15',
        observacoes: 'Projeto iniciado com sucesso',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-15T00:00:00'
      },
      {
        id: 2,
        iniciativa_id: 1,
        tipo_marco: 'planejamento',
        status_marco: 'em_andamento',
        descricao_marco: 'Planejamento das Atividades',
        data_prevista: '2024-02-01',
        data_conclusao: null,
        observacoes: 'Em fase de definição do escopo',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  financeiros: {
    '1': {
      id: 1,
      iniciativa_id: 1,
      custo_planejado: 100000.00,
      custo_real: 85000.00,
      economia: 15000.00,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  },
  contatos: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        usuario_id: 1,
        tipo_papel: 'gerente_projeto',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        iniciativa_id: 1,
        usuario_id: 2,
        tipo_papel: 'equipe',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  acoes: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        nome_acao: 'Levantamento de Requisitos',
        unidade_responsavel: 'DTI',
        usuario_responsavel_id: 1,
        data_inicio_planejada: '2024-01-15',
        data_fim_planejada: '2024-02-15',
        data_inicio_real: '2024-01-20',
        data_fim_real: '2024-02-10',
        status_acao: 'concluido',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-02-10T00:00:00'
      }
    ]
  },
  riscos: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        tipo_risco_id: 1,
        descricao_risco: 'Atraso na entrega por dependências externas',
        probabilidade: 'media',
        impacto: 'grave',
        acao_mitigacao: 'Estabelecer comunicação prévia com fornecedores',
        usuario_responsavel_id: 1,
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  desafios: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        descricao_desafio: 'Integração com sistemas legados',
        status_desafio: 'pendente',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  justificativas: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        tipo_justificativa: 'resolutividade',
        descricao_justificativa: 'Contribuição decisiva para prevenir conflitos',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        iniciativa_id: 1,
        tipo_justificativa: 'inovacao',
        descricao_justificativa: 'Implementação de nova tecnologia',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      },
      {
        id: 3,
        iniciativa_id: 1,
        tipo_justificativa: 'transparencia',
        descricao_justificativa: 'Maior transparência nos processos',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      },
      {
        id: 4,
        iniciativa_id: 1,
        tipo_justificativa: 'proatividade',
        descricao_justificativa: 'Antecipação de problemas',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      },
      {
        id: 5,
        iniciativa_id: 1,
        tipo_justificativa: 'cooperacao',
        descricao_justificativa: 'Atuação colaborativa',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  resultados: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        tipo_resultado: 'quantitativo',
        status_resultado: 'alcancado',
        descricao_resultado: 'Aumento de 30% na eficiência do processo',
        indicador_medicao: 'Percentual de redução no tempo de processamento',
        meta: '30%',
        valor_alcancado: '32%',
        data_medicao: '2024-03-15',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-03-15T00:00:00'
      },
      {
        id: 2,
        iniciativa_id: 1,
        tipo_resultado: 'qualitativo',
        status_resultado: 'parcialmente_alcancado',
        descricao_resultado: 'Melhoria na satisfação dos usuários',
        indicador_medicao: 'Avaliação de satisfação dos usuários',
        meta: '4.5/5.0',
        valor_alcancado: '4.2/5.0',
        data_medicao: '2024-03-10',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-03-10T00:00:00'
      }
    ]
  },
  anexos: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        nome_anexo: 'Documento de Requisitos',
        nome_arquivo: 'requisitos.pdf',
        caminho_arquivo: '/uploads/requisitos.pdf',
        tipo_arquivo: 'application/pdf',
        tamanho_arquivo: 1024576,
        usuario_upload_id: 1,
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  orgaos_envolvidos: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        nome_orgao: 'Secretaria de Tecnologia',
        papel_orgao: 'Parceiro Técnico',
        nome_contato: 'Ana Silva',
        email_contato: 'ana.silva@orgao.gov.br',
        obrigatorio: true,
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  premios: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        nome_instituicao: 'CNMP',
        tipo_classificacao: 'Primeiro Lugar',
        ano_premio: '2024',
        descricao_premio: 'Prêmio de Inovação',
        data_criacao: '2024-01-01T00:00:00',
        data_atualizacao: '2024-01-01T00:00:00'
      }
    ]
  },
  publicidades: {
    '1': [
      {
        id: 1,
        iniciativa_id: 1,
        nome_ferramenta: 'Portal MPSP',
        publico_alvo: 'Público em geral',
        frequencia: 'mensal',
        usuario_responsavel_id: 1,
        data_publicacao: '2024-03-15',
        data_criacao: '2024-03-01T10:00:00',
        data_atualizacao: '2024-03-01T10:00:00'
      }
    ]
  }
}; 