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
    def effective_database_url(self) -> PostgresDsn:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"


settings = Settings()
