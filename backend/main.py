import datetime
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI
from app.api.v1.room import router as rooms_router
from app.api.v1.booking import router as booking_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fastapi-front.onrender.com",  # Твой фронтенд
        "http://localhost:5173",  # Для локальной разработки (Vite)
        "http://localhost:3000",  # Для локальной разработки (Create React App)
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, PUT, DELETE...)
    allow_headers=["*"],  # Разрешить все заголовки
)
app.include_router(rooms_router)
app.include_router(booking_router)


@app.on_event("startup")
async def startup_db():
    """Создаёт таблицы при старте (только для первой настройки!)."""
    from app.database.session import engine
    from app.models.base import Base

    # Для async engine нужно получить sync engine
    sync_engine = engine.sync_engine

    # Создаём все таблицы
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created")


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
