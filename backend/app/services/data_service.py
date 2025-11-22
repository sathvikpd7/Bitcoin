import requests
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
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
        """Save OHLC data to database (upsert - insert or update)"""
        saved_count = 0
        updated_count = 0
        error_count = 0
        
        # Process records in batches to avoid transaction issues
        batch_size = 50
        for i in range(0, len(ohlc_data), batch_size):
            batch = ohlc_data[i:i + batch_size]
            for data in batch:
                try:
                    date = datetime.fromisoformat(data["date"]).date()
                    
                    # Try to get existing record
                    existing = db.query(OHLCData).filter(OHLCData.date == date).first()
                    
                    if existing:
                        # Update existing record
                        existing.open = data["open"]
                        existing.high = data["high"]
                        existing.low = data["low"]
                        existing.close = data["close"]
                        if "volume" in data:
                            existing.volume = data["volume"]
                        updated_count += 1
                    else:
                        # Insert new record
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
                
                except IntegrityError as ie:
                    # Handle unique constraint violation
                    db.rollback()
                    try:
                        # Record was added between check and insert, update it instead
                        existing = db.query(OHLCData).filter(OHLCData.date == date).first()
                        if existing:
                            existing.open = data["open"]
                            existing.high = data["high"]
                            existing.low = data["low"]
                            existing.close = data["close"]
                            if "volume" in data:
                                existing.volume = data["volume"]
                            updated_count += 1
                        else:
                            error_count += 1
                            print(f"Could not save or update record for date {date}: {ie}")
                    except Exception as update_error:
                        error_count += 1
                        print(f"Error updating record for date {date}: {update_error}")
                
                except Exception as e:
                    error_count += 1
                    print(f"Error saving OHLC data for date {data.get('date', 'unknown')}: {e}")
                    db.rollback()
            
            # Commit batch
            try:
                db.commit()
            except IntegrityError as commit_ie:
                db.rollback()
                # If batch commit fails, try individual commits for this batch
                for data in batch:
                    try:
                        date = datetime.fromisoformat(data["date"]).date()
                        existing = db.query(OHLCData).filter(OHLCData.date == date).first()
                        if existing:
                            existing.open = data["open"]
                            existing.high = data["high"]
                            existing.low = data["low"]
                            existing.close = data["close"]
                            if "volume" in data:
                                existing.volume = data["volume"]
                        else:
                            ohlc = OHLCData(
                                date=date,
                                open=data["open"],
                                high=data["high"],
                                low=data["low"],
                                close=data["close"],
                                volume=data.get("volume", 0)
                            )
                            db.add(ohlc)
                        db.commit()
                    except IntegrityError:
                        # Record already exists, update it
                        db.rollback()
                        try:
                            existing = db.query(OHLCData).filter(OHLCData.date == date).first()
                            if existing:
                                existing.open = data["open"]
                                existing.high = data["high"]
                                existing.low = data["low"]
                                existing.close = data["close"]
                                if "volume" in data:
                                    existing.volume = data["volume"]
                                db.commit()
                        except Exception:
                            db.rollback()
                            error_count += 1
                    except Exception:
                        db.rollback()
                        error_count += 1
            except Exception as commit_error:
                print(f"Error committing batch: {commit_error}")
                db.rollback()
                error_count += len(batch)
        
        if error_count > 0:
            print(f"Warning: {error_count} records failed to save")
        
        return saved_count + updated_count
    
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

