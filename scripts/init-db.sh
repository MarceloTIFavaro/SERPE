#!/usr/bin/env bash
# init-db.sh — Wait for PostgreSQL to be ready, then execute BD/init.sql.
# Uses the DB_* environment variables set by Railway (or PG* as fallbacks).

set -euo pipefail

# ---------------------------------------------------------------------------
# Resolve connection variables.
# Railway exposes PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE natively.
# The application also accepts DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME.
# We prefer the DB_* form so this script stays consistent with the app config.
# ---------------------------------------------------------------------------
DB_HOST="${DB_HOST:-${PGHOST:-localhost}}"
DB_PORT="${DB_PORT:-${PGPORT:-5432}}"
DB_USER="${DB_USER:-${PGUSER:-postgres}}"
DB_PASSWORD="${DB_PASSWORD:-${PGPASSWORD:-}}"
DB_NAME="${DB_NAME:-${PGDATABASE:-postgres}}"

export PGPASSWORD="$DB_PASSWORD"

SQL_FILE="$(dirname "$0")/../BD/init.sql"

# ---------------------------------------------------------------------------
# Wait for PostgreSQL to accept connections (up to 60 seconds).
# ---------------------------------------------------------------------------
echo "Aguardando o PostgreSQL ficar disponível em ${DB_HOST}:${DB_PORT}..."

MAX_RETRIES=30
RETRY_INTERVAL=2
attempt=0

until psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$MAX_RETRIES" ]; then
    echo "ERRO: PostgreSQL não respondeu após $((MAX_RETRIES * RETRY_INTERVAL)) segundos. Abortando." >&2
    exit 1
  fi
  echo "  Tentativa ${attempt}/${MAX_RETRIES} — aguardando ${RETRY_INTERVAL}s..."
  sleep "$RETRY_INTERVAL"
done

echo "PostgreSQL disponível ✔"

# ---------------------------------------------------------------------------
# Execute the initialisation SQL file.
# ---------------------------------------------------------------------------
if [ ! -f "$SQL_FILE" ]; then
  echo "ERRO: Arquivo SQL não encontrado: ${SQL_FILE}" >&2
  exit 1
fi

echo "Executando ${SQL_FILE}..."

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"; then
  echo "Schema e dados iniciais carregados com sucesso ✔"
else
  echo "ERRO: Falha ao executar ${SQL_FILE}." >&2
  exit 1
fi
