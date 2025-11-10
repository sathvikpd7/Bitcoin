from fastapi import APIRouter
from app.services.ml_service import ml_service

router = APIRouter(prefix="/api/model", tags=["model"])

@router.get("/metrics")
async def get_model_metrics():
    """
    Get ML model performance metrics
    """
    try:
        metrics = ml_service.get_model_metrics()
        return metrics
    except Exception as e:
        return {
            "error": str(e),
            "trainingAccuracy": 0.0,
            "validationAccuracy": 0.0,
            "dataPoints": 0,
            "features": 0
        }

