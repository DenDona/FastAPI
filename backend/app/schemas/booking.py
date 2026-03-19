from fastapi import HTTPException
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime, timezone

class BookingCreate(BaseModel):
    room_id: int
    title: str = Field(..., min_length=1, max_length=200)
    start_time: datetime
    end_time: datetime

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_timezone(cls, date: datetime) -> datetime:
        if date.tzinfo is None:
            return date.replace(tzinfo=timezone.utc)
        return date.astimezone(timezone.utc)

    @field_validator("end_time")
    @classmethod
    def validate_time_range(cls, date: datetime, info):
        start_time = info.data.get("start_time")
        if start_time and date <= start_time:
            raise ValueError("end_time must be later than start_time")
        return date

    @field_validator("start_time")
    @classmethod
    def validate_not_in_past(cls, date: datetime):
        now = datetime.now(timezone.utc)
        if date <= now:
            raise HTTPException(
                status_code=400,
                detail="start_time must be earlier than end_time"
            )
        return date

class BookingResponse(BaseModel):
    id: int
    room_id: int
    title: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)