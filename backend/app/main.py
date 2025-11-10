from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routes import predict, backtesting, data, alerts, model

# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Bitcoin Price Predictor API with ML-powered predictions"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router)
app.include_router(backtesting.router)
app.include_router(data.router)
app.include_router(alerts.router)
app.include_router(model.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("Database initialized")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bitcoin Price Predictor API",
        "version": settings.API_VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.API_PORT)

