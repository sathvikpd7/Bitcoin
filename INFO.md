# Bitcoin Price Predictor - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Model Information](#model-information)
4. [Pages & Features](#pages--features)
5. [Buttons & Actions](#buttons--actions)
6. [API Endpoints](#api-endpoints)
7. [Data Flow](#data-flow)
8. [Setup & Installation](#setup--installation)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Bitcoin Price Predictor** is a full-stack web application that uses Machine Learning (ML) to predict Bitcoin's future closing prices. The system combines:

- **Frontend**: React-based user interface with real-time data visualization
- **Backend**: FastAPI REST API with ML model integration
- **ML Model**: XGBoost-based regression model trained on historical Bitcoin data
- **Database**: SQLite database for storing historical OHLC (Open, High, Low, Close) data

### Key Features
- ✅ Real-time Bitcoin price prediction using ML
- ✅ Historical data visualization with candlestick charts
- ✅ Backtesting simulation for trading strategies
- ✅ Model performance monitoring
- ✅ Historical data exploration
- ✅ Automatic data synchronization from external APIs

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  - Bitcoin Price Predictor Page                             │
│  - Data Explorer Page                                        │
│  - Backtesting Page                                          │
│  - Model Lab Page                                            │
│  - Settings Page                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────▼──────────────────────────────────────┐
│                 Backend (FastAPI)                            │
│  - Prediction Service                                         │
│  - Data Service                                               │
│  - Backtesting Service                                        │
│  - ML Service (Model Loading & Prediction)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌───▼──────────┐
│   SQLite     │ │   ML Model  │ │  CoinGecko   │
│   Database   │ │  (XGBoost)  │ │     API      │
└──────────────┘ └─────────────┘ └──────────────┘
```

### Technology Stack

**Frontend:**
- React 18
- Vite (Build Tool)
- Recharts (Charting Library)
- Tailwind CSS (Styling)

**Backend:**
- FastAPI (Python Web Framework)
- SQLAlchemy (ORM)
- SQLite (Database)
- Pandas & NumPy (Data Processing)

**ML:**
- XGBoost (Gradient Boosting Model)
- scikit-learn (ML Utilities)
- TA-Lib / ta (Technical Analysis Indicators)
- Joblib (Model Serialization)

---

## 🤖 Model Information

### Current Model: XGBoost Regressor

**Model Type**: XGBoost (Extreme Gradient Boosting)  
**Purpose**: Predict next-day Bitcoin closing price  
**Training Data**: 730 days of historical Bitcoin OHLC data  
**Features**: 51+ technical indicators including:
- Basic price features (open, high, low, close, averages)
- Moving averages (SMA, EMA for periods 7, 14, 30, 50)
- Technical indicators (RSI, MACD, Bollinger Bands)
- Lag features (1, 2, 3, 5, 7 days)
- Rolling statistics (volatility, mean returns)
- Volume features

**Model Files:**
- `ml/models/trained_model.pkl` - Trained XGBoost model
- `ml/models/trained_model_features.pkl` - Feature column names (for correct feature ordering)

**Model Status:**
- ✅ **Active**: Model is loaded and being used for predictions
- ⚠️ **Fallback**: Using heuristic prediction (model not loaded or incompatible)

**How to Check Model Status:**
1. Navigate to **Model Lab** page
2. Check the status indicator at the top
3. Green ✅ = Model is active and being used
4. Yellow ⚠️ = Using fallback prediction

**Model Performance Metrics:**
- Training Accuracy: ~89.2% (within ±2% error)
- Validation Accuracy: ~84.7% (within ±2% error)
- R² Score: ~0.85-0.90
- MAE (Mean Absolute Error): Varies based on training

---

## 📄 Pages & Features

### 1. **Bitcoin Price Predictor** (Home Page)
**Route**: `/` or `/bitcoin-price-predictor`

**Purpose**: Main page for making Bitcoin price predictions

**Key Components:**
- **Historical Bitcoin Close Price & Forecast Chart**: Displays last 30 days of Bitcoin prices with candlestick visualization
- **Price Input Form**: Manual entry of OHLC data
- **Prediction Results**: Shows predicted price, confidence, and metrics
- **Quick Predict Button**: Automatically fetches current price and predicts tomorrow

**Features:**
- Real-time data fetching from backend or CoinGecko API
- Interactive candlestick chart with technical indicators
- Prediction with confidence intervals
- Model performance metrics display

---

### 2. **Data Explorer**
**Route**: `/data-explorer`

**Purpose**: Browse and explore historical Bitcoin OHLC data

**Features:**
- Table view of historical data (Open, High, Low, Close, Date)
- Pagination controls (Previous/Next buttons)
- Data refresh button
- Real-time data fetching from backend
- CSV export capability (future feature)

**Buttons:**
- **Refresh Button** (🔄): Fetches latest data from backend API
- **Previous/Next**: Navigate through data pages
- **Page Numbers**: Jump to specific page

---

### 3. **Backtesting**
**Route**: `/backtesting`

**Purpose**: Test trading strategies on historical data

**Features:**
- Date range selection (Start Date, End Date)
- Strategy selection (Directional, Mean Reversion)
- Starting cash amount input
- Equity curve visualization
- Performance metrics (Win Rate, Max Drawdown, Sharpe Ratio)

**Buttons:**
- **Run Backtest**: Executes backtesting simulation
- **Sync Data**: Fetches historical data if missing
- **Quick Date Buttons**: 2024, 2025 presets
- **Strategy Buttons**: Quick strategy selection

**Strategies:**
1. **Directional**: Buy when price predicted to go up, sell when predicted to go down
2. **Mean Reversion**: Buy when price is below predicted, sell when above

---

### 4. **Model Lab**
**Route**: `/model-lab`

**Purpose**: Monitor ML model performance and status

**Features:**
- Model status indicator (Active/Fallback)
- Training and validation accuracy metrics
- Model version history
- Model comparison table
- Model upload (stub/placeholder)

**Status Indicators:**
- ✅ **Green**: Model is loaded and active
- ⚠️ **Yellow**: Using fallback prediction
- ❌ **Red**: Error loading model information

**Information Displayed:**
- Model Type (XGBoost, Fallback, etc.)
- Training Accuracy (%)
- Validation Accuracy (%)
- Last Updated timestamp
- Model file path status

---

### 5. **Settings**
**Route**: `/settings`

**Purpose**: Configure application settings

**Features:**
- API Base URL configuration
- Theme toggle (Dark/Light mode)
- Application preferences

---

## 🔘 Buttons & Actions

### **Bitcoin Price Predictor Page**

#### 1. **"Predict Tomorrow's Price" Button** 🔮
- **Location**: Top section of the page
- **Function**: 
  - Fetches current Bitcoin price from backend or CoinGecko
  - Automatically fills OHLC data with today's prices
  - Triggers prediction for tomorrow's closing price
- **When to Use**: Quick prediction without manual data entry
- **States**: 
  - Normal: "Predict Tomorrow's Price"
  - Loading: "Predicting..." with spinner

#### 2. **"Predict Price" Button** (Main Form)
- **Location**: Price Input Form
- **Function**: 
  - Validates input data
  - Sends OHLC data to backend API
  - Receives and displays prediction results
- **When to Use**: When you have specific OHLC data to analyze
- **States**: 
  - Normal: "Predict Price"
  - Loading: "Analyzing..." with spinner

#### 3. **"Reset Form" Button** 🔄
- **Location**: Price Input Form
- **Function**: Clears all input fields
- **When to Use**: To start fresh with new data

#### 4. **Chart Refresh Button** (if available)
- **Function**: Reloads historical price data and updates chart

---

### **Data Explorer Page**

#### 1. **Refresh Button** 🔄
- **Function**: Fetches latest historical data from backend
- **When to Use**: To get the most recent Bitcoin price data

#### 2. **Previous/Next Buttons**
- **Function**: Navigate through paginated data
- **When to Use**: To browse historical data pages

#### 3. **Page Number Buttons**
- **Function**: Jump to specific page
- **When to Use**: To quickly navigate to a specific data range

---

### **Backtesting Page**

#### 1. **"Run Backtest" Button**
- **Function**: 
  - Validates date range and inputs
  - Runs backtesting simulation
  - Displays results (equity curve, metrics)
- **When to Use**: After selecting date range and strategy
- **States**: 
  - Normal: "Run Backtest"
  - Loading: "Running..." with spinner

#### 2. **"Sync Data" Button**
- **Function**: 
  - Fetches historical Bitcoin data from CoinGecko API
  - Saves data to database
  - Prepares data for backtesting
- **When to Use**: 
  - First time using backtesting
  - When you see "No historical data" error
  - To update database with latest data
- **States**: 
  - Normal: "Sync Data"
  - Loading: "Syncing..." with spinner

#### 3. **Quick Date Buttons** (2024, 2025)
- **Function**: Auto-fill date range for specific year
- **When to Use**: Quick setup for yearly backtesting

#### 4. **Strategy Buttons** (Directional, Mean Rev)
- **Function**: Quick strategy selection
- **When to Use**: To quickly switch between strategies

---

### **Model Lab Page**

#### 1. **Model Type Dropdown** (Display Only)
- **Function**: Shows available model types (LSTM, GRU, ARIMA, Baseline)
- **Note**: Currently display-only, doesn't change active model
- **Active Model**: Determined by backend (loads from file system)

#### 2. **Upload Model Button** (Stub)
- **Function**: Placeholder for future model upload feature
- **Status**: Not fully implemented yet

---

### **Navigation Header** (All Pages)

#### 1. **Theme Toggle Button** 🌙/☀️
- **Function**: Switches between dark and light mode
- **Location**: Top-right corner

#### 2. **Settings Button** ⚙️
- **Function**: Opens settings page
- **Location**: Top-right corner

#### 3. **Help/Info Button** ❓
- **Function**: Shows help information
- **Location**: Top-right corner

#### 4. **Navigation Links**
- **Predictor**: Go to home page
- **Data**: Go to Data Explorer
- **Backtesting**: Go to Backtesting page
- **Model Lab**: Go to Model Lab page
- **Settings**: Go to Settings page

---

## 🔌 API Endpoints

### Prediction Endpoints

#### `POST /api/predict`
**Purpose**: Predict Bitcoin's next closing price

**Request Body:**
```json
{
  "open": 45000.00,
  "high": 46000.00,
  "low": 44000.00,
  "close": 45500.00
}
```

**Response:**
```json
{
  "prediction": {
    "nextClosePrice": 45800.50,
    "priceChange": 300.50,
    "percentageChange": 0.66,
    "confidence": 0.85,
    "volatility": 0.02,
    "timestamp": "2025-01-15T10:30:00",
    "model_used": "trained" // or "fallback"
  },
  "metrics": {
    "trainingAccuracy": 0.892,
    "validationAccuracy": 0.847,
    "model_type": "XGBoost"
  }
}
```

---

### Data Endpoints

#### `GET /api/data/ohlc`
**Purpose**: Get historical OHLC data

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)
- `limit` (default: 100): Number of records
- `offset` (default: 0): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "date": "2025-01-15",
      "open": 45000.00,
      "high": 46000.00,
      "low": 44000.00,
      "close": 45500.00,
      "volume": 0
    }
  ],
  "count": 1
}
```

#### `GET /api/data/latest`
**Purpose**: Get latest Bitcoin price

**Response:**
```json
{
  "date": "2025-01-15",
  "open": 45000.00,
  "high": 46000.00,
  "low": 44000.00,
  "close": 45500.00
}
```

#### `POST /api/data/sync?days=365`
**Purpose**: Sync Bitcoin data from external API

**Query Parameters:**
- `days` (default: 365): Number of days to fetch

**Response:**
```json
{
  "message": "Synced 365 records (new and updated)",
  "total_fetched": 365,
  "records_saved": 365
}
```

---

### Backtesting Endpoints

#### `POST /api/backtest`
**Purpose**: Run backtesting simulation

**Request Body:**
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "strategy": "directional",
  "starting_cash": 10000
}
```

**Response:**
```json
{
  "equity": [10000, 10100, 10200, ...],
  "trades": 45,
  "winRate": 65.5,
  "maxDrawdown": 12.3,
  "sharpe": 1.85,
  "totalReturn": 25.5,
  "finalEquity": 12550.00
}
```

---

### Model Endpoints

#### `GET /api/model/metrics`
**Purpose**: Get model performance metrics

**Response:**
```json
{
  "trainingAccuracy": 0.892,
  "validationAccuracy": 0.847,
  "dataPoints": 50000,
  "features": 51,
  "model_type": "XGBoost",
  "model_loaded": true,
  "model_path": "/path/to/model.pkl",
  "model_exists": true,
  "features_file_exists": true,
  "feature_count": 51,
  "updated_at": "2025-01-15T10:30:00"
}
```

---

## 🔄 Data Flow

### Prediction Flow

```
1. User enters OHLC data OR clicks "Predict Tomorrow's Price"
   ↓
2. Frontend sends POST /api/predict with OHLC data
   ↓
3. Backend ML Service:
   - Fetches historical data (last 100 days) from database
   - Calculates 51+ technical features
   - Loads trained XGBoost model
   - Makes prediction
   ↓
4. Backend returns prediction + metrics
   ↓
5. Frontend displays:
   - Predicted price
   - Confidence level
   - Price change & percentage
   - Model used (trained/fallback)
   - Model performance metrics
```

### Historical Data Flow

```
1. User navigates to Data Explorer or Predictor page
   ↓
2. Frontend requests GET /api/data/ohlc
   ↓
3. Backend queries SQLite database
   ↓
4. Returns historical OHLC data
   ↓
5. Frontend displays in table or chart
```

### Backtesting Flow

```
1. User selects date range and strategy
   ↓
2. User clicks "Run Backtest"
   ↓
3. Frontend sends POST /api/backtest
   ↓
4. Backend:
   - Fetches historical data for date range
   - For each day:
     - Gets prediction using ML model
     - Applies trading strategy
     - Calculates equity
   - Calculates metrics (win rate, drawdown, Sharpe)
   ↓
5. Backend returns results
   ↓
6. Frontend displays:
   - Equity curve chart
   - Performance metrics
   - Trade statistics
```

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd Bitcoin-main/backend
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create `.env` file** (optional):
```env
API_PORT=5000
DATABASE_URL=sqlite:///./bitcoin.db
ML_MODEL_PATH=../ml/models/trained_model.pkl
CORS_ORIGINS=http://localhost:4028
```

4. **Run backend server:**
```bash
python -m uvicorn app.main:app --reload --port 5000
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd Bitcoin-main/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Access application:**
- Open browser to `http://localhost:4028`

### ML Model Training (Optional)

1. **Navigate to ML directory:**
```bash
cd Bitcoin-main/ml/training
```

2. **Install ML dependencies:**
```bash
cd ..
pip install -r requirements.txt
```

3. **Train model:**
```bash
cd training
python train_model.py
```

4. **Model will be saved to:**
- `Bitcoin-main/ml/models/trained_model.pkl`
- `Bitcoin-main/ml/models/trained_model_features.pkl`

---

## 🔧 Troubleshooting

### Model Not Loading (Fallback Mode)

**Symptoms:**
- Model Lab shows "⚠️ Fallback: Using heuristic prediction"
- Predictions show "model_used": "fallback"

**Solutions:**

1. **Check model file exists:**
```bash
# Windows
dir Bitcoin-main\ml\models\trained_model.pkl

# Linux/Mac
ls Bitcoin-main/ml/models/trained_model.pkl
```

2. **Check model path in backend:**
- Default path: `../ml/models/trained_model.pkl` (relative to backend directory)
- Verify path in `backend/app/config.py`

3. **Check backend logs:**
- Look for "Model loaded from..." or "Model not found..." messages
- Check for error messages during startup

4. **Train model if missing:**
```bash
cd Bitcoin-main/ml/training
python train_model.py
```

5. **Install required dependencies:**
```bash
cd Bitcoin-main/backend
pip install ta==0.11.0 xgboost==2.0.3
```

### "No Historical Data" Error in Backtesting

**Solution:**
1. Click **"Sync Data"** button in Backtesting page
2. Wait for data sync to complete
3. Try running backtest again

### CORS Errors

**Solution:**
1. Ensure backend is running on port 5000
2. Check CORS_ORIGINS in backend `.env` file
3. Verify frontend is accessing correct API URL in Settings

### Feature Mismatch Errors

**Symptoms:**
- Error: "Feature shape mismatch, expected: 51, got: 15"

**Solution:**
1. Ensure `trained_model_features.pkl` exists
2. Restart backend server
3. Verify historical data is available (needed for feature calculation)

---

## 📊 Model Details

### Feature Engineering

The model uses **51+ features** calculated from OHLC data:

**Basic Features (15):**
- open, high, low, close
- avg_price, volatility, trend
- body_size, upper_shadow, lower_shadow
- high_low_ratio, close_open_ratio
- price_range, price_change, price_change_pct

**Moving Averages (16):**
- SMA_7, SMA_14, SMA_30, SMA_50
- EMA_7, EMA_14, EMA_30, EMA_50
- price_vs_sma_7, price_vs_sma_14, price_vs_sma_30, price_vs_sma_50

**Technical Indicators (4):**
- RSI_14
- MACD, MACD_signal, MACD_diff

**Bollinger Bands (4):**
- bb_high, bb_low, bb_mid, bb_width, bb_position

**Lag Features (10):**
- close_lag_1, close_lag_2, close_lag_3, close_lag_5, close_lag_7
- returns_lag_1, returns_lag_2, returns_lag_3, returns_lag_5, returns_lag_7

**Rolling Statistics (6):**
- volatility_7, volatility_14, volatility_30
- mean_return_7, mean_return_14, mean_return_30

**Volume Features (2):**
- volume_sma_20, volume_ratio

### Prediction Process

1. **Data Collection**: Fetches last 100 days of historical data
2. **Feature Calculation**: Computes all 51+ technical indicators
3. **Model Prediction**: XGBoost model predicts next close price
4. **Confidence Calculation**: Based on volatility and model certainty
5. **Result Formatting**: Returns price, change, percentage, confidence

---

## 🎓 Understanding Predictions

### Prediction Components

1. **Next Close Price**: Predicted closing price for tomorrow
2. **Price Change**: Absolute difference from current close
3. **Percentage Change**: Percentage difference from current close
4. **Confidence**: Model's certainty (0.65 - 0.95)
5. **Volatility**: Expected price variance
6. **Model Used**: "trained" (XGBoost) or "fallback" (heuristic)

### Confidence Levels

- **High (0.85-0.95)**: Strong prediction, low volatility expected
- **Medium (0.70-0.85)**: Moderate prediction, normal market conditions
- **Low (0.65-0.70)**: Uncertain prediction, high volatility expected

### Accuracy Metrics

- **Training Accuracy**: Model's performance on training data (~89%)
- **Validation Accuracy**: Model's performance on unseen data (~85%)
- **R² Score**: Coefficient of determination (~0.85-0.90)

---

## 📝 Notes

- **Model Training**: Requires 730+ days of historical data
- **Real-time Data**: Fetched from CoinGecko API (free, no API key needed)
- **Database**: SQLite by default (can be changed to PostgreSQL)
- **Fallback Mode**: Uses simple trend-following algorithm if model unavailable
- **Feature Calculation**: Requires historical data for technical indicators

---

## 🔗 External Resources

- **CoinGecko API**: https://www.coingecko.com/en/api
- **XGBoost Documentation**: https://xgboost.readthedocs.io/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **React Documentation**: https://react.dev/

---

## 📞 Support

For issues or questions:
1. Check backend logs for error messages
2. Verify all dependencies are installed
3. Ensure model files exist in correct location
4. Check API connectivity in Settings page

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Model Version**: XGBoost v2.0.3

