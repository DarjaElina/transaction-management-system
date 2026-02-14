from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Transaction Management System"
    database_url: str
    test_database_url: str | None

    model_config = SettingsConfigDict(env_file=".env")
