from typing import Annotated
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class RoomCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    capacity: Annotated[int, Field(gt=0, description="Вместимость должна быть больше 0")]
    has_projector: bool

class RoomResponse(BaseModel):
    id: int
    name: str
    capacity: int
    has_projector: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)