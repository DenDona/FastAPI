from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from backend.app.core.config import settings

engine = create_async_engine(
    url=str(settings.effective_database_url),
    echo=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session