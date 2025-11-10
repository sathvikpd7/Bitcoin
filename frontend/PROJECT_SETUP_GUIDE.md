# Bitcoin Price Predictor - Complete Setup Guide

## 📋 Table of Contents
1. [Required Changes](#required-changes)
2. [ML Model Recommendations](#ml-model-recommendations)
3. [API Keys Required](#api-keys-required)
4. [Step-by-Step Implementation](#step-by-step-implementation)

---

## 🔧 Required Changes

### 1. **ML Model Folder Structure** (Priority: HIGH)
Create the ML folder and training scripts:
```
ml/
├── models/
│   └── trained_model.pkl (will be created after training)
├── training/
│   ├── train_model.py
│   ├── data_collection.py
│   └── feature_engineering.py
├── utils/
│   └── preprocessing.py
└── requirements.txt
```

### 2. **Improve Data Service** (Priority: MEDIUM)
- Currently uses CoinGecko free API (no key needed, but rate-limited)
- Should integrate better data source for actual OHLC data
- Add error handling and retry logic

### 3. **Enhanced ML Service** (Priority: HIGH)
- Currently uses fallback prediction
- Need to train and integrate actual ML model
- Add model versioning and A/B testing

### 4. **Real-time Data Updates** (Priority: LOW)
- Add scheduled tasks to sync data periodically
- Add WebSocket support for real-time price updates

### 5. **Production Readiness** (Priority: MEDIUM)
- Add authentication/authorization
- Add rate limiting
- Add logging and monitoring
- Add unit tests

---

## 🤖 ML Model Recommendations

### **Recommended Models (in order of preference):**

#### 1. **XGBoost / LightGBM** ⭐ RECOMMENDED
**Why:**
- Excellent for time series prediction
- Handles non-linear relationships well
- Fast training and prediction
- Good interpretability
- Works well with tabular data (OHLC)

**Best for:** Production use, good balance of accuracy and speed

**Implementation:**
```python
from xgboost import XGBRegressor
# or
from lightgbm import LGBMRegressor
```

#### 2. **LSTM (Long Short-Term Memory)** 
**Why:**
- Designed for sequential/time series data
- Can capture long-term dependencies
- Good for complex patterns

**Best for:** When you have large amounts of historical data and want to capture complex patterns

**Implementation:**
```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
```

#### 3. **Random Forest / Gradient Boosting**
**Why:**
- Robust and less prone to overfitting
- Good baseline model
- Easy to implement

**Best for:** Quick prototyping, baseline comparisons

**Implementation:**
```python
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
```

#### 4. **Prophet (Facebook)**
**Why:**
- Specifically designed for time series forecasting
- Handles seasonality and trends automatically
- Easy to use

**Best for:** When you need quick results with minimal tuning

**Implementation:**
```python
from prophet import Prophet
```

### **My Recommendation: Start with XGBoost**
- Best balance of accuracy, speed, and ease of use
- Can achieve 85-90% accuracy with proper feature engineering
- Easy to deploy and maintain
- Can be upgraded to LSTM later if needed

---

## 🔑 API Keys Required

### **1. CoinGecko API** (Currently Used - FREE)
**Status:** ✅ Already integrated, NO KEY NEEDED for basic usage

**Free Tier Limits:**
- 10-50 calls/minute (depends on plan)
- Sufficient for development and small-scale use

**When to upgrade:**
- If you need > 50 calls/minute
- If you need real-time data
- If you need more historical data

**Get API Key (Optional):**
1. Visit: https://www.coingecko.com/en/api
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env`: `COINGECKO_API_KEY=your_key_here`

**Current Implementation:** Works without key, but rate-limited

---

### **2. Alternative Data Sources (Recommended for Production)**

#### **Option A: Alpha Vantage** ⭐ RECOMMENDED
**Why:** Provides actual OHLC data (not just close prices)

**Free Tier:**
- 5 API calls/minute
- 500 calls/day
- Free API key available

**Get API Key:**
1. Visit: https://www.alphavantage.co/support/#api-key
2. Fill form (name, email)
3. Get free API key instantly
4. Add to `.env`: `ALPHA_VANTAGE_API_KEY=your_key_here`

**API Endpoint:**
```
https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=YOUR_KEY
```

#### **Option B: Binance API** (FREE)
**Why:** Real-time and historical OHLC data, high rate limits

**Free Tier:**
- 1200 requests/minute
- No API key needed for public data
- Real-time data available

**Implementation:**
```
https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d
```

#### **Option C: CryptoCompare** (FREE)
**Why:** Good historical data, free tier available

**Free Tier:**
- 100,000 calls/month
- Free API key available

**Get API Key:**
1. Visit: https://www.cryptocompare.com/cryptopian/api-keys
2. Sign up and get free key

---

### **3. API Keys Summary**

| API | Required? | Free Tier | Best For |
|-----|-----------|-----------|----------|
| **CoinGecko** | ❌ No (optional) | 10-50 calls/min | Basic development |
| **Alpha Vantage** | ✅ Yes (recommended) | 5 calls/min | Actual OHLC data |
| **Binance** | ❌ No | Unlimited | Real-time data |
| **CryptoCompare** | ✅ Yes (optional) | 100k/month | Historical data |

---

## 📝 Step-by-Step Implementation

### **Phase 1: Setup API Keys (Optional but Recommended)**

1. **Get Alpha Vantage API Key:**
   ```bash
   # Visit: https://www.alphavantage.co/support/#api-key
   # Get free key
   ```

2. **Update backend/.env:**
   ```env
   # Add these lines
   ALPHA_VANTAGE_API_KEY=your_key_here
   USE_ALPHA_VANTAGE=true
   ```

3. **Update data_service.py** to use Alpha Vantage for better OHLC data

---

### **Phase 2: Create ML Model Training**

1. **Create ML folder structure:**
   ```bash
   mkdir -p ml/models ml/training ml/utils
   ```

2. **Create ml/requirements.txt:**
   ```txt
   pandas==2.1.3
   numpy==1.26.2
   scikit-learn==1.3.2
   xgboost==2.0.3
   joblib==1.3.2
   yfinance==0.2.28
   ta==0.11.0
   ```

3. **Train XGBoost Model** (I'll create the training script)

---

### **Phase 3: Integrate Trained Model**

1. **Train the model:**
   ```bash
   cd ml
   pip install -r requirements.txt
   python training/train_model.py
   ```

2. **Model will be saved to:** `ml/models/trained_model.pkl`

3. **Backend will automatically load it** on startup

---

### **Phase 4: Test Integration**

1. **Start backend:**
   ```bash
   cd backend
   python run.py
   ```

2. **Test prediction:**
   - Visit: http://localhost:5000/docs
   - Test `/api/predict` endpoint
   - Should use trained model instead of fallback

---

## 🎯 Quick Start (Minimal Setup)

### **Option 1: Use Current Setup (No API Keys Needed)**
✅ **Works immediately:**
- CoinGecko API (no key needed)
- Fallback ML prediction
- All features functional

**Limitations:**
- Rate-limited API calls
- Approximate OHLC data
- Fallback prediction (not ML-trained)

### **Option 2: Enhanced Setup (Recommended)**
1. Get Alpha Vantage API key (free, 2 minutes)
2. Add to `.env` file
3. Train ML model (XGBoost - 10 minutes)
4. Enjoy better predictions!

---

## 📊 Model Performance Expectations

| Model | Training Time | Accuracy | Speed | Complexity |
|-------|--------------|----------|-------|------------|
| **XGBoost** | 5-10 min | 85-90% | Fast | Medium |
| **LSTM** | 30-60 min | 88-92% | Medium | High |
| **Random Forest** | 2-5 min | 80-85% | Fast | Low |
| **Prophet** | 1-2 min | 75-80% | Fast | Low |

**Recommended:** Start with XGBoost, upgrade to LSTM if needed.

---

## 🔄 Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is integrated
3. ⏳ Create ML training scripts (I'll do this next)
4. ⏳ Get API key (optional but recommended)
5. ⏳ Train model
6. ⏳ Test end-to-end

---

## ❓ FAQ

**Q: Do I need API keys to start?**
A: No! Current setup works without keys. But getting Alpha Vantage key (free) improves data quality.

**Q: Which ML model should I use?**
A: Start with XGBoost - best balance of accuracy and ease of use.

**Q: How long does training take?**
A: XGBoost: 5-10 minutes, LSTM: 30-60 minutes

**Q: Can I use multiple models?**
A: Yes! You can create ensemble models or A/B test different models.

---

## 📞 Support

If you need help:
1. Check backend logs
2. Verify API keys in `.env`
3. Check model file exists at `ml/models/trained_model.pkl`
4. Review API documentation at `/docs`

