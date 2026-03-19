import datetime
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI
from app.api.v1.room import router as rooms_router
from app.api.v1.booking import router as booking_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://my-app-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(rooms_router)
app.include_router(booking_router)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
