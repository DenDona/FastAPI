# Room Booking API

REST API для управления переговорными комнатами и их бронированием.  
Построено на FastAPI + PostgreSQL с асинхронной архитектурой.

---

## 🚀 Возможности

- Создание и управление переговорными комнатами
- Бронирование комнат на заданное время
- Проверка пересечений бронирований
- Валидация данных (вместимость > 0, время в будущем и т.д.)

---

## 🛠️ Технологии

- **Backend**: FastAPI 0.115+
- **База данных**: PostgreSQL 17
- **ORM**: SQLAlchemy 2.0+ (асинхронный)
- **Миграции**: Alembic
- **Асинхронность**: async/await, asyncpg
- **Контейнеризация**: Docker, Docker Compose

---

## 📦 Установка и запуск

### Требования

- Docker и Docker Compose
- Python 3.13+

### Запуск в Docker (рекомендуется)

```bash
# Сборка и запуск
docker-compose up --build

# Применение миграций (при первом запуске)
docker-compose run --rm web alembic upgrade head
```

После запуска API будет доступно по адресу:  
👉 http://localhost:8000

Документация Swagger UI:  
👉 http://localhost:8000/docs

---

---
## 📂 Структура проекта

```
.
├── app/
│   ├── api/             # Эндпоинты
│   ├── core/            # Настройки
│   ├── crud/            # Операции с БД
│   ├── database/        # Подключение к БД
│   ├── models/          # Модели SQLAlchemy
│   └── schemas/         # Pydantic-схемы
├── alembic/             # Миграции
├── docker-compose.yml   # Конфигурация Docker
├── Dockerfile           # Сборка образа
├── requirements.txt     # Зависимости
└── README.md
```
---

## 🙌 Автор

Имя автора: Данила Чернов