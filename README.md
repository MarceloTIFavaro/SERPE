# SERPE - Sistema ERP para Pequenas Empresas

Este é o back-end do projeto SERPE, um sistema desenvolvido para facilitar o controle de estoque, gerenciamento de clientes e vendas de uma empresa. O projeto foi construído utilizando Node.js com uma arquitetura organizada e segura.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução Javascript.
- **Express**: Framework web para criação da API.
- **PostgreSQL**: Banco de dados relacional.
- **JWT (JSON Web Token)**: Autenticação segura.
- **Bcrypt**: Criptografia de senhas.
- **Helmet & CORS**: Segurança e controle de acesso.
- **Jest & Supertest**: Testes automatizados.

## 📁 Estrutura do Projeto

O back-end segue uma estrutura de pastas organizada por responsabilidades:

```text
backend/
├── src/
│   ├── config/         # Configurações (ex: banco de dados)
│   ├── controllers/    # Lógica de controle das requisições
│   ├── middlewares/    # Filtros e validações (ex: auth, erros)
│   ├── models/         # Interação direta com o banco de dados
│   ├── routes/         # Definição dos endpoints da API
│   ├── services/       # Regras de negócio
│   ├── utils/          # Classes e funções utilitárias (ex: AppError)
│   └── app.js          # Configuração central do Express
├── server.js           # Ponto de entrada do servidor
└── test/               # Testes automatizados
```

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- PostgreSQL rodando localmente ou em um container.

### Passo 1: Configurar o Banco de Dados
1. Crie um banco de dados no PostgreSQL (ex: `serpe_db`).
2. Execute os scripts SQL localizados em `BD/Teste 1° BD.sql` para criar as tabelas e dados iniciais.

### Passo 2: Configurar Variáveis de Ambiente
1. Na pasta `backend/`, você encontrará um arquivo `.env.example`.
2. Duplique este arquivo e renomeie a cópia para `.env`.
3. Preencha as variáveis no `.env` com as suas credenciais locais do PostgreSQL e uma chave secreta para o JWT.
   - **Nota:** Nunca versione o seu arquivo `.env`, ele já está incluído no `.gitignore`.

### Passo 3: Instalar Dependências
No terminal, dentro da pasta `backend/`, execute:
```bash
npm install
```

### Passo 4: Executar o Servidor

Para rodar o servidor normalmente:
```bash
node server.js
```
Ou via script do npm:
```bash
npm start
```

Para desenvolvimento (com atualização automática via nodemon):
```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3000`.

## 📡 Endpoints da API

### Autenticação
- `POST /auth/registro`: Cria uma nova conta de empresa.
- `POST /auth/login`: Autentica uma empresa e retorna o token JWT.
- `GET /auth/perfil`: Retorna os dados da empresa logada (requer token).

### Produtos
- `GET /produtos`: Lista todos os produtos da empresa.
- `GET /produtos/:id`: Busca um produto específico.
- `POST /produtos`: Cadastra um novo produto.
- `PUT /produtos/:id`: Atualiza dados de um produto.
- `DELETE /produtos/:id`: Remove um produto.

### Clientes
- `GET /clientes`: Lista todos os clientes.
- `POST /clientes`: Cadastra um novo cliente.
- `PUT /clientes/:id`: Atualiza dados de um cliente.
- `DELETE /clientes/:id`: Remove um cliente.

### Vendas
- `GET /vendas`: Lista o histórico de vendas.
- `POST /vendas`: Registra uma nova venda.
- `DELETE /vendas/:id`: Estorna/Remove uma venda.

## 🧪 Testes
Para rodar a suíte de testes do sistema:
```bash
npm test
```

---
*Este README é focado na parte inicial do Back-end. O Front-end será integrado futuramente.*
