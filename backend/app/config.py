from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "Transaction Management System"
    database_url: str = Field(default=...)
    environment: str = "development"
    secret_key: SecretStr = Field(default=...)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: SecretStr = Field(default=...)
    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
