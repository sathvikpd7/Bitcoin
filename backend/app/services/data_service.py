import requests
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from app.models.ohlc_data import OHLCData
from app.config import settings

class DataService:
    def __init__(self):
        self.api_url = settings.COINGECKO_API_URL
    
    def fetch_bitcoin_data(self, days: int = 365) -> List[Dict]:
        """Fetch Bitcoin historical data from CoinGecko API"""
        try:
            url = f"{self.api_url}/coins/bitcoin/market_chart"
            params = {
                "vs_currency": "usd",
                "days": days,
                "interval": "daily"
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Convert to OHLC format
            ohlc_data = []
            prices = data.get("prices", [])
            
            for i, price_point in enumerate(prices):
                timestamp, price = price_point
                date = datetime.fromtimestamp(timestamp / 1000).date()
                
                # CoinGecko provides close prices, we'll use same for OHLC
                # In production, you'd fetch actual OHLC from a different API
                ohlc_data.append({
                    "date": date.isoformat(),
                    "open": price,
                    "high": price * 1.02,  # Approximate
                    "low": price * 0.98,   # Approximate
                    "close": price,
                    "volume": 0
                })
            
            return ohlc_data
        except Exception as e:
            print(f"Error fetching Bitcoin data: {e}")
            return []
    
    def save_ohlc_data(self, db: Session, ohlc_data: List[Dict]) -> int:
        """Save OHLC data to database"""
        saved_count = 0
        for data in ohlc_data:
            try:
                date = datetime.fromisoformat(data["date"]).date()
                existing = db.query(OHLCData).filter(OHLCData.date == date).first()
                
                if not existing:
                    ohlc = OHLCData(
                        date=date,
                        open=data["open"],
                        high=data["high"],
                        low=data["low"],
                        close=data["close"],
                        volume=data.get("volume", 0)
                    )
                    db.add(ohlc)
                    saved_count += 1
                else:
                    # Update existing record
                    existing.open = data["open"]
                    existing.high = data["high"]
                    existing.low = data["low"]
                    existing.close = data["close"]
                    if "volume" in data:
                        existing.volume = data["volume"]
                
            except Exception as e:
                print(f"Error saving OHLC data: {e}")
                continue
        
        db.commit()
        return saved_count
    
    def get_ohlc_data(
        self,
        db: Session,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict]:
        """Get OHLC data from database"""
        query = db.query(OHLCData)
        
        if start_date:
            query = query.filter(OHLCData.date >= datetime.fromisoformat(start_date).date())
        if end_date:
            query = query.filter(OHLCData.date <= datetime.fromisoformat(end_date).date())
        
        query = query.order_by(OHLCData.date.desc())
        query = query.offset(offset).limit(limit)
        
        results = query.all()
        return [item.to_dict() for item in results]
    
    def get_latest_price(self, db: Session) -> Optional[Dict]:
        """Get latest Bitcoin price"""
        latest = db.query(OHLCData).order_by(OHLCData.date.desc()).first()
        if latest:
            return latest.to_dict()
        return None

# Singleton instance
data_service = DataService()

