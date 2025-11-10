from typing import Dict, Optional
from pydantic import BaseModel, validator

class PredictionRequest(BaseModel):
    open: float
    high: float
    low: float
    close: float
    
    @validator('high')
    def high_must_be_greater_than_low(cls, v, values):
        if 'low' in values and v <= values['low']:
            raise ValueError('High price must be greater than low price')
        return v
    
    @validator('open', 'high', 'low', 'close')
    def prices_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('All prices must be positive')
        return v
    
    @validator('open', 'close')
    def prices_within_range(cls, v, values):
        if 'high' in values and 'low' in values:
            if v > values['high'] or v < values['low']:
                raise ValueError('Open and close prices must be within high-low range')
        return v

class BacktestRequest(BaseModel):
    start_date: str
    end_date: str
    strategy: str = "directional"
    starting_cash: float = 10000.0
    
    @validator('starting_cash')
    def cash_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Starting cash must be positive')
        return v

class AlertRequest(BaseModel):
    type: str
    operator: str
    value: float
    active: bool = True

