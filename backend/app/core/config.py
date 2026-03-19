from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, computed_field


class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str

    DATABASE_URL: PostgresDsn | None = None

    @computed_field
    @property
    def effective_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://") or url.startswith("postgresql://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url

    class Config:
        env_file = ".env"


settings = Settings()
