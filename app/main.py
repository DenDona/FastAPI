import datetime

import uvicorn
from fastapi import FastAPI
from app.api.v1.room import router as rooms_router
from app.api.v1.booking import router as booking_router

app = FastAPI()
app.include_router(rooms_router)
app.include_router(booking_router)


@app.get("/")
def hello_index():
    return {"message": "Hello index!"}

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)