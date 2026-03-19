#!/bin/bash
set -e

echo "🚀 Running migrations..."
# Миграции через sync-драйвер (env.py сам конвертирует URL)
python -m alembic upgrade head

echo "✅ Migrations done. Starting server..."
exec python -m uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"