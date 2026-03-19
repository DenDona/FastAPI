from datetime import timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models import Booking, Room
from app.schemas import BookingCreate

async def create_booking(session: AsyncSession, booking_in: BookingCreate) -> Booking:
    room_result = await session.execute(select(Room).where(Room.id == booking_in.room_id))
    room = room_result.scalar_one_or_none()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Комната не найдена"
        )

    existing = await session.execute(
        select(Booking).where(
            and_(
                Booking.room_id == booking_in.room_id,
                Booking.start_time < booking_in.end_time,
                Booking.end_time > booking_in.start_time
            )
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Room is already booked for the selected time range"
        )

    booking = Booking(**booking_in.model_dump())
    session.add(booking)
    await session.commit()
    await session.refresh(booking)
    return booking

async def get_booking_list(
    session: AsyncSession,
    room_id: int | None = None,
    date: str | None = None
) -> list[Booking]:
    query = select(Booking)

    if room_id is not None:
        query = query.where(Booking.room_id == room_id)

    if date is not None:
        from datetime import datetime, time
        try:
            target_date = datetime.fromisoformat(date).date()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный формат времени, используй YYYY-MM-DD"
            )
        start_of_day = datetime.combine(target_date, time.min, tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, time.max, tzinfo=timezone.utc)
        query = query.where(
            and_(
                Booking.end_time > start_of_day,
                Booking.start_time < end_of_day
            )
        )

    result = await session.execute(query)
    return list(result.scalars().all())

async def get_booking_by_id(session: AsyncSession, booking_id: int) -> Booking:
    result = await session.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бронирование не найдено"
        )
    return booking