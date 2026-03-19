import os
import sys
from logging.config import fileConfig

from sqlalchemy import create_engine, pool
from alembic import context

print("🚀 Alembic env.py loaded (sync for migrations)", file=sys.stderr)
print(f"🔍 DATABASE_URL from env: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}", file=sys.stderr)

from app.models.base import Base
from app.models.room import Room
from app.models.booking import Booking

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Получаем DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not set")

# 🔧 Конвертируем в формат для psycopg2
if DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Добавляем SSL
if "?" not in DATABASE_URL:
    DATABASE_URL += "?sslmode=require"
else:
    DATABASE_URL += "&sslmode=require"

print(f"✅ Using psycopg2 + SSL for migrations", file=sys.stderr)


def run_migrations_offline():
    context.configure(url=DATABASE_URL, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    print("🌐 Running online migrations (sync)", file=sys.stderr)

    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
        echo=True,
        connect_args={"sslmode": "require", "connect_timeout": 30},
        isolation_level="AUTOCOMMIT"  # 🔥 Важно для DDL
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,
        )
        print("🔧 Running migrations...", file=sys.stderr)
        context.run_migrations()
        print("✅ Migrations completed", file=sys.stderr)


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()