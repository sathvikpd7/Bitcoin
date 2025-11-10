from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.services.data_service import data_service

router = APIRouter(prefix="/api/data", tags=["data"])

@router.get("/ohlc")
async def get_ohlc_data(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Get OHLC historical data
    """
    try:
        data = data_service.get_ohlc_data(
            db=db,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
            offset=offset
        )
        return {
            "data": data,
            "count": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/latest")
async def get_latest_price(db: Session = Depends(get_db)):
    """
    Get latest Bitcoin price
    """
    try:
        latest = data_service.get_latest_price(db)
        if not latest:
            raise HTTPException(status_code=404, detail="No price data available")
        return latest
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync")
async def sync_bitcoin_data(days: int = Query(365, ge=1, le=3650), db: Session = Depends(get_db)):
    """
    Sync Bitcoin data from external API
    """
    try:
        data = data_service.fetch_bitcoin_data(days=days)
        if not data:
            raise HTTPException(status_code=500, detail="Failed to fetch data from external API")
        
        saved_count = data_service.save_ohlc_data(db, data)
        return {
            "message": f"Synced {saved_count} records",
            "total_fetched": len(data)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

