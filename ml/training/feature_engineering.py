"""
Feature engineering for Bitcoin price prediction
Creates technical indicators and features from OHLC data
"""
import pandas as pd
import numpy as np
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands

class FeatureEngineer:
    def __init__(self):
        pass
    
    def create_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create comprehensive features from OHLC data
        """
        data = df.copy()
        
        # Ensure date is datetime
        data['date'] = pd.to_datetime(data['date'])
        data = data.sort_values('date').reset_index(drop=True)
        
        # Basic price features
        data['avg_price'] = (data['open'] + data['high'] + data['low'] + data['close']) / 4
        data['price_range'] = data['high'] - data['low']
        data['body_size'] = abs(data['close'] - data['open'])
        data['upper_shadow'] = data['high'] - data[['open', 'close']].max(axis=1)
        data['lower_shadow'] = data[['open', 'close']].min(axis=1) - data['low']
        
        # Price ratios
        data['high_low_ratio'] = data['high'] / data['low']
        data['close_open_ratio'] = data['close'] / data['open']
        data['volatility'] = (data['price_range'] / data['avg_price']) * 100
        
        # Price changes
        data['price_change'] = data['close'] - data['open']
        data['price_change_pct'] = (data['close'] - data['open']) / data['open'] * 100
        
        # Returns
        data['returns'] = data['close'].pct_change()
        data['log_returns'] = np.log(data['close'] / data['close'].shift(1))
        
        # Moving averages
        for period in [7, 14, 30, 50]:
            data[f'sma_{period}'] = SMAIndicator(close=data['close'], window=period).sma_indicator()
            data[f'ema_{period}'] = EMAIndicator(close=data['close'], window=period).ema_indicator()
            data[f'price_vs_sma_{period}'] = (data['close'] - data[f'sma_{period}']) / data[f'sma_{period}'] * 100
        
        # RSI (Relative Strength Index)
        data['rsi_14'] = RSIIndicator(close=data['close'], window=14).rsi()
        
        # MACD
        macd = MACD(close=data['close'])
        data['macd'] = macd.macd()
        data['macd_signal'] = macd.macd_signal()
        data['macd_diff'] = macd.macd_diff()
        
        # Bollinger Bands
        bb = BollingerBands(close=data['close'], window=20)
        data['bb_high'] = bb.bollinger_hband()
        data['bb_low'] = bb.bollinger_lband()
        data['bb_mid'] = bb.bollinger_mavg()
        data['bb_width'] = (data['bb_high'] - data['bb_low']) / data['bb_mid'] * 100
        data['bb_position'] = (data['close'] - data['bb_low']) / (data['bb_high'] - data['bb_low'])
        
        # Volume features (if available)
        if 'volume' in data.columns and data['volume'].sum() > 0:
            data['volume_sma_20'] = data['volume'].rolling(window=20).mean()
            data['volume_ratio'] = data['volume'] / data['volume_sma_20']
        else:
            data['volume_sma_20'] = 0
            data['volume_ratio'] = 1
        
        # Lag features (previous day values)
        for lag in [1, 2, 3, 5, 7]:
            data[f'close_lag_{lag}'] = data['close'].shift(lag)
            data[f'returns_lag_{lag}'] = data['returns'].shift(lag)
        
        # Rolling statistics
        for window in [7, 14, 30]:
            data[f'volatility_{window}'] = data['returns'].rolling(window=window).std() * np.sqrt(252)
            data[f'mean_return_{window}'] = data['returns'].rolling(window=window).mean()
        
        # Target variable: next day's close price
        data['target'] = data['close'].shift(-1)
        
        # Drop rows with NaN (from indicators and lags)
        data = data.dropna()
        
        return data
    
    def get_feature_columns(self) -> list:
        """
        Get list of feature column names (excluding target and date)
        """
        # These will be determined dynamically, but here's a reference
        exclude_cols = ['date', 'target', 'open', 'high', 'low', 'close', 'volume']
        return exclude_cols

if __name__ == "__main__":
    # Test feature engineering
    from data_collection import DataCollector
    
    print("Collecting data...")
    collector = DataCollector()
    raw_data = collector.collect_data(days=365)
    
    if not raw_data.empty:
        print("\nEngineering features...")
        engineer = FeatureEngineer()
        features = engineer.create_features(raw_data)
        
        print(f"\nFeature engineering complete!")
        print(f"Original shape: {raw_data.shape}")
        print(f"Features shape: {features.shape}")
        print(f"\nFeature columns ({len(features.columns)}):")
        print(features.columns.tolist())
        print(f"\nFirst few rows:")
        print(features.head())
        
        # Save features
        features.to_csv("bitcoin_features.csv", index=False)
        print(f"\n✓ Features saved to bitcoin_features.csv")

