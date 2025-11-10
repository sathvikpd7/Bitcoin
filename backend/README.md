# Bitcoin Price Predictor - Backend API

FastAPI backend for Bitcoin price prediction with ML integration.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Run the server:
```bash
python -m app.main
```

Or with uvicorn:
```bash
uvicorn app.main:app --reload --port 5000
```

## API Endpoints

### Prediction
- `POST /api/predict` - Predict Bitcoin price from OHLC data

### Backtesting
- `POST /api/backtest` - Run backtesting simulation

### Data
- `GET /api/data/ohlc` - Get historical OHLC data
- `GET /api/data/latest` - Get latest Bitcoin price
- `POST /api/data/sync` - Sync Bitcoin data from external API

### Alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts` - Get all alerts
- `PUT /api/alerts/{id}/toggle` - Toggle alert
- `DELETE /api/alerts/{id}` - Delete alert

### Model
- `GET /api/model/metrics` - Get model metrics

## API Documentation

Visit `http://localhost:5000/docs` for interactive API documentation.

## Database

The application uses SQLite by default. To use PostgreSQL, update `DATABASE_URL` in `.env`.

## ML Model

The backend expects a trained model at `../ml/models/trained_model.pkl`. If not found, it uses a fallback prediction algorithm.

