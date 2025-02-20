import type { UnidadeGestora, Programa, ObjetivoEstrategico, Selo, TipoRisco, PapelEquipe, Usuario, Gestor } from '../types/iniciativas';

// Export the mock data as a named export
export const mockData = {
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
      cargo_usuario: 'Analista Jurídico',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as Usuario[],

  gestores: [
    {
      id: 1,
      usuario_id: 1,
      niveis_acesso: ['admin'],
      ativo: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      usuario_id: 2,
      niveis_acesso: ['gestor_cadastros'],
      ativo: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as Gestor[],

  unidades_gestoras: [
    {
      id: 1,
      nome_unidade: 'Subprocuradoria-Geral de Justiça',
      sigla_unidade: 'SPGJ',
      tipo_unidade: 'meio',
      ativa: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_unidade: 'Promotoria de Justiça Criminal',
      sigla_unidade: 'PJCrim',
      tipo_unidade: 'fim',
      ativa: true,
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as UnidadeGestora[],

  programas: [
    {
      id: 1,
      nome_programa: 'Programa de Modernização',
      descricao_programa: 'Modernização dos processos e sistemas do MPSP',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_programa: 'Programa de Sustentabilidade',
      descricao_programa: 'Iniciativas sustentáveis no MPSP',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as Programa[],

  objetivos_estrategicos: [
    {
      id: 1,
      nome_objetivo: 'Eficiência Operacional',
      descricao_objetivo: 'Melhorar a eficiência dos processos internos',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_objetivo: 'Transparência e Comunicação',
      descricao_objetivo: 'Aprimorar a comunicação com a sociedade',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as ObjetivoEstrategico[],

  selos: [
    {
      id: 1,
      nome_selo: 'Selo PGJ',
      descricao_selo: 'Selo de reconhecimento da Procuradoria-Geral de Justiça',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_selo: 'Selo CG Cidadã',
      descricao_selo: 'Selo de reconhecimento da Corregedoria-Geral',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as Selo[],

  tipos_risco: [
    {
      id: 1,
      nome_tipo: 'Operacional',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_tipo: 'Financeiro',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 3,
      nome_tipo: 'Tecnológico',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as TipoRisco[],

  papeis_equipe: [
    {
      id: 1,
      nome_papel: 'Gerente de Projeto',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      nome_papel: 'Membro da Equipe',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    },
    {
      id: 3,
      nome_papel: 'Patrocinador',
      data_criacao: '2024-01-01T00:00:00',
      data_atualizacao: '2024-01-01T00:00:00'
    }
  ] as PapelEquipe[]
};

// Export individual arrays for direct access
export const mockUsuarios = mockData.usuarios;
export const mockGestores = mockData.gestores;
export const mockUnidadesGestoras = mockData.unidades_gestoras;
export const mockProgramas = mockData.programas;
export const mockObjetivosEstrategicos = mockData.objetivos_estrategicos;
export const mockSelos = mockData.selos;
export const mockTiposRisco = mockData.tipos_risco;
export const mockPapeisEquipe = mockData.papeis_equipe; 