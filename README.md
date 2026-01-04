
# Passo a Passo para Rodar a Aplicação

## Passo 1: Rodando Localmente

### 1.1. Instalando as Dependências

Para rodar a aplicação localmente sem Docker, você precisa do Python 3.13, Poetry e PostgreSQL.

#### Instalar Python:

Certifique-se de que o Python 3.13 está instalado em sua máquina.

[Baixe o Python aqui](https://www.python.org/downloads/).

#### Instalar PostgreSQL:

Certifique-se de que o PostgreSQL esteja instalado em sua máquina.

[Baixe o PostgreSQL aqui](https://www.postgresql.org/download/).

#### Instalar o Poetry:

O Poetry é um gerenciador de dependências para Python. Instale-o executando:

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

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

### 1.3. Instalar as Dependências do Projeto

Com o ambiente virtual ativado, instale as dependências do projeto utilizando o Poetry:

```bash
# Instalar as dependências do projeto
poetry install
```

### 1.4. Configuração do Banco de Dados PostgreSQL

1. **Crie o banco de dados PostgreSQL:**

No PostgreSQL, crie o banco de dados:

```bash
psql -U postgres
CREATE DATABASE raven_db;
```

2. **Configuração do arquivo `.env.dev`:**

Crie o arquivo `.env.dev` na raiz do projeto com as seguintes configurações:

```ini
DEBUG=
SECRET_KEY=
DJANGO_ALLOWED_HOSTS=
SQL_ENGINE=
SQL_DATABASE=
SQL_USER=
SQL_PASSWORD=
SQL_HOST=
SQL_PORT=
```

### 1.5. Rodar as Migrações

Depois de configurar o banco de dados, rode as migrações:

```bash
python manage.py migrate
```

### 1.6. Rodar o Servidor

Para rodar a aplicação localmente:

```bash
python manage.py runserver
```

Agora, a aplicação estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Passo 2: Rodando com Docker

### 2.1. Criar o Arquivo `.env.dev` (Variáveis de Ambiente)

Crie o arquivo `.env.dev` com as variáveis de ambiente para o banco de dados.

```ini
DEBUG=
SECRET_KEY=
DJANGO_ALLOWED_HOSTS=
SQL_ENGINE=
SQL_DATABASE=
SQL_USER=
SQL_PASSWORD=
SQL_HOST=
SQL_PORT=
```

### 2.2. Subir os Contêineres com Docker Compose

Na raiz do projeto, já deve existir o arquivo `docker-compose.yml`. Ele define dois serviços:

- **web**: O serviço que vai rodar o Django.
- **db**: O serviço que vai rodar o PostgreSQL.

Execute o seguinte comando para construir e rodar os contêineres:

```bash
docker-compose up --build
```

### 2.3. Rodar as Migrações no Docker

Depois que os containers estiverem rodando, você precisará rodar as migrações dentro do container `web` para criar as tabelas no banco de dados PostgreSQL:

```bash
docker-compose exec web python manage.py migrate
```

### 2.4. Acessar a Aplicação

Agora, sua aplicação Django estará rodando no Docker, acessível em [http://localhost:8000](http://localhost:8000).

### 2.5. Parar os Contêineres

Para parar os contêineres Docker, use:

```bash
docker-compose down
```

