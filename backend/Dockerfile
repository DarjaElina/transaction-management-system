FROM python:3.11

WORKDIR /backend

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

RUN chmod +x scripts/start.sh

CMD ["scripts/start.sh"]
