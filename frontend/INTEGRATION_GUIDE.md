# Bitcoin Price Predictor - Integration Guide

This guide explains how the frontend and backend are integrated and how to set up the complete system.

## Project Structure

```
Bitcoin/
├── frontend/              # React frontend (current src/ folder)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── bitcoin-price-predictor/
│   │   │   ├── Backtesting.jsx
│   │   │   ├── DataExplorer.jsx
│   │   │   ├── Alerts.jsx
│   │   │   └── ModelLab.jsx
│   │   └── utils/
│   │       └── api.js
│   └── package.json
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── requirements.txt
│   └── .env
└── ml/                    # ML models (to be created)
    └── models/
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
copy .env.example .env  # Windows
# or
cp .env.example .env  # Linux/Mac
```

5. Start the backend server:
```bash
python run.py
# or
python -m uvicorn app.main:app --reload --port 5000
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the project root (where package.json is):
```bash
cd ..
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Create `.env` file in the root:
```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start the frontend:
```bash
npm start
```

The frontend will run on `http://localhost:4028`

### 3. Configure API Connection

The frontend can connect to the backend in two ways:

#### Option 1: Environment Variable
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:5000
```

#### Option 2: Settings Page
1. Open the app in browser
2. Navigate to Settings page
3. Enter the API Base URL: `http://localhost:5000`
4. Click Save

## API Endpoints

### Prediction
- **POST** `/api/predict`
  - Body: `{ "open": 62500, "high": 63800, "low": 61200, "close": 63200 }`
  - Returns: Prediction and model metrics

### Backtesting
- **POST** `/api/backtest`
  - Body: `{ "start_date": "2024-01-01", "end_date": "2024-12-31", "strategy": "directional", "starting_cash": 10000 }`
  - Returns: Backtest results

### Data
- **GET** `/api/data/ohlc?limit=100&offset=0&start_date=2024-01-01&end_date=2024-12-31`
  - Returns: Historical OHLC data
- **GET** `/api/data/latest`
  - Returns: Latest Bitcoin price
- **POST** `/api/data/sync?days=365`
  - Syncs Bitcoin data from external API

### Alerts
- **GET** `/api/alerts` - Get all alerts
- **POST** `/api/alerts` - Create alert
- **PUT** `/api/alerts/{id}/toggle` - Toggle alert
- **DELETE** `/api/alerts/{id}` - Delete alert

### Model
- **GET** `/api/model/metrics` - Get model performance metrics

## Integration Flow

### Prediction Flow
1. User enters OHLC data in frontend
2. Frontend sends POST request to `/api/predict`
3. Backend validates input
4. Backend calls ML service for prediction
5. ML service returns prediction
6. Backend returns response to frontend
7. Frontend displays results

### Backtesting Flow
1. User selects date range and strategy
2. Frontend sends POST request to `/api/backtest`
3. Backend fetches historical data
4. Backend runs simulation using ML predictions
5. Backend calculates metrics (win rate, Sharpe ratio, etc.)
6. Backend returns results to frontend
7. Frontend displays equity curve and metrics

### Data Sync Flow
1. User clicks sync button (or automatic)
2. Frontend sends POST request to `/api/data/sync`
3. Backend fetches data from CoinGecko API
4. Backend saves data to database
5. Backend returns sync status

## Fallback Behavior

The frontend is designed to work even if the backend is not available:
- If API base URL is not configured, it uses mock data
- If API request fails, it falls back to local simulation
- Alerts use localStorage if backend is unavailable

## Database

The backend uses SQLite by default. The database file (`bitcoin.db`) is created automatically on first run.

To use PostgreSQL instead:
1. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost/bitcoin
```

2. Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

## ML Model Integration

The backend expects a trained model at `../ml/models/trained_model.pkl`. If not found, it uses a fallback prediction algorithm.

To integrate a trained model:
1. Train your model using the ML folder scripts
2. Save the model as `trained_model.pkl` in `ml/models/`
3. Update `ML_MODEL_PATH` in backend `.env` if needed
4. Restart the backend server

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Python version (3.8+)
- Check if all dependencies are installed
- Review error messages in console

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in backend `.env`
- Verify API base URL in frontend settings
- Check browser console for errors

### Predictions not working
- Check if ML model path is correct
- Verify input data format
- Check backend logs for errors
- Ensure database is initialized

## Development

### Backend Development
- API documentation: `http://localhost:5000/docs`
- Interactive API: `http://localhost:5000/redoc`
- Health check: `http://localhost:5000/health`

### Frontend Development
- Hot reload enabled
- API calls logged in browser console
- Settings stored in localStorage

## Next Steps

1. Create ML model training scripts in `ml/` folder
2. Train and save model
3. Test all API endpoints
4. Deploy backend to production
5. Deploy frontend to production

## Support

For issues or questions:
1. Check backend logs
2. Check browser console
3. Review API documentation at `/docs`
4. Verify environment variables

