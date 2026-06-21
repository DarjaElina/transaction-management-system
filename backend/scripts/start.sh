#!/bin/sh

alembic upgrade head

exec fastapi run app/main.py --port 8000
