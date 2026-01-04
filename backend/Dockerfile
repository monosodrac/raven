# Use Python 3.13 slim image as base
FROM python:3.13-slim AS python-base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=2.1.3
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libpq-dev \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

# install poetry
RUN curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
ENV PATH="/root/.local/bin:$PATH"

# install deps
COPY poetry.lock pyproject.toml ./
RUN poetry install --only main --no-interaction --no-ansi

# project
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
