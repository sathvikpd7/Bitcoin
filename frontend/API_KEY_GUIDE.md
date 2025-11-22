# API Key Guide for Bitcoin Price Prediction

## 🎯 Do You Need an API Key?

**Short Answer:** **NO API KEY NEEDED** for most features! The app uses free APIs that don't require keys.

---

## ✅ What Works WITHOUT API Keys

### 1. Historical Bitcoin Data (CoinGecko API)
- ✅ **No API key required**
- ✅ Completely free
- ✅ Used in:
  - Data Explorer page
  - Historical Bitcoin Close Price chart
  - Price visualization

**How it works:**
- Automatically fetches from CoinGecko API
- No configuration needed
- Works immediately when you open the app

---

## 🔧 What You DO Need (Backend API)

### For Price Predictions & Backtesting

You need to **run your own backend API** (not an external API key). This is the ML prediction service that comes with this project.

**You DON'T need:**
- ❌ CoinGecko API key (it's free, no key needed)
- ❌ Binance API key (public endpoints work without key)
- ❌ Any external API key for predictions

**You DO need:**
- ✅ Your backend server running (the FastAPI backend in this project)
- ✅ Backend API URL configured in Settings

---

## 🚀 Setup Instructions

### Step 1: Start Your Backend Server

1. **Navigate to backend directory:**
   ```bash
   cd Bitcoin-main/backend
   ```

2. **Install dependencies (if not done):**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the backend server:**
   ```bash
   python -m uvicorn app.main:app --reload --port 5000
   ```

   The backend will run on: `http://localhost:5000`

### Step 2: Configure Frontend to Use Backend

1. **Open the app in browser:**
   - Go to `http://localhost:4028` (or your frontend port)

2. **Navigate to Settings:**
   - Click on "Settings" in the navigation menu

3. **Enter Backend API URL:**
   - API Base URL: `http://localhost:5000`
   - Click "Save"

4. **Verify connection:**
   - Go to Data Explorer - should load data
   - Try a prediction - should work now

---

## 📊 API Endpoints Used

### Frontend → Backend API (Your Server)

1. **GET `/api/data/ohlc`**
   - Fetches historical OHLC data
   - Used by: Data Explorer, Price Chart

2. **POST `/api/predict`**
   - Gets Bitcoin price predictions
   - Used by: Bitcoin Price Predictor page
   - Requires: Backend API running

3. **POST `/api/backtest`**
   - Runs backtesting simulations
   - Used by: Backtesting page
   - Requires: Backend API running

### Frontend → External APIs (No Key Needed)

1. **CoinGecko API** (Free, No Key)
   - `GET https://api.coingecko.com/api/v3/coins/bitcoin/ohlc`
   - Used as fallback when backend is not available

---

## 🔑 Optional: Getting API Keys (If You Want More)

If you want to use other APIs with higher rate limits, here are free options:

### 1. CoinGecko Pro (Optional)
- **Website:** https://www.coingecko.com/en/api/pricing
- **Free tier:** Already using it (no key needed)
- **Pro tier:** Higher rate limits (paid)

### 2. Binance API (Optional)
- **Website:** https://www.binance.com/en/my/settings/api-management
- **Free tier:** Public endpoints work without key
- **API key:** Only needed for trading (not needed for this app)

### 3. CryptoCompare (Optional)
- **Website:** https://www.cryptocompare.com/cryptopian/api-keys
- **Free tier:** 100,000 calls/month
- **Registration:** Free account required

**Note:** You don't need any of these! The app works perfectly with CoinGecko's free tier.

---

## ❓ Common Questions

### Q: Do I need a CoinGecko API key?
**A:** No! CoinGecko's free tier works without an API key. The app uses it automatically.

### Q: Why do predictions not work?
**A:** You need to:
1. Start your backend server (see Step 1 above)
2. Configure the API URL in Settings (see Step 2 above)

### Q: Can I use this without the backend?
**A:** 
- ✅ Historical data: Yes (uses CoinGecko)
- ❌ Predictions: No (requires your ML backend)
- ❌ Backtesting: No (requires your ML backend)

### Q: Where do I get an API key for predictions?
**A:** You don't need an external API key! You need to run your own backend server that comes with this project. The backend contains the ML model for predictions.

### Q: Is the backend API free?
**A:** Yes! It's your own server running locally. No external API costs.

---

## 🐛 Troubleshooting

### Problem: "Backend API is not configured"
**Solution:**
1. Make sure backend server is running
2. Go to Settings and enter: `http://localhost:5000`
3. Click Save

### Problem: "Failed to fetch data"
**Solution:**
1. Check if backend is running: Visit `http://localhost:5000/docs`
2. Check browser console for errors
3. Verify API URL in Settings is correct

### Problem: Predictions not working
**Solution:**
1. Backend must be running
2. Backend API URL must be configured in Settings
3. Check backend logs for errors

---

## 📝 Summary

| Feature | API Key Needed? | What You Need |
|---------|----------------|---------------|
| **Historical Data** | ❌ No | Nothing (uses CoinGecko free) |
| **Price Chart** | ❌ No | Nothing (uses CoinGecko free) |
| **Data Explorer** | ❌ No | Backend optional (falls back to CoinGecko) |
| **Predictions** | ❌ No | ✅ Backend server running |
| **Backtesting** | ❌ No | ✅ Backend server running |

**Key Point:** You don't need any external API keys! Just run your backend server and configure the URL in Settings.

---

## 🎯 Quick Start Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend can access `http://localhost:5000`
- [ ] Settings page configured with API URL
- [ ] Test Data Explorer - should show real data
- [ ] Test Predictions - should work with backend

**That's it! No API keys needed!** 🎉

