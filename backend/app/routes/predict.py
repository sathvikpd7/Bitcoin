from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.utils.validators import PredictionRequest
from app.services.ml_service import ml_service
from app.database import get_db

router = APIRouter(prefix="/api/predict", tags=["prediction"])

@router.post("")
async def predict_price(request: PredictionRequest, db: Session = Depends(get_db)):
    """
    Predict Bitcoin's next closing price based on OHLC data
    """
    try:
        # Validate input values
        if not all([request.open > 0, request.high > 0, request.low > 0, request.close > 0]):
            raise HTTPException(status_code=400, detail="All prices must be positive")
        
        if request.high <= request.low:
            raise HTTPException(status_code=400, detail="High price must be greater than low price")
        
        prediction = ml_service.predict(
            open=request.open,
            high=request.high,
            low=request.low,
            close=request.close,
            db=db
        )
        
        if not prediction:
            raise HTTPException(status_code=500, detail="Prediction service returned empty result")
        
        metrics = ml_service.get_model_metrics()
        
        return {
            "prediction": prediction,
            "metrics": metrics
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in predict_price: {e}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

