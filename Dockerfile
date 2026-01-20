FROM python:3.13-slim

WORKDIR /app

# Копируем ВСЁ из корня проекта в /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]