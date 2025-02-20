# Documentação da API - Projeto BOLT

## Visão Geral
Este documento descreve a API necessária para o frontend do Projeto BOLT. O frontend foi desenvolvido em Vue.js 3 com TypeScript e espera uma API RESTful com autenticação JWT.

## Configuração Base
- **Base URL**: `http://localhost:3000/api` (configurável via `VITE_API_URL`)
- **Content-Type**: `application/json`
- **Autenticação**: Bearer Token JWT

## Autenticação
Todas as requisições autenticadas devem incluir o header:
```
Authorization: Bearer <token>
```

### Endpoints de Autenticação

#### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": string,
  "senha": string
}

Response:
{
  "token": string,
  "user": Usuario
}
```

## Estrutura de Dados Principal

### Iniciativas
Base endpoint: `/iniciativas`

#### Listar Iniciativas
```
GET /iniciativas
Query Parameters:
- status?: StatusAtual
- tipo?: TipoIniciativa
- unidade?: number

Response: Iniciativa[]
```

#### Obter Iniciativa
```
GET /iniciativas/:id

Response: Iniciativa
```

#### Criar Iniciativa
```
POST /iniciativas
Body: Omit<Iniciativa, 'id' | 'data_criacao' | 'data_atualizacao'>

Response: Iniciativa
```

#### Atualizar Iniciativa
```
PUT /iniciativas/:id
Body: Partial<Iniciativa>

Response: Iniciativa
```

#### Excluir Iniciativa
```
DELETE /iniciativas/:id

Response: 200 OK
```

### Relacionamentos da Iniciativa

#### Cronograma
```
GET /iniciativas/:id/cronograma
POST /iniciativas/:id/cronograma
PUT /iniciativas/:id/cronograma
```

#### Marcos
```
GET /iniciativas/:id/marcos
POST /iniciativas/:id/marcos
PUT /iniciativas/:id/marcos/:marcoId
DELETE /iniciativas/:id/marcos/:marcoId
```

#### Financeiro
```
GET /iniciativas/:id/financeiro
POST /iniciativas/:id/financeiro
PUT /iniciativas/:id/financeiro
DELETE /iniciativas/:id/financeiro/:financeiroId
```

#### Contatos
```
GET /iniciativas/:id/contatos
POST /iniciativas/:id/contatos
PUT /iniciativas/:id/contatos/:contatoId
DELETE /iniciativas/:id/contatos/:contatoId
```

#### Ações
```
GET /iniciativas/:id/acoes
POST /iniciativas/:id/acoes
PUT /iniciativas/:id/acoes/:acaoId
DELETE /iniciativas/:id/acoes/:acaoId
```

#### Riscos
```
GET /iniciativas/:id/riscos
POST /iniciativas/:id/riscos
PUT /iniciativas/:id/riscos/:riscoId
DELETE /iniciativas/:id/riscos/:riscoId
```

## Interfaces TypeScript

### Tipos Base
```typescript
type StatusAtual = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'suspenso';
type StatusAprovacao = 'aguardando_aprovacao' | 'aprovado' | 'devolvido';
type TipoIniciativa = 'projeto' | 'boa_pratica' | 'programa';

interface BaseEntity {
  id: number;
  data_criacao: string;
  data_atualizacao: string;
}
```

### Iniciativa
```typescript
interface Iniciativa extends BaseEntity {
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
```

## Tratamento de Erros
A API deve retornar erros no seguinte formato:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

Códigos HTTP esperados:
- 200: Sucesso
- 201: Criado
- 400: Erro de validação
- 401: Não autorizado
- 403: Proibido
- 404: Não encontrado
- 500: Erro interno

## Paginação
Para endpoints que retornam listas, usar query parameters:
- `page`: número da página (default: 1)
- `per_page`: itens por página (default: 10)

Exemplo de resposta paginada:
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }
}
```

## Uploads
Para upload de arquivos (anexos):
```
POST /iniciativas/:id/anexos
Content-Type: multipart/form-data

Form Data:
- arquivo: File
- nome_anexo: string
- tipo_arquivo: string
```

## Métricas e KPIs
```
GET /metricas/unidade/:unidadeId
GET /metricas/programa/:programaId

Response: MetricasUnidade | MetricasPrograma
```

## Considerações de Segurança
1. Implementar rate limiting
2. Validar todos os inputs
3. Sanitizar dados de saída
4. Implementar CORS apropriadamente
5. Usar HTTPS em produção
6. Validar tokens JWT em cada requisição autenticada
7. Implementar refresh token

## Ambiente de Desenvolvimento
O frontend inclui dados mockados para desenvolvimento. Para desativar, garantir que `import.meta.env.DEV` seja `false` em produção. 