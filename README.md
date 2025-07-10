# Koffee ☕

Um app web interativo para criar receitas de café personalizadas. Monte seu café do jeito especial com ingredientes base e adicionais extras.

## 🚀 Funcionalidades

- **Seleção de Ingredientes Base**: Escolha até 3 ingredientes base para sua bebida
- **Adicionais Extras**: Turbine seu café com até 2 ingredientes extras
- **Resumo da Receita**: Visualize sua receita personalizada com nome especial

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js com Express

## 🔧 Pré-requisitos

- Node.js (versão 20 ou superior)
- npm ou yarn
- docker ou docker-compose

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd coffee-app
```

2. Inicie os containers:

```bash
docker-compose up --build
```

3. Rode as migration para inicializar o banco de dados:

```bash
cd backend
npm run migrations
```

## 🚀 Como Acessar

1. Abra seu navegador e acesse:

```
http://localhost:3000
```

## 🧪 Testes de API

### Configuração dos Testes

```bash
# Entre na pasta em que deseja testar
cd backend
ou
cd frontend

# Execute os testes em modo headless
npm run cypress:headless

# Execute os testes com interface gráfica
npm run cypress:web
```

## 🔌 Testes de API

### Endpoints Testados

#### **GET /ingredients**

- ✅ Retorna lista de ingredientes com sucesso (status 200)
- ✅ Valida estrutura dos dados (id, ingredient, additional)
- ✅ Headers de resposta corretos (Content-Type: application/json)
- ✅ Filtragem entre ingredientes base e adicionais
- ✅ Tempo de resposta < 1 segundo
- ✅ Tratamento de endpoints inválidos (404/500)

#### **POST /order**

- ✅ Aceita pedidos válidos (status 200)
- ✅ Retorna mensagem de confirmação
- ✅ Valida estrutura do payload
- ✅ Rejeita pedidos vazios (400/422)
- ✅ Tempo de resposta < 2 segundos
- ✅ Suporte a requisições concorrentes

#### 🛡️ **Segurança e Validação**

- ✅ **SQL Injection**: Proteção contra tentativas de injeção SQL
- ✅ **XSS**: Sanitização de dados de entrada
- ✅ **Validação de Tipos**: Verificação de tipos de dados
- ✅ **Payloads Grandes**: Tratamento de dados oversized
- ✅ **JSON Malformado**: Handling de JSON inválido

#### ⚡ **Performance**

- ✅ **Requisições Simultâneas**: Suporte a múltiplas requisições
- ✅ **Teste de Carga**: 20 requisições com tempo médio < 1s
- ✅ **Consistência de Dados**: Dados consistentes entre requisições

## 🖥️ Testes End-to-End (E2E)

### Funcionalidades Testadas

#### **🚀 Carregamento da Aplicação**

- ✅ Carregamento da aplicação com dados corretos
- ✅ Exibição correta de ingredientes base e adicionais
- ✅ Verificação de visibilidade dos componentes principais

#### **🎯 Seleção de Ingredientes**

**Ingredientes Base:**

- ✅ Seleção de ingrediente único
- ✅ Seleção múltipla de ingredientes (até 3)
- ✅ Desseleção de ingredientes clicados novamente
- ✅ Prevenção de seleção de mais de 3 ingredientes base
- ✅ Exibição de toast de erro ao exceder limite

**Ingredientes Adicionais:**

- ✅ Seleção correta de ingredientes adicionais
- ✅ Prevenção de seleção de mais de 2 adicionais
- ✅ Exibição de toast de erro ao exceder limite

#### **☕ Reconhecimento de Cafés Especiais**

- ✅ **Affogato Especial**: Reconhece combinação Sorvete + Expresso
- ✅ **Café Personalizado**: Exibe para receitas não-especiais
- ✅ Geração automática de nomes de café baseado nos ingredientes

#### **📝 Gerenciamento de Receitas**

- ✅ Construção correta do nome do café (ex: "Expresso com Chocolate, Espuma")
- ✅ Atualização da lista de receita em tempo real
- ✅ Limpeza completa de seleções com botão "Limpar Pedido"
- ✅ Reset de estados visuais após limpeza

#### **📤 Submissão de Pedidos**

- ✅ Submissão de pedido válido com sucesso
- ✅ Validação de payload enviado para API
- ✅ Limpeza automática após submissão bem-sucedida
- ✅ Prevenção de submissão sem ingredientes base
- ✅ Tratamento de erros da API durante submissão

#### **⚠️ Tratamento de Erros**

- ✅ Tratamento gracioso de falha na API de ingredientes
- ✅ Exibição de componentes vazios em caso de erro
- ✅ Manutenção de estado durante erros de submissão

#### **⚡ Performance E2E**

- ✅ Carregamento de ingredientes em menos de 3 segundos
- ✅ Responsividade da interface durante interações

## Gherkin

### Localização dos arquivos Gherkin

```
coffee-app/
├── backend             # API e lógica do server
├────── app.feature     # Arquivo Gherkin do backend
└── ...
├── frontend            # App frontend
├────── app.feature     # Arquivo Gherkin do frontend
└── ...
├── .env                # Variáveis de ambiente
├── docker-compose.yml  # Configuração do Docker
└── README.md           # Este arquivo
```

## Revisão

Frontend e backend desenvolvido todo em Javascript, usando apenas o NodeJS como framework, mantendo o app o mais leve possível sem comprometer a robustez do projeto.
Possíveis melhorias que ajudariam o projeto:

- Melhor organização no frontend
- Melhor escolha de nomes para variaveis
- Possível troca de alguns Arrays por HashMap assim evitando loops desnecessários
- Responsividade para Mobile

## Plano de teste

## 🖥️ Testes E2E (Frontend)

### Testes de Caixa Preta

- ✅ Carregamento da aplicação: Verifica se a interface carrega corretamente
- 🔘 Seleção de ingredientes: Testa a funcionalidade de escolha de ingredientes
- ☕ Reconhecimento de cafés especiais: Valida se combinações específicas são identificadas
- 📝 Gerenciamento de receitas: Testa funcionalidades de limpeza e manipulação
- 📤 Envio de pedidos: Verifica o fluxo completo de submissão
- ⚠️ Tratamento de erros: Testa como a aplicação responde a falhas
- ⚡ Performance: Avalia tempos de carregamento

### Testes de Caixa Branca

- 🔢 Validação de limites: Conhecimento específico dos limites (3 ingredientes base, 2 adicionais)
- 🎨 Classes CSS: Verificação da aplicação de classes específicas como "selected"
- 🏗️ Estrutura DOM: Testes de elementos específicos (#Expresso-recipe, #coffee-name)
- 🌐 Interceptação de API: Conhecimento das chamadas HTTP internas
- 📊 Validação de payload: Verificação da estrutura exata dos dados enviados

### 🔌 Testes de API (Backend)

### Testes de Caixa Preta

- 📋 Endpoints de ingredientes: Testa funcionalidade básica de recuperação de dados
- 🛒 Endpoints de pedidos: Valida envio e processamento de pedidos
- ❌ Tratamento de erros: Verifica respostas a requisições inválidas
- ⚡ Performance: Testa tempos de resposta e carga
- 🔒 Integridade de dados: Verifica consistência das informações
- 🌍 CORS e cabeçalhos: Valida configurações de rede

### Testes de Caixa Branca

- 📐 Estrutura de dados específica: Validação de propriedades exatas (id, ingredient, price)
- 🔤 Tipos de dados: Verificação se campos são number, string, boolean
- 📊 Códigos de status HTTP específicos: Conhecimento de códigos exatos (200, 400, 413, 422)
- 🛡️ Validações de segurança: Testes de SQL injection e XSS
- 📋 Estrutura de payload JSON: Conhecimento do formato interno esperado
- 🏷️ Cabeçalhos HTTP específicos: Validação de Content-Type e outros headers
- ⚠️ Estrutura de resposta de erro: Conhecimento da propriedade "error" específica

## 🐛 Teste Manual

#### Bugs identificados:

- Quando feito um café personalizado e logo depois feito a deseleção de todos os itens, ainda aparece o nome Café Personalizado no Resumo

## ❌ Requisitos não atendidos

- RQNF12: Falta de tempo e conhecimento com a ferramenta

## 📋 Plano de Teste

Segue o [plano de teste sugerido](plano_teste_v1.md)
