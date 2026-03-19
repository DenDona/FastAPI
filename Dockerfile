FROM python:3.13-slim

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Копируем скрипт запуска и делаем его исполняемым
COPY start.sh .
RUN chmod +x start.sh

# Запускаем скрипт (CMD переопределяется в Render, если нужно)
CMD ["./start.sh"]