// Tipos base
export interface BaseEntity {
  id: number;
  data_criacao: string;
  data_atualizacao: string;
}

// Tipos de status
export type StatusAtual = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'suspenso';
export type StatusAprovacao = 'aguardando_aprovacao' | 'aprovado' | 'devolvido';
export type TipoIniciativa = 'projeto' | 'boa_pratica' | 'programa';

// Validações
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Tipos principais
export interface Iniciativa extends BaseEntity {
  nome_iniciativa: string;
  tipo_iniciativa: TipoIniciativa;
  unidade_gestora_id: number;
  unidade_gestora?: string;
  selo_id?: number;
  programa_id?: number;
  objetivo_estrategico_id?: number;
  descricao_iniciativa: string;
  promocao_objetivo: string;
  publico_impactado: string;
  ano_vigencia: number;
  status_atual: StatusAtual;
  status_aprovacao: StatusAprovacao;
  data_ultima_atualizacao?: string;
  caminho_imagem?: string;
  percentual_conclusao: number;
  data_ultima_avaliacao?: string;
  data_aprovacao?: string;
  data_retorno?: string;
}

export interface Cronograma extends BaseEntity {
  iniciativa_id: number;
  data_inicio_planejada: string;
  data_fim_planejada: string;
  data_inicio_real?: string;
  data_fim_real?: string;
}

export interface Financeiro extends BaseEntity {
  iniciativa_id: number;
  custo_planejado: number | null;
  custo_real: number | null;
  economia: number | null;
}

export interface Contato extends BaseEntity {
  iniciativa_id: number;
  usuario_id: number;
  tipo_papel: 'cadastrador' | 'autor' | 'equipe' | 'gerente_projeto' | 'patrocinador';
}

export interface Acao extends BaseEntity {
  iniciativa_id: number;
  nome_acao: string;
  unidade_responsavel: string;
  usuario_responsavel_id: number;
  data_inicio_planejada?: string;
  data_fim_planejada?: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  status_acao: 'concluido' | 'em_andamento' | 'nao_iniciado';
}

export interface Risco extends BaseEntity {
  iniciativa_id: number;
  tipo_risco_id: number;
  descricao_risco: string;
  probabilidade: 'raro' | 'baixa' | 'media' | 'alta' | 'quase_certo';
  impacto: 'sem_impacto' | 'leve' | 'grave' | 'gravissimo';
  acao_mitigacao: string;
  usuario_responsavel_id: number;
}

export interface Desafio extends BaseEntity {
  iniciativa_id: number;
  descricao_desafio: string;
  status_desafio: 'pendente' | 'em_andamento' | 'superado';
}

export interface Justificativa extends BaseEntity {
  iniciativa_id: number;
  tipo_justificativa: 'resolutividade' | 'inovacao' | 'transparencia' | 'proatividade' | 'cooperacao';
  descricao_justificativa: string;
}

export interface Resultado extends BaseEntity {
  iniciativa_id: number;
  descricao_resultado: string;
  status_resultado: 'alcancado' | 'parcialmente_alcancado' | 'nao_alcancado';
}

export interface Anexo extends BaseEntity {
  iniciativa_id: number;
  nome_anexo: string;
  nome_arquivo: string;
  caminho_arquivo: string;
  tipo_arquivo: string;
  tamanho_arquivo: number;
  usuario_upload_id: number;
}

export interface OrgaoEnvolvido extends BaseEntity {
  iniciativa_id: number;
  nome_orgao: string;
  papel_orgao: string;
  nome_contato: string;
  email_contato: string;
  obrigatorio: boolean;
}

export interface Premio extends BaseEntity {
  iniciativa_id: number;
  nome_instituicao: string;
  tipo_classificacao: string;
  ano_premio: string;
  descricao_premio: string;
}

export interface Publicidade extends BaseEntity {
  iniciativa_id: number;
  nome_ferramenta: string;
  publico_alvo: string;
  frequencia: 'unica' | 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'semestral' | 'anual';
  usuario_responsavel_id: number;
  data_publicacao: string;
}

// Tipos de cadastros
export interface UnidadeGestora extends BaseEntity {
  nome_unidade: string;
  sigla_unidade: string;
  tipo_unidade: 'meio' | 'fim';
  ativa: boolean;
}

export interface Usuario {
  id: number;
  nome_usuario: string;
  email_usuario: string;
  cargo_usuario: string;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Gestor {
  id: number;
  usuario_id: number;
  niveis_acesso: string[];
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Programa extends BaseEntity {
  nome_programa: string;
  descricao_programa: string;
}

export interface ObjetivoEstrategico extends BaseEntity {
  nome_objetivo: string;
  descricao_objetivo: string;
}

export interface Selo extends BaseEntity {
  nome_selo: string;
  descricao_selo: string;
}

export interface TipoRisco extends BaseEntity {
  nome_tipo: string;
}

export interface PapelEquipe extends BaseEntity {
  nome_papel: string;
}

export interface GestorSistema extends BaseEntity {
  usuario_id: number;
  ativo: boolean;
}

export interface NivelAcessoGestor extends BaseEntity {
  gestor_id: number;
  nivel_acesso: 'admin' | 'gestor_cadastros' | 'gestor_selo_pgj' | 'gestor_selo_cg';
}

export interface ConfiguracaoSistema extends BaseEntity {
  email_gestor: string;
  email_aprovador: string;
}

export interface Marco extends BaseEntity {
  iniciativa_id: number;
  tipo_marco: 'inicio' | 'planejamento' | 'execucao' | 'monitoramento' | 'entrega' | 'encerramento' | 'outro';
  status_marco: 'nao_iniciado' | 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado';
  descricao_marco: string;
  data_prevista: string;
  data_conclusao?: string;
  observacoes?: string;
} 