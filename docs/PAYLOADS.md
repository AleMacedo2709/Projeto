# Exemplos de Payloads da API

Este documento complementa a documentação principal da API com exemplos de payloads para cada endpoint.

## Iniciativas

### Criar Iniciativa
```json
POST /iniciativas
{
  "nome_iniciativa": "Modernização do Atendimento Digital",
  "tipo_iniciativa": "projeto",
  "unidade_gestora_id": 1,
  "selo_id": 2,
  "programa_id": 3,
  "objetivo_estrategico_id": 1,
  "descricao_iniciativa": "Projeto de modernização do atendimento através de canais digitais",
  "promocao_objetivo": "Através da implementação de chatbots e automação de processos",
  "publico_impactado": "Cidadãos e servidores do MPSP",
  "ano_vigencia": 2024,
  "status_atual": "em_andamento",
  "status_aprovacao": "aguardando_aprovacao",
  "percentual_conclusao": 0
}
```

### Atualizar Iniciativa
```json
PUT /iniciativas/1
{
  "status_atual": "em_andamento",
  "percentual_conclusao": 45,
  "data_ultima_avaliacao": "2024-03-20T10:00:00Z"
}
```

## Cronograma

### Criar/Atualizar Cronograma
```json
POST /iniciativas/1/cronograma
{
  "data_inicio_planejada": "2024-01-01T00:00:00Z",
  "data_fim_planejada": "2024-12-31T23:59:59Z",
  "data_inicio_real": "2024-01-15T00:00:00Z",
  "data_fim_real": null
}
```

## Marcos

### Adicionar Marco
```json
POST /iniciativas/1/marcos
{
  "tipo_marco": "inicio",
  "status_marco": "concluido",
  "descricao_marco": "Início do projeto",
  "data_prevista": "2024-01-15T00:00:00Z",
  "data_conclusao": "2024-01-15T00:00:00Z",
  "observacoes": "Projeto iniciado conforme planejado"
}
```

## Financeiro

### Adicionar Financeiro
```json
POST /iniciativas/1/financeiro
{
  "custo_planejado": 150000.00,
  "custo_real": 145000.00,
  "economia": 5000.00
}
```

## Contatos

### Adicionar Contato
```json
POST /iniciativas/1/contatos
{
  "usuario_id": 1,
  "tipo_papel": "gerente_projeto"
}
```

## Ações

### Adicionar Ação
```json
POST /iniciativas/1/acoes
{
  "nome_acao": "Implementar Sistema de Agendamento",
  "unidade_responsavel": "TI",
  "usuario_responsavel_id": 1,
  "data_inicio_planejada": "2024-02-01T00:00:00Z",
  "data_fim_planejada": "2024-03-31T23:59:59Z",
  "status_acao": "em_andamento"
}
```

## Riscos

### Adicionar Risco
```json
POST /iniciativas/1/riscos
{
  "tipo_risco_id": 1,
  "descricao_risco": "Atraso na entrega do software",
  "probabilidade": "media",
  "impacto": "grave",
  "acao_mitigacao": "Aumentar equipe de desenvolvimento",
  "usuario_responsavel_id": 1
}
```

## Desafios

### Adicionar Desafio
```json
POST /iniciativas/1/desafios
{
  "descricao_desafio": "Integração com sistemas legados",
  "status_desafio": "em_andamento"
}
```

## Justificativas

### Adicionar Justificativa
```json
POST /iniciativas/1/justificativas
{
  "tipo_justificativa": "inovacao",
  "descricao_justificativa": "Primeira implementação deste tipo de solução no MP"
}
```

## Resultados

### Adicionar Resultado
```json
POST /iniciativas/1/resultados
{
  "descricao_resultado": "Redução de 30% no tempo de atendimento",
  "status_resultado": "alcancado"
}
```

## Órgãos Envolvidos

### Adicionar Órgão
```json
POST /iniciativas/1/orgaos-envolvidos
{
  "nome_orgao": "Tribunal de Justiça",
  "papel_orgao": "Parceiro",
  "nome_contato": "João Silva",
  "email_contato": "joao.silva@tj.sp.gov.br",
  "obrigatorio": true
}
```

## Prêmios

### Adicionar Prêmio
```json
POST /iniciativas/1/premios
{
  "nome_instituicao": "CNMP",
  "tipo_classificacao": "1º Lugar",
  "ano_premio": "2024",
  "descricao_premio": "Prêmio de Inovação"
}
```

## Publicidades

### Adicionar Publicidade
```json
POST /iniciativas/1/publicidades
{
  "nome_ferramenta": "Portal MPSP",
  "publico_alvo": "Público em geral",
  "frequencia": "mensal",
  "usuario_responsavel_id": 1,
  "data_publicacao": "2024-03-01T00:00:00Z"
}
```

## Métricas

### Exemplo de Resposta de Métricas por Unidade
```json
GET /metricas/unidade/1
{
  "total_iniciativas": 10,
  "percentual_conclusao_medio": 65.5,
  "economia_total": 50000.00,
  "nivel_risco_medio": 2.3,
  "iniciativas_atrasadas": 2,
  "desempenho_geral": 78.5
}
```

### Exemplo de Resposta de Métricas por Programa
```json
GET /metricas/programa/1
{
  "total_iniciativas": 5,
  "percentual_conclusao_medio": 70.0,
  "orcamento_total": 500000.00,
  "economia_total": 25000.00,
  "nivel_risco_medio": 1.8,
  "desempenho_geral": 82.5
}
``` 