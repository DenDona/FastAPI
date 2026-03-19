import asyncio
import os
import sys
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context
print("🚀 Alembic env.py loaded", file=sys.stderr)
print(f"🔍 DATABASE_URL from env: {'SET' if os.getenv('DATABASE_URL') else 'NOT SET'}", file=sys.stderr)

from app.models.base import Base
from app.models.room import Room
from app.models.booking import Booking

target_metadata = Base.metadata

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not set in environment variables")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

print(f"✅ Using DATABASE_URL with asyncpg driver", file=sys.stderr)

def run_migrations_offline():
    """Run migrations in 'offline' mode (no DB connection)."""
    print("🔄 Running offline migrations", file=sys.stderr)
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection):
    """Configure context and run migrations."""
    print(f"📋 Target metadata tables: {target_metadata.tables.keys()}", file=sys.stderr)
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        print("🔧 Running migrations...", file=sys.stderr)
        context.run_migrations()
        print("✅ Migrations completed", file=sys.stderr)

async def run_async_migrations():
    """Run migrations using async engine."""
    print("🔌 Creating async engine...", file=sys.stderr)
    connectable = create_async_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
        echo=True,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()
    print("🔌 Engine disposed", file=sys.stderr)

def run_migrations_online():
    """Run migrations in 'online' mode."""
    print("🌐 Running online migrations", file=sys.stderr)
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
