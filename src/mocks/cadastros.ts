export const mockCadastros = {
  unidades_gestoras: [
    {
      id: 1,
      nome_unidade: 'SUBPROCURADORIA-GERAL DE JUSTIÇA JURÍDICA',
      sigla_unidade: 'SPGJ',
      tipo_unidade: 'meio',
      ativa: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_unidade: 'PROMOTORIA DE JUSTIÇA',
      sigla_unidade: 'PJ',
      tipo_unidade: 'fim',
      ativa: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 3,
      nome_unidade: 'DEPARTAMENTO DE TECNOLOGIA DA INFORMAÇÃO',
      sigla_unidade: 'DTI',
      tipo_unidade: 'meio',
      ativa: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  usuarios: [
    {
      id: 1,
      nome_usuario: 'João Silva',
      email_usuario: 'joao.silva@mpsp.mp.br',
      cargo_usuario: 'Promotor de Justiça',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_usuario: 'Maria Santos',
      email_usuario: 'maria.santos@mpsp.mp.br',
      cargo_usuario: 'Procuradora de Justiça',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  programas: [
    {
      id: 1,
      nome_programa: 'Programa de Excelência',
      descricao_programa: 'Programa para melhoria contínua dos serviços',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_programa: 'Programa de Inovação',
      descricao_programa: 'Programa para fomento à inovação institucional',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  objetivos_estrategicos: [
    {
      id: 1,
      nome_objetivo: 'Modernização Tecnológica',
      descricao_objetivo: 'Modernizar a infraestrutura tecnológica da instituição',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_objetivo: 'Eficiência Operacional',
      descricao_objetivo: 'Otimizar processos e recursos para maior eficiência',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  selos: [
    {
      id: 1,
      nome_selo: 'PGJ',
      descricao_selo: 'Selo da Procuradoria-Geral de Justiça',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_selo: 'CG Cidadã',
      descricao_selo: 'Selo da Corregedoria-Geral',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  tipos_risco: [
    {
      id: 1,
      nome_tipo: 'Cronograma',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_tipo: 'Escopo',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 3,
      nome_tipo: 'Financeiro',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  papeis_equipe: [
    {
      id: 1,
      nome_papel: 'Cadastrador',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_papel: 'Autor',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 3,
      nome_papel: 'Equipe',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  gestores_sistema: [
    {
      id: 1,
      usuario_id: 1,
      ativo: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  niveis_acesso_gestor: [
    {
      id: 1,
      gestor_id: 1,
      nivel_acesso: 'admin',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      gestor_id: 1,
      nivel_acesso: 'gestor_cadastros',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ],
  configuracoes_sistema: {
    id: 1,
    email_gestor: 'cge@mpsp.mp.br',
    email_aprovador: 'cgmptec2@mpsp.mp.br',
    data_criacao: '2024-01-01T00:00:00',
    data_atualizacao: '2024-01-01T00:00:00'
  }
}; 