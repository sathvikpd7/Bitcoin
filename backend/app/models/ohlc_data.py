from sqlalchemy import Column, Integer, Float, Date, DateTime
from sqlalchemy.sql import func
from app.database import Base

class OHLCData(Base):
    __tablename__ = "ohlc_data"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True, index=True)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "date": self.date.isoformat() if self.date else None,
            "open": self.open,
            "high": self.high,
            "low": self.low,
            "close": self.close,
            "volume": self.volume
        }

