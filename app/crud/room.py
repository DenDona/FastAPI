from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models import Room
from app.schemas import RoomCreate

async def create_room(session: AsyncSession, room_in: RoomCreate) -> Room:
    room = Room(**room_in.model_dump())
    session.add(room)
    try:
        await session.commit()
        await session.refresh(room)
    except IntegrityError as e:
        await session.rollback()
        if "unique constraint" in str(e.orig):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Комната с таким именем уже существует"
            )
        raise
    return room

async def get_room_list(session: AsyncSession) -> list[Room]:
    result = await session.execute(select(Room))
    return list(result.scalars().all())

async def get_room_by_id(session: AsyncSession, room_id: int) -> Room:
    result = await session.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    return room