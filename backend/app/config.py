import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # API Settings
    API_TITLE = "Bitcoin Price Predictor API"
    API_VERSION = "1.0.0"
    API_PORT = int(os.getenv("API_PORT", 5000))
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bitcoin.db")
    
    # ML Model
    ML_MODEL_PATH = os.getenv("ML_MODEL_PATH", "../ml/models/trained_model.pkl")
    
    # CORS - Allow multiple origins separated by comma
    cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:4028,http://127.0.0.1:4028")
    CORS_ORIGINS = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    
    # External APIs
    COINGECKO_API_URL = os.getenv("COINGECKO_API_URL", "https://api.coingecko.com/api/v3")
    COINGECKO_API_KEY = os.getenv("COINGECKO_API_KEY", "")
    ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    USE_ALPHA_VANTAGE = os.getenv("USE_ALPHA_VANTAGE", "false").lower() == "true"
    
    # Model Settings
    PREDICTION_CONFIDENCE_THRESHOLD = 0.65
    MAX_PREDICTION_HORIZON_DAYS = 30

settings = Settings()

