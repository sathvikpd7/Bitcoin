from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.validators import BacktestRequest
from app.services.backtest_service import backtest_service

router = APIRouter(prefix="/api/backtest", tags=["backtesting"])

@router.post("")
async def run_backtest(request: BacktestRequest, db: Session = Depends(get_db)):
    """
    Run backtesting simulation
    """
    try:
        results = backtest_service.run_backtest(
            db=db,
            start_date=request.start_date,
            end_date=request.end_date,
            strategy=request.strategy,
            starting_cash=request.starting_cash
        )
        
        if "error" in results:
            raise HTTPException(status_code=400, detail=results["error"])
        
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

