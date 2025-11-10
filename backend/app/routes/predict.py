from fastapi import APIRouter, HTTPException
from app.utils.validators import PredictionRequest
from app.services.ml_service import ml_service

router = APIRouter(prefix="/api/predict", tags=["prediction"])

@router.post("")
async def predict_price(request: PredictionRequest):
    """
    Predict Bitcoin's next closing price based on OHLC data
    """
    try:
        prediction = ml_service.predict(
            open=request.open,
            high=request.high,
            low=request.low,
            close=request.close
        )
        
        metrics = ml_service.get_model_metrics()
        
        return {
            "prediction": prediction,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

