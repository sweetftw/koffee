# Plano de Teste - Koffee

## 📋 Informações do Projeto

| Campo               | Valor        |
| ------------------- | ------------ |
| **Projeto**         | Koffee App   |
| **Versão**          | 1.0.0        |
| **Data de Criação** | 29/06/2025   |
| **Responsável**     | Yan Dias     |
| **Status**          | Planejamento |

## 🎯 Objetivo

Este plano de teste tem como objetivo garantir a qualidade e funcionalidade do app Koffee, validando todas as funcionalidades projeto.

## 🔍 Escopo do Teste

### ✅ Funcionalidades Incluídas

- Carregamento e exibição de ingredientes
- Seleção de ingredientes base (máximo 3)
- Seleção de ingredientes adicionais (máximo 2)
- Reconhecimento de cafés especiais
- Geração de nomes de café personalizados
- Envio de pedidos
- Validações de entrada
- Tratamento de erros
- Integração com API

## 🎭 Tipos de Teste

### 1. Testes Funcionais

- **Teste de Interface (E2E)**: Validação da experiência do usuário
- **Teste de API**: Validação dos endpoints backend
- **Teste de Integração**: Comunicação entre frontend e backend

### 2. Testes Não-Funcionais

- **Teste de Performance**: Tempos de resposta e carregamento
- **Teste de Usabilidade**: Facilidade de uso da interface
- **Teste de Compatibilidade**: Diferentes navegadores e dispositivos

### 3. Testes de Segurança

- **Validação de Entrada**: Prevenção de SQL Injection e XSS
- **Teste de Autenticação**: Validação de acesso

## 📊 Estratégia de Teste

Estratégia para este projeto é focar em teste de Caixa preta vendo pela perspectiva do usuário onde estão os gargalos da aplicação e identificando o mais rápido possível para a entrega do projeto não ser afetada. Fazer uso de testes manuais onde será possível identificar bugs fora do escopo.

### Priorização

1. **Crítica**: Funcionalidades essenciais para o negócio
2. **Alta**: Funcionalidades importantes para a experiência
3. **Média**: Funcionalidades complementares
4. **Baixa**: Funcionalidades de conveniência

## 🧪 Casos de Teste

### CT001 - Carregamento da Aplicação

| Campo                     | Valor                                                            |
| ------------------------- | ---------------------------------------------------------------- |
| **Prioridade**            | Crítica                                                          |
| **Tipo**                  | Funcional                                                        |
| **Objetivo**              | Verificar se a aplicação carrega corretamente                    |
| **Pré-condições**         | Navegador aberto, conexão com internet                           |
| **Passos**                | 1. Acessar URL da aplicação<br>2. Aguardar carregamento completo |
| **Resultado Esperado**    | Interface carregada com ingredientes visíveis                    |
| **Critério de Aceitação** | Tempo de carregamento < 3 segundos                               |

### CT002 - Seleção de Ingredientes Base

| Campo                     | Valor                                                                       |
| ------------------------- | --------------------------------------------------------------------------- |
| **Prioridade**            | Crítica                                                                     |
| **Tipo**                  | Funcional                                                                   |
| **Objetivo**              | Validar seleção de ingredientes base                                        |
| **Pré-condições**         | Aplicação carregada                                                         |
| **Passos**                | 1. Clicar em "Expresso"<br>2. Clicar em "Leite"<br>3. Clicar em "Chocolate" |
| **Resultado Esperado**    | Ingredientes selecionados com classe "selected"                             |
| **Critério de Aceitação** | Máximo 3 ingredientes selecionáveis                                         |

### CT003 - Limite de Ingredientes Base

| Campo                     | Valor                                                      |
| ------------------------- | ---------------------------------------------------------- |
| **Prioridade**            | Alta                                                       |
| **Tipo**                  | Funcional                                                  |
| **Objetivo**              | Validar limite máximo de ingredientes base                 |
| **Pré-condições**         | 3 ingredientes base já selecionados                        |
| **Passos**                | 1. Tentar selecionar 4º ingrediente base                   |
| **Resultado Esperado**    | Ingrediente não selecionado + mensagem de erro             |
| **Critério de Aceitação** | Toast com mensagem "Máximo de ingredientes base atingido!" |

### CT004 - Reconhecimento de Café Especial

| Campo                     | Valor                                               |
| ------------------------- | --------------------------------------------------- |
| **Prioridade**            | Alta                                                |
| **Tipo**                  | Funcional                                           |
| **Objetivo**              | Validar reconhecimento do Affogato                  |
| **Pré-condições**         | Aplicação carregada                                 |
| **Passos**                | 1. Selecionar "Sorvete"<br>2. Selecionar "Expresso" |
| **Resultado Esperado**    | Exibição "Affogato Especial"                        |
| **Critério de Aceitação** | Toast confirmando criação do café especial          |

### CT005 - Envio de Pedido

| Campo                     | Valor                                                      |
| ------------------------- | ---------------------------------------------------------- |
| **Prioridade**            | Crítica                                                    |
| **Tipo**                  | Funcional                                                  |
| **Objetivo**              | Validar envio de pedido válido                             |
| **Pré-condições**         | Pelo menos 1 ingrediente base selecionado                  |
| **Passos**                | 1. Selecionar ingredientes<br>2. Clicar em "Enviar Pedido" |
| **Resultado Esperado**    | Pedido enviado com sucesso                                 |
| **Critério de Aceitação** | Seleções limpas após envio                                 |

## 🚨 Análise de Riscos

| Risco                 | Probabilidade | Impacto | Mitigação                             |
| --------------------- | ------------- | ------- | ------------------------------------- |
| API instável          | Média         | Alto    | Implementar mocks, testes isolados    |
| Ambiente indisponível | Baixa         | Alto    | Backup do ambiente, monitoramento     |
| Bugs críticos         | Alta          | Médio   | Testes antecipados, revisão de código |
| Prazo apertado        | Média         | Médio   | Priorização de testes críticos        |

## 🔧 Ferramentas Utilizadas

| Ferramenta          | Propósito             | Versão  |
| ------------------- | --------------------- | ------- |
| **Cypress**         | Automação E2E e API   | 14.5.0  |
| **Postman**         | Testes manuais de API | 11.51.5 |
| **Chrome DevTools** | Debug e inspeção      | Latest  |
