# Passo a Passo para Rodar a Aplicação (Backend + Frontend)

Este projeto possui dois diretórios principais:

- `backend/` → API em **Django** + **PostgreSQL**
- `frontend/` → App em **React + Vite**

> **Observação:** no ambiente de desenvolvimento, o frontend usa **proxy do Vite** para encaminhar requisições para a API em `/api`.

---

## Sumário

- [Estrutura do Projeto](#estrutura-do-projeto)
- [Passo 1: Rodando o Backend Localmente](#passo-1-rodando-o-backend-localmente)
  - [1.1 Instalando Dependências](#11-instalando-dependências)
  - [1.2 Configurar Ambiente Virtual](#12-configurar-ambiente-virtual)
  - [1.3 Instalar Dependências do Projeto](#13-instalar-dependências-do-projeto)
  - [1.4 Configuração do Banco PostgreSQL](#14-configuração-do-banco-postgresql)
  - [1.5 Rodar Migrações](#15-rodar-migrações)
  - [1.6 Rodar o Servidor](#16-rodar-o-servidor)
- [Passo 2: Rodando o Backend com Docker](#passo-2-rodando-o-backend-com-docker)
  - [2.1 Variáveis de Ambiente](#21-variáveis-de-ambiente)
  - [2.2 Subir Contêineres](#22-subir-contêineres)
  - [2.3 Rodar Migrações no Docker](#23-rodar-migrações-no-docker)
  - [2.4 Acessar a Aplicação](#24-acessar-a-aplicação)
  - [2.5 Parar os Contêineres](#25-parar-os-contêineres)
- [Passo 3: Rodando o Frontend (React + Vite)](#passo-3-rodando-o-frontend-react--vite)
  - [3.1 Pré-requisitos](#31-pré-requisitos)
  - [3.2 Instalar Dependências do Frontend](#32-instalar-dependências-do-frontend)
  - [3.3 Proxy para API (já configurado)](#33-proxy-para-api-já-configurado)
  - [3.4 Rodar Frontend em modo Dev](#34-rodar-frontend-em-modo-dev)
  - [3.5 Build/Preview (opcional)](#35-buildpreview-opcional)
- [Rodando Backend + Frontend juntos (cenários comuns)](#rodando-backend--frontend-juntos-cenários-comuns)
- [Troubleshooting](#troubleshooting)

---

## Estrutura do Projeto

```text
.
├── backend/
│   ├── manage.py
│   ├── docker-compose.yml (se aplicável)
│   ├── pyproject.toml
│   └── ...
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── ...
```

---

## Passo 1: Rodando o Backend Localmente

### 1.1. Instalando Dependências

Para rodar o backend localmente (sem Docker), você precisa de:

- **Python 3.13**
- **Poetry**
- **PostgreSQL**

#### Instalar Python

Certifique-se de que o Python 3.13 está instalado em sua máquina.

- https://www.python.org/downloads/

#### Instalar PostgreSQL

Certifique-se de que o PostgreSQL esteja instalado em sua máquina.

- https://www.postgresql.org/download/

#### Instalar o Poetry

O Poetry é um gerenciador de dependências para Python. Instale-o executando:

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

> Dica: após instalar, pode ser necessário reabrir o terminal para o `poetry` ficar disponível no PATH.

### 1.2. Configurar o Ambiente Virtual

Crie e ative um ambiente virtual:

```bash
# Criar um ambiente virtual
python3 -m venv env

# Ativar o ambiente virtual (Linux/Mac)
source env/bin/activate

# Ativar o ambiente virtual (Windows)
env\Scripts\activate
```

> Alternativa (opcional): você também pode usar `poetry shell` para entrar no ambiente virtual do Poetry.

### 1.3. Instalar as Dependências do Projeto

Entre no diretório do backend e instale as dependências com Poetry:

```bash
cd backend
poetry install
```

### 1.4. Configuração do Banco de Dados PostgreSQL

#### 1) Crie o banco no PostgreSQL

Exemplo criando um banco chamado `raven_db`:

```bash
psql -U postgres
CREATE DATABASE raven_db;
```

#### 2) Configure o arquivo `.env.dev`

Crie o arquivo `env.dev` na raiz do **backend** (`backend/env.dev`) com as configurações do projeto.

Você pode manter em branco e preencher manualmente, ou usar o exemplo abaixo como base:

```ini
# backend/.env.dev

DEBUG=1
SECRET_KEY=changeme-in-dev
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=raven_db
SQL_USER=postgres
SQL_PASSWORD=postgres
SQL_HOST=localhost
SQL_PORT=5432
```

> Ajuste `SQL_USER` / `SQL_PASSWORD` conforme o seu PostgreSQL local.

### 1.5. Rodar as Migrações

Com o banco configurado, rode as migrações:

```bash
cd backend
poetry run python manage.py migrate
```

> Se você estiver com o ambiente virtual ativado e preferir, pode rodar `python manage.py migrate` diretamente.

### 1.6. Rodar o Servidor

Para rodar a aplicação localmente:

```bash
cd backend
poetry run python manage.py runserver
```

Agora, o backend estará disponível em:

- http://127.0.0.1:8000

---

## Passo 2: Rodando o Backend com Docker

> Estes passos assumem que existe um `docker-compose.yml` (normalmente em `backend/` ou na raiz do projeto) com serviços `web` e `db`.

### 2.1. Variáveis de Ambiente

Crie o arquivo `env.dev` (se ainda não existir) com as variáveis de ambiente do banco.

Exemplo:

```ini
# backend/env.dev (ou ./env.dev, dependendo do seu docker-compose)

DEBUG=1
SECRET_KEY=changeme-in-dev
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=raven_db
SQL_USER=postgres
SQL_PASSWORD=postgres
SQL_HOST=db
SQL_PORT=5432
```

> Em Docker, o `SQL_HOST` normalmente é o nome do serviço do banco no compose (ex: `db`).

### 2.2. Subir os Contêineres

Na pasta onde está o `docker-compose.yml`, execute:

```bash
docker-compose up --build
```

### 2.3. Rodar Migrações no Docker

Com os containers rodando, aplique as migrações dentro do container `web`:

```bash
docker-compose exec web python manage.py migrate
```

### 2.4. Acessar a Aplicação

Agora, o backend estará disponível em:

- http://localhost:8000

### 2.5. Parar os Contêineres

Para parar os contêineres:

```bash
docker-compose down
```

---

## Passo 3: Rodando o Frontend (React + Vite)

> **Pré-requisito:** o backend precisa estar rodando (localmente ou via Docker), porque o frontend consome a API em `/api`.

### 3.1. Pré-requisitos

- **Node.js** (recomendado: versão LTS recente)
- **npm** (ou `yarn`/`pnpm`)

### 3.2. Instalar Dependências do Frontend

Entre no diretório `frontend` e instale as dependências:

```bash
cd frontend
npm install
```

### 3.3. Proxy para API (já configurado)

O `vite.config.ts` está configurado para encaminhar chamadas para `/api` ao backend em `http://127.0.0.1:8000`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
});
```

✅ Isso permite que o frontend faça chamadas assim:

- `fetch('/api/users/token/')`

…e o Vite redireciona para:

- `http://127.0.0.1:8000/api/users/token/`

> Se seu backend estiver em outro host/porta, ajuste o proxy em `vite.config.ts`.

### 3.4. Rodar Frontend em modo Dev

```bash
cd frontend
npm run dev
```

Por padrão, o Vite sobe em:

- http://localhost:5173

### 3.5. Build/Preview (opcional)

Gerar build de produção:

```bash
npm run build
```

Visualizar o build localmente:

```bash
npm run preview
```

---

## Rodando Backend + Frontend juntos (cenários comuns)

### Cenário A: Backend local + Frontend local

1) Suba o backend:

```bash
cd backend
poetry run python manage.py runserver
```

2) Suba o frontend:

```bash
cd frontend
npm run dev
```

- Backend: http://127.0.0.1:8000  
- Frontend: http://localhost:5173

### Cenário B: Backend no Docker + Frontend local

1) Suba o backend via Docker:

```bash
# rode no diretório onde está o docker-compose.yml
docker-compose up --build
```

2) Migrações:

```bash
docker-compose exec web python manage.py migrate
```

3) Suba o frontend localmente:

```bash
cd frontend
npm install
npm run dev
```

---

## Troubleshooting

### Frontend não consegue acessar `/api`

- Confirme se o backend está rodando em `http://127.0.0.1:8000` (ou ajuste o proxy do Vite).
- Confirme que suas rotas de API começam com `/api`.

### CORS

No desenvolvimento, o proxy do Vite geralmente evita problemas de CORS, porque o navegador fala com `localhost:5173` e o Vite encaminha para o backend.

### Token/login

O token é armazenado em `localStorage` (`authToken`). Se algo ficar “preso”, tente:

- Limpar `localStorage` no navegador
- Recarregar a página
- Refazer login

---

### Comandos úteis (Frontend)

```bash
npm run lint
npm run build
npm run preview
```
