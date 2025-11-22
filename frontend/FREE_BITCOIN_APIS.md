# Free Bitcoin APIs Guide

This document provides information about free APIs you can use to fetch real-time Bitcoin price data for this project.

## 🎯 Currently Implemented APIs

### 1. CoinGecko API (Primary Free API)
**Status:** ✅ Already Integrated

**Website:** https://www.coingecko.com/en/api

**Features:**
- ✅ **Completely Free** - No API key required for basic usage
- ✅ Real-time Bitcoin prices
- ✅ Historical OHLC (Open, High, Low, Close) data
- ✅ Market data, charts, and more
- ✅ Rate limit: 10-50 calls/minute (free tier)

**Endpoints Used:**
- `GET /api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=30`
  - Returns OHLC data for the last 30 days
  - Format: `[timestamp, open, high, low, close]`

**Example Request:**
```javascript
const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=30');
const data = await response.json();
```

**Rate Limits:**
- Free tier: 10-50 calls/minute
- Pro tier: Higher limits (paid)

---

## 🔄 Alternative Free APIs

### 2. CoinCap API
**Website:** https://docs.coincap.io/

**Features:**
- ✅ Free tier available
- ✅ Real-time prices
- ✅ Historical data
- ⚠️ Requires API key (free registration)
- Rate limit: 200 requests/minute

**Endpoints:**
- `GET /v2/assets/bitcoin` - Current price
- `GET /v2/assets/bitcoin/history` - Historical data

**Registration:**
1. Visit https://coincap.io/
2. Sign up for free account
3. Get API key from dashboard

---

### 3. Binance Public API
**Website:** https://binance-docs.github.io/apidocs/spot/en/

**Features:**
- ✅ Completely free
- ✅ No API key required for public endpoints
- ✅ Real-time prices
- ✅ OHLC candlestick data
- ✅ High rate limits

**Endpoints:**
- `GET /api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30`
  - Returns candlestick data (OHLC)
  - Interval options: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M

**Example Request:**
```javascript
const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30');
const data = await response.json();
// Format: [Open time, Open, High, Low, Close, Volume, ...]
```

**Rate Limits:**
- Weight-based system
- 1200 requests/minute per IP

---

### 4. CryptoCompare API
**Website:** https://www.cryptocompare.com/cryptopian/api-keys

**Features:**
- ✅ Free tier available
- ✅ Historical OHLC data
- ✅ Real-time prices
- ⚠️ Requires free API key
- Rate limit: 100,000 calls/month (free tier)

**Endpoints:**
- `GET /data/v2/histoday?fsym=BTC&tsym=USD&limit=30`
  - Returns daily historical data

**Registration:**
1. Visit https://www.cryptocompare.com/
2. Sign up for free account
3. Get API key from dashboard

---

### 5. CoinAPI
**Website:** https://www.coinapi.io/

**Features:**
- ✅ Free tier: 100 API calls/day
- ✅ Real-time and historical data
- ⚠️ Requires API key
- ⚠️ Limited free tier

**Registration:**
1. Visit https://www.coinapi.io/pricing
2. Sign up for free account
3. Get API key from dashboard

---

### 6. Alpha Vantage (Crypto)
**Website:** https://www.alphavantage.co/support/#api-key

**Features:**
- ✅ Free tier: 5 API calls/minute, 500 calls/day
- ✅ Real-time and historical data
- ⚠️ Requires API key
- ⚠️ Very limited free tier

**Endpoints:**
- `GET /query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=YOUR_KEY`

---

## 🚀 Recommended Setup for This Project

### Option 1: CoinGecko (Current Implementation) ✅
**Best for:** Quick setup, no registration needed
- Already implemented
- No API key required
- Good for development and small projects

### Option 2: Binance API (Recommended for Production)
**Best for:** High reliability and rate limits
- No registration needed
- High rate limits
- Professional-grade data
- Already used by many trading platforms

**Implementation Example:**
```javascript
const fetchBinanceData = async () => {
  const response = await fetch(
    'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30'
  );
  const data = await response.json();
  
  return data.map(candle => ({
    date: new Date(candle[0]).toISOString().split('T')[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4])
  }));
};
```

### Option 3: Multiple APIs with Fallback
**Best for:** Maximum reliability
- Try CoinGecko first
- Fallback to Binance if CoinGecko fails
- Fallback to CryptoCompare if both fail

---

## 📊 API Comparison Table

| API | Free Tier | API Key Required | Rate Limit | OHLC Data | Real-time |
|-----|-----------|------------------|------------|-----------|-----------|
| **CoinGecko** | ✅ Yes | ❌ No | 10-50/min | ✅ Yes | ✅ Yes |
| **Binance** | ✅ Yes | ❌ No | 1200/min | ✅ Yes | ✅ Yes |
| **CoinCap** | ✅ Yes | ✅ Yes | 200/min | ✅ Yes | ✅ Yes |
| **CryptoCompare** | ✅ Yes | ✅ Yes | 100K/month | ✅ Yes | ✅ Yes |
| **CoinAPI** | ⚠️ Limited | ✅ Yes | 100/day | ✅ Yes | ✅ Yes |
| **Alpha Vantage** | ⚠️ Very Limited | ✅ Yes | 5/min | ✅ Yes | ✅ Yes |

---

## 🔧 How to Add a New API

1. **Create a new fetch function** in `index.jsx`:
```javascript
const fetchFromNewAPI = async () => {
  const response = await fetch('API_ENDPOINT_URL');
  const data = await response.json();
  // Transform data to match expected format
  return transformedData;
};
```

2. **Add to fetchHistoricalData function**:
```javascript
const fetchHistoricalData = async () => {
  try {
    // Try backend API first
    // Then try CoinGecko
    // Then try new API as fallback
    const data = await fetchFromNewAPI();
    setHistoricalData(data);
  } catch (err) {
    // Handle error
  }
};
```

---

## ⚠️ Important Notes

1. **Rate Limiting:** Always respect API rate limits to avoid being blocked
2. **CORS:** Some APIs may have CORS restrictions. You may need a backend proxy
3. **Data Format:** Each API returns data in different formats - always transform to match your expected structure
4. **Error Handling:** Always implement proper error handling and fallbacks
5. **API Keys:** Store API keys securely (use environment variables, never commit to git)

---

## 🔐 Environment Variables Setup

If you need to use APIs that require keys, create a `.env` file:

```env
VITE_COINGECKO_API_KEY=your_key_here
VITE_BINANCE_API_KEY=your_key_here
VITE_CRYPTOCOMPARE_API_KEY=your_key_here
```

Then use in code:
```javascript
const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
```

---

## 📚 Additional Resources

- **CoinGecko API Docs:** https://www.coingecko.com/en/api/documentation
- **Binance API Docs:** https://binance-docs.github.io/apidocs/spot/en/
- **CoinCap API Docs:** https://docs.coincap.io/
- **CryptoCompare API Docs:** https://min-api.cryptocompare.com/documentation

---

## 🎯 Current Project Status

✅ **CoinGecko API** - Implemented and working
✅ **Backend API** - Falls back to CoinGecko if not available
❌ **Mock Data** - Removed (no longer used)

The project now fetches **100% real-time data** from live APIs!

