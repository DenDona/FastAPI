from sqlalchemy import Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    room_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    start_time: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    room: Mapped["Room"] = relationship("Room", back_populates="bookings")