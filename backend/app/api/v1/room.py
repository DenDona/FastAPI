from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.models import Room
from app.schemas import RoomCreate, RoomResponse
from app.database.session import get_db
from app.crud import create_room, get_room_by_id

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.post(
    "",
    response_model=RoomResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать переговорную комнату"
)
async def create_new_room(
    room: RoomCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_room(db, room)

@router.get(
    "/{room_id}",
    response_model=RoomResponse,
    summary="Получить комнату по ID"
)
async def read_room_detail(
    room_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await get_room_by_id(db, room_id)

@router.get(
    "",
    response_model=List[RoomResponse],
    summary="Получить список комнат с фильтрацией"
)
async def read_rooms(
    min_capacity: Optional[int] = Query(None, ge=1),
    has_projector: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Room)

    if min_capacity is not None:
        query = query.where(Room.capacity >= min_capacity)
    if has_projector is not None:
        query = query.where(Room.has_projector == has_projector)

    result = await db.execute(query)
    rooms = result.scalars().all()
    return rooms