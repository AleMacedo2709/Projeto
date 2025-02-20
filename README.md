# Projeto BOLT - Frontend

## Sobre o Projeto
O Projeto BOLT é um sistema de gestão de iniciativas para o Ministério Público de São Paulo (MPSP). Ele permite o cadastro, acompanhamento e gestão de projetos, boas práticas e programas institucionais.

## Tecnologias Utilizadas
- Vue.js 3
- TypeScript
- Pinia (Gerenciamento de Estado)
- Vue Router
- TailwindCSS
- Vitest (Testes)
- i18n (Internacionalização)

## Pré-requisitos
- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd project-bolt
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3000/api
```

## Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Testes
```bash
# Executar testes
npm run test

# Executar testes com cobertura
npm run test:coverage

# Interface visual de testes
npm run test:ui
```

### Linting
```bash
npm run lint
```

## Estrutura do Projeto

```
project-bolt/
├── docs/                    # Documentação
│   ├── API.md              # Documentação da API
│   └── PAYLOADS.md         # Exemplos de Payloads
├── src/
│   ├── assets/             # Recursos estáticos
│   ├── components/         # Componentes Vue
│   ├── services/           # Serviços e integrações
│   ├── stores/             # Stores Pinia
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Utilitários
│   ├── views/              # Componentes de página
│   ├── router/             # Configuração de rotas
│   ├── i18n/               # Internacionalização
│   └── mocks/              # Dados mockados
├── tests/                  # Testes
└── public/                 # Arquivos públicos
```

## Funcionalidades Principais

### Gestão de Iniciativas
- Cadastro de iniciativas (projetos, boas práticas, programas)
- Acompanhamento de cronograma
- Gestão financeira
- Gestão de riscos
- Acompanhamento de resultados

### Métricas e KPIs
- Dashboard de métricas gerais
- Métricas por programa
- Métricas por unidade
- Indicadores de desempenho

### Gestão de Cadastros
- Unidades gestoras
- Programas
- Objetivos estratégicos
- Selos

## Documentação
- [Documentação da API](docs/API.md)
- [Exemplos de Payloads](docs/PAYLOADS.md)

## Considerações para Implantação

### Ambiente de Produção
1. Configurar variáveis de ambiente apropriadas
2. Garantir que `import.meta.env.DEV` seja `false`
3. Configurar CORS adequadamente
4. Implementar monitoramento de erros
5. Configurar cache apropriadamente

### Segurança
1. Implementar autenticação JWT
2. Validar tokens em todas as requisições
3. Sanitizar inputs
4. Implementar proteção contra CSRF
5. Usar HTTPS

## Suporte
Para suporte técnico ou dúvidas sobre o frontend, contate a equipe de desenvolvimento.
