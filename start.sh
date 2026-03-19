#!/bin/bash
set -e  # Выход при любой ошибке

echo "🚀 Running database migrations..."

# Запускаем миграции через python -m (гарантированно найдёт alembic)
python -m alembic upgrade head

echo "✅ Migrations completed. Starting server..."

# Запускаем приложение (exec заменяет процесс, чтобы правильно обрабатывать сигналы)
exec python -m uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"