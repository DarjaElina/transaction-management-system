## How to run

1. Clone repo
```bash
git clone https://github.com/DarjaElina/transaction-management-system.git
```

2. Go to Backend
```bash
cd backend
```

3. Create virtual environment
```bash
python -m venv .venv
```

4. Activate virtual environment
```bash
source .venv/bin/activate
```

5. Install dependencies
```
pip install -r requirements.txt
```

6. Copy .env template and add environment variables
```bash
cp .env.example .env
```

7. Start PostgreSQL container
```bash
docker compose -f docker-compose.dev.yml up -d
```

8. Run migrations
```bash
alembic upgrade head
```

9. Install pre-commit hooks
```bash
pre-commit install
```

10. Start Backend
```bash
fastapi dev app/main.py
```
