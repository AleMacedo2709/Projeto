-- Esquema do Banco de Dados para o Sistema de Gestão de Iniciativas MPSP

-- Configurações do Sistema
CREATE TABLE configuracoes_sistema (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email_gestor VARCHAR(255) DEFAULT 'cge@mpsp.mp.br',
    email_aprovador VARCHAR(255) DEFAULT 'cgmptec2@mpsp.mp.br',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Unidades Gestoras
CREATE TABLE unidades_gestoras (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_unidade VARCHAR(255) NOT NULL,
    sigla_unidade VARCHAR(50) NOT NULL,
    tipo_unidade ENUM('meio', 'fim') NOT NULL,
    ativa BOOLEAN DEFAULT true,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Gestores do Sistema
CREATE TABLE gestores_sistema (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Níveis de Acesso dos Gestores
CREATE TABLE niveis_acesso_gestor (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    gestor_id BIGINT NOT NULL,
    nivel_acesso ENUM('admin', 'gestor_cadastros', 'gestor_selo_pgj', 'gestor_selo_cg') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (gestor_id) REFERENCES gestores_sistema(id) ON DELETE CASCADE,
    UNIQUE KEY unique_gestor_nivel (gestor_id, nivel_acesso)
);

-- Tabela de Categorias de Prêmios
CREATE TABLE categorias_premio (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_categoria VARCHAR(255) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Tipos de Risco
CREATE TABLE tipos_risco (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo VARCHAR(100) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Papéis na Equipe
CREATE TABLE papeis_equipe (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_papel VARCHAR(100) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Selos
CREATE TABLE selos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_selo VARCHAR(50) NOT NULL,
    descricao_selo TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_usuario VARCHAR(255) NOT NULL,
    email_usuario VARCHAR(255) NOT NULL UNIQUE,
    cargo_usuario VARCHAR(100) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Programas
CREATE TABLE programas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_programa VARCHAR(255) NOT NULL,
    descricao_programa TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Objetivos Estratégicos
CREATE TABLE objetivos_estrategicos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_objetivo VARCHAR(255) NOT NULL,
    descricao_objetivo TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Iniciativas (Projetos/Boas Práticas)
CREATE TABLE iniciativas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_iniciativa VARCHAR(100) NOT NULL,
    tipo_iniciativa ENUM('projeto', 'boa_pratica', 'programa') NOT NULL,
    unidade_gestora_id BIGINT NOT NULL,
    selo_id BIGINT,
    programa_id BIGINT,
    objetivo_estrategico_id BIGINT,
    descricao_iniciativa TEXT NOT NULL,
    promocao_objetivo VARCHAR(100) NOT NULL,
    publico_impactado VARCHAR(100) NOT NULL,
    ano_vigencia INT NOT NULL,
    status_atual ENUM('nao_iniciado', 'em_andamento', 'concluido', 'suspenso') NOT NULL,
    status_aprovacao ENUM('aguardando_aprovacao', 'aprovado', 'devolvido') NOT NULL,
    data_ultima_atualizacao DATETIME,
    caminho_imagem VARCHAR(255),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    percentual_conclusao DECIMAL(5,2) DEFAULT 0,
    data_ultima_avaliacao DATE,
    FOREIGN KEY (selo_id) REFERENCES selos(id) ON DELETE SET NULL,
    FOREIGN KEY (unidade_gestora_id) REFERENCES unidades_gestoras(id) ON DELETE RESTRICT,
    FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE RESTRICT,
    FOREIGN KEY (objetivo_estrategico_id) REFERENCES objetivos_estrategicos(id) ON DELETE RESTRICT,
    CONSTRAINT check_selo_id CHECK (
        (tipo_iniciativa = 'boa_pratica' AND selo_id IS NULL) OR
        (tipo_iniciativa IN ('projeto', 'programa'))
    )
);

-- Tabela de Cronograma (apenas para Projetos)
CREATE TABLE cronogramas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    data_inicio_planejada DATE NOT NULL,
    data_fim_planejada DATE NOT NULL,
    data_inicio_real DATE,
    data_fim_real DATE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    CONSTRAINT check_tipo_iniciativa CHECK (
        EXISTS (
            SELECT 1 FROM iniciativas i 
            WHERE i.id = iniciativa_id 
            AND i.tipo_iniciativa IN ('projeto', 'programa')
        )
    )
);

-- Tabela de Financeiro (apenas para Projetos)
CREATE TABLE financeiros (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    custo_planejado DECIMAL(15,2),
    custo_real DECIMAL(15,2),
    economia DECIMAL(15,2),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    CONSTRAINT check_tipo_iniciativa CHECK (
        EXISTS (
            SELECT 1 FROM iniciativas i 
            WHERE i.id = iniciativa_id 
            AND i.tipo_iniciativa IN ('projeto', 'programa')
        )
    )
);

-- Tabela de Contatos
CREATE TABLE contatos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    tipo_papel ENUM('cadastrador', 'autor', 'equipe', 'gerente_projeto', 'patrocinador') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Ações
CREATE TABLE acoes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    nome_acao VARCHAR(255) NOT NULL,
    unidade_responsavel VARCHAR(255) NOT NULL,
    usuario_responsavel_id BIGINT NOT NULL,
    data_inicio_planejada DATE,
    data_fim_planejada DATE,
    data_inicio_real DATE,
    data_fim_real DATE,
    status_acao ENUM('concluido', 'em_andamento', 'nao_iniciado') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_responsavel_id) REFERENCES usuarios(id)
);

-- Tabela de Riscos
CREATE TABLE riscos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    tipo_risco_id BIGINT NOT NULL,
    descricao_risco TEXT NOT NULL,
    probabilidade ENUM('raro', 'baixa', 'media', 'alta', 'quase_certo') NOT NULL,
    impacto ENUM('sem_impacto', 'leve', 'grave', 'gravissimo') NOT NULL,
    acao_mitigacao TEXT NOT NULL,
    usuario_responsavel_id BIGINT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_risco_id) REFERENCES tipos_risco(id),
    FOREIGN KEY (usuario_responsavel_id) REFERENCES usuarios(id)
);

-- Tabela de Curtidas
CREATE TABLE curtidas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_curtida (iniciativa_id, usuario_id)
);

-- Tabela de Comentários
CREATE TABLE comentarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    texto_comentario TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Desafios (apenas para Projetos)
CREATE TABLE desafios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    descricao_desafio TEXT NOT NULL,
    status_desafio ENUM('pendente', 'em_andamento', 'superado') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    CONSTRAINT check_tipo_iniciativa CHECK (
        EXISTS (
            SELECT 1 FROM iniciativas i 
            WHERE i.id = iniciativa_id 
            AND i.tipo_iniciativa IN ('projeto', 'programa')
        )
    )
);

-- Tabela de Justificativas
CREATE TABLE justificativas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    tipo_justificativa ENUM('resolutividade', 'inovacao', 'transparencia', 'proatividade', 'cooperacao') NOT NULL,
    descricao_justificativa TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE
);

-- Tabela de Resultados
CREATE TABLE resultados (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    descricao_resultado TEXT NOT NULL,
    status_resultado ENUM('alcancado', 'parcialmente_alcancado', 'nao_alcancado') NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE
);

-- Tabela de Anexos
CREATE TABLE anexos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    nome_anexo VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100) NOT NULL,
    tamanho_arquivo BIGINT NOT NULL,
    usuario_upload_id BIGINT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_upload_id) REFERENCES usuarios(id)
);

-- Tabela de Órgãos Envolvidos
CREATE TABLE orgaos_envolvidos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    nome_orgao VARCHAR(255) NOT NULL,
    papel_orgao VARCHAR(100) NOT NULL,
    nome_contato VARCHAR(255) NOT NULL,
    email_contato VARCHAR(255) NOT NULL,
    obrigatorio BOOLEAN DEFAULT true,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE
);

-- Tabela de Prêmios
CREATE TABLE premios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    nome_instituicao VARCHAR(255) NOT NULL,
    tipo_classificacao VARCHAR(100) NOT NULL,
    ano_premio VARCHAR(4) NOT NULL,
    descricao_premio TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE
);

-- Tabela de Publicidade
CREATE TABLE publicidades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    iniciativa_id BIGINT NOT NULL,
    nome_ferramenta VARCHAR(100) NOT NULL,
    publico_alvo VARCHAR(100) NOT NULL,
    frequencia ENUM('unica', 'diaria', 'semanal', 'quinzenal', 'mensal', 'bimestral', 'semestral', 'anual') NOT NULL,
    usuario_responsavel_id BIGINT NOT NULL,
    data_publicacao DATE NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (iniciativa_id) REFERENCES iniciativas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_responsavel_id) REFERENCES usuarios(id)
);

-- Índices para melhor performance
CREATE INDEX idx_iniciativa_tipo_status ON iniciativas(tipo_iniciativa, status_atual);
CREATE INDEX idx_iniciativa_ano ON iniciativas(ano_vigencia);
CREATE INDEX idx_acao_status ON acoes(status_acao);
CREATE INDEX idx_risco_probabilidade_impacto ON riscos(probabilidade, impacto);
CREATE INDEX idx_desafio_status ON desafios(status_desafio);
CREATE INDEX idx_resultado_status ON resultados(status_resultado);
CREATE INDEX idx_premio_ano ON premios(ano_premio);

-- Comentários sobre o esquema:
-- 1. Todas as tabelas possuem chaves estrangeiras com ON DELETE CASCADE para manter a integridade referencial
-- 2. Campos de data de criação e atualização são automaticamente gerenciados
-- 3. Enums são utilizados para limitar valores válidos em campos específicos
-- 4. Índices são criados para otimizar consultas comuns
-- 5. Relacionamentos são mantidos através de chaves estrangeiras
-- 6. Campos de texto longos utilizam o tipo TEXT
-- 7. Campos monetários utilizam DECIMAL para precisão
-- 8. Unicidade é garantida onde necessário (ex: likes de usuário)

-- Inserção dos dados iniciais
INSERT INTO categorias_premio (nome_categoria) VALUES 
('Diminuição da violência'),
('Combate à corrupção e à improbidade administrativa'),
('Promoção e prevenção dos direitos humanos por meio da afirmação dos direitos sociais'),
('Defesa do meio ambiente e do consumidor'),
('Comunicação eficiente com a sociedade'),
('Eficiência Operacional');

INSERT INTO tipos_risco (nome_tipo) VALUES 
('Cronograma'),
('Escopo'),
('Financeiro'),
('Pessoal'),
('Político'),
('Qualidade'),
('Resultado'),
('Tecnológico');

INSERT INTO papeis_equipe (nome_papel) VALUES 
('Cadastrador'),
('Autor'),
('Equipe'),
('Gerente do Projeto'),
('Patrocinador');

INSERT INTO selos (nome_selo) VALUES 
('PGJ'),
('CG Cidadã');

-- Inserção da configuração inicial do sistema
INSERT INTO configuracoes_sistema (email_gestor, email_aprovador) VALUES 
('cge@mpsp.mp.br', 'cgmptec2@mpsp.mp.br');

-- Índices para melhor performance
CREATE INDEX idx_iniciativa_tipo_status ON iniciativas(tipo_iniciativa, status_atual);
CREATE INDEX idx_iniciativa_ano ON iniciativas(ano_vigencia);
CREATE INDEX idx_acao_status ON acoes(status_acao);
CREATE INDEX idx_risco_probabilidade_impacto ON riscos(probabilidade, impacto);
CREATE INDEX idx_desafio_status ON desafios(status_desafio);
CREATE INDEX idx_resultado_status ON resultados(status_resultado);
CREATE INDEX idx_premio_ano ON premios(ano_premio);


-- Atualizando referências em iniciativas
ALTER TABLE iniciativas 
DROP FOREIGN KEY iniciativas_ibfk_1, -- Remove a FK para grupos_mpsp
