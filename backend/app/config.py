from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Transaction Management System"
    database_url: str

    model_config = SettingsConfigDict(env_file=".env")
