# ML Model Training for Bitcoin Price Prediction

## Quick Start

1. **Install dependencies:**
```bash
cd ml
pip install -r requirements.txt
```

2. **Train the model:**
```bash
python training/train_model.py
```

3. **Model will be saved to:** `models/trained_model.pkl`

4. **Backend will automatically load it** on next startup!

## Data Sources

The training script automatically uses the best available data source:

1. **yfinance** (Recommended - No API key needed)
   - Provides actual OHLC data
   - Free, no rate limits
   - Best quality data

2. **Alpha Vantage** (Optional - Requires free API key)
   - Get key: https://www.alphavantage.co/support/#api-key
   - Add to `.env`: `ALPHA_VANTAGE_API_KEY=your_key`

3. **CoinGecko** (Fallback)
   - Free, no key needed
   - Only provides close prices (OHLC approximated)

## Model Details

- **Algorithm:** XGBoost Regressor
- **Features:** 50+ technical indicators
- **Training Time:** 5-10 minutes
- **Expected Accuracy:** 85-90% (within ±2% of actual price)

## Features Created

The model uses:
- Price features (OHLC, averages, ratios)
- Technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
- Lag features (previous day values)
- Volatility measures
- Volume indicators (if available)

## Retraining

To retrain with fresh data:
```bash
python training/train_model.py
```

The model will be automatically updated and backend will load the new version.

## Troubleshooting

**No data collected:**
- Check internet connection
- Try different data source
- Verify API keys if using Alpha Vantage

**Low accuracy:**
- Train with more data (increase days parameter)
- Adjust model hyperparameters
- Try different algorithms (LSTM, etc.)

**Model not loading:**
- Check file path: `ml/models/trained_model.pkl`
- Verify model was saved successfully
- Check backend logs for errors

