from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.crud import (
    create_booking,
    get_booking_list,
    get_booking_by_id
)
from app.schemas import BookingCreate, BookingResponse
from app.database.session import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать бронирование"
)
async def create_new_booking(
    booking: BookingCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_booking(db, booking)

@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
    summary="Получить бронирование по ID"
)
async def read_booking_detail(
    booking_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await get_booking_by_id(db, booking_id)

@router.get(
    "",
    response_model=List[BookingResponse],
    summary="Получить список бронирований с фильтрацией"
)
async def read_bookings(
    room_id: Optional[int] = Query(None, ge=1),
    date: Optional[str] = Query(None, regex=r"^\d{4}-\d{2}-\d{2}$"),
    db: AsyncSession = Depends(get_db)
):
    return await get_booking_list(db, room_id=room_id, date=date)

@router.delete(
    "/{booking_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить бронирование"
)
async def delete_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy.future import select
    from app.models import Booking

    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бронирование не найдено"
        )
    await db.delete(booking)
    await db.commit()
    return