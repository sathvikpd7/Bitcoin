from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.alert import Alert
from app.utils.validators import AlertRequest

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.post("")
async def create_alert(request: AlertRequest, db: Session = Depends(get_db)):
    """
    Create a new alert
    """
    try:
        alert = Alert(
            type=request.type,
            operator=request.operator,
            value=request.value,
            active=request.active
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return {
            "id": alert.id,
            "type": alert.type,
            "operator": alert.operator,
            "value": alert.value,
            "active": alert.active,
            "created_at": alert.created_at.isoformat() if alert.created_at else None
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_alerts(db: Session = Depends(get_db)):
    """
    Get all alerts
    """
    try:
        alerts = db.query(Alert).all()
        return [
            {
                "id": alert.id,
                "type": alert.type,
                "operator": alert.operator,
                "value": alert.value,
                "active": alert.active,
                "created_at": alert.created_at.isoformat() if alert.created_at else None
            }
            for alert in alerts
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{alert_id}/toggle")
async def toggle_alert(alert_id: int, db: Session = Depends(get_db)):
    """
    Toggle alert active status
    """
    try:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        alert.active = not alert.active
        db.commit()
        db.refresh(alert)
        return {
            "id": alert.id,
            "active": alert.active
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{alert_id}")
async def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    """
    Delete an alert
    """
    try:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        db.delete(alert)
        db.commit()
        return {"message": "Alert deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

