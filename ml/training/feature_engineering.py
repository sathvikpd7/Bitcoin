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

    # -------------------------------------------------------------
    # SAFE HELPER FUNCTION
    # -------------------------------------------------------------
    def safe_div(self, a, b):
        """Safe divide to avoid divide-by-zero warnings"""
        return np.where(b == 0, 0, a / b)

    # -------------------------------------------------------------
    # MAIN FEATURE CREATION
    # -------------------------------------------------------------
    def create_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create comprehensive technical + statistical features.
        """

        data = df.copy()

        # Ensure proper date format
        data["date"] = pd.to_datetime(data["date"], errors="coerce")
        data = data.sort_values("date").reset_index(drop=True)

        # -------------------------------------------------------------
        # BASIC PRICE FEATURES
        # -------------------------------------------------------------
        data["avg_price"] = (data["open"] + data["high"] + data["low"] + data["close"]) / 4
        data["price_range"] = data["high"] - data["low"]
        data["body_size"] = abs(data["close"] - data["open"])
        data["upper_shadow"] = data["high"] - data[["open", "close"]].max(axis=1)
        data["lower_shadow"] = data[["open", "close"]].min(axis=1) - data["low"]

        # Ratios (safe)
        data["high_low_ratio"] = self.safe_div(data["high"], data["low"])
        data["close_open_ratio"] = self.safe_div(data["close"], data["open"])
        data["volatility"] = self.safe_div(data["price_range"], data["avg_price"]) * 100

        # Price change
        data["price_change"] = data["close"] - data["open"]
        data["price_change_pct"] = self.safe_div(data["price_change"], data["open"]) * 100

        # Returns
        data["returns"] = data["close"].pct_change()
        data["log_returns"] = np.log(self.safe_div(data["close"], data["close"].shift(1)))

        # -------------------------------------------------------------
        # MOVING AVERAGES (SMA + EMA)
        # -------------------------------------------------------------
        for period in [7, 14, 30, 50]:
            data[f"sma_{period}"] = SMAIndicator(close=data["close"], window=period).sma_indicator()
            data[f"ema_{period}"] = EMAIndicator(close=data["close"], window=period).ema_indicator()

            data[f"price_vs_sma_{period}"] = (
                self.safe_div((data["close"] - data[f"sma_{period}"]), data[f"sma_{period}"]) * 100
            )

        # -------------------------------------------------------------
        # RSI
        # -------------------------------------------------------------
        data["rsi_14"] = RSIIndicator(close=data["close"], window=14).rsi()

        # -------------------------------------------------------------
        # MACD
        # -------------------------------------------------------------
        macd = MACD(close=data["close"])
        data["macd"] = macd.macd()
        data["macd_signal"] = macd.macd_signal()
        data["macd_diff"] = macd.macd_diff()

        # -------------------------------------------------------------
        # BOLLINGER BANDS
        # -------------------------------------------------------------
        bb = BollingerBands(close=data["close"], window=20)

        data["bb_high"] = bb.bollinger_hband()
        data["bb_low"] = bb.bollinger_lband()
        data["bb_mid"] = bb.bollinger_mavg()

        data["bb_width"] = self.safe_div(
            (data["bb_high"] - data["bb_low"]), data["bb_mid"]
        ) * 100

        # Avoid divide-by-zero
        data["bb_position"] = self.safe_div(
            (data["close"] - data["bb_low"]), (data["bb_high"] - data["bb_low"])
        )

        # -------------------------------------------------------------
        # VOLUME FEATURES
        # -------------------------------------------------------------
        if "volume" in data.columns and data["volume"].sum() > 0:
            data["volume_sma_20"] = data["volume"].rolling(window=20).mean()
            data["volume_ratio"] = self.safe_div(data["volume"], data["volume_sma_20"])
        else:
            data["volume_sma_20"] = 0
            data["volume_ratio"] = 1

        # -------------------------------------------------------------
        # LAG FEATURES
        # -------------------------------------------------------------
        for lag in [1, 2, 3, 5, 7]:
            data[f"close_lag_{lag}"] = data["close"].shift(lag)
            data[f"returns_lag_{lag}"] = data["returns"].shift(lag)

        # -------------------------------------------------------------
        # ROLLING STATISTICS
        # -------------------------------------------------------------
        for window in [7, 14, 30]:
            data[f"volatility_{window}"] = (
                data["returns"].rolling(window=window).std() * np.sqrt(252)
            )
            data[f"mean_return_{window}"] = data["returns"].rolling(window=window).mean()

        # -------------------------------------------------------------
        # TARGET VARIABLE → next-day close price
        # -------------------------------------------------------------
        data["target"] = data["close"].shift(-1)

        # Clean NaN
        data = data.replace([np.inf, -np.inf], np.nan).dropna()

        return data

    # -------------------------------------------------------------------------
    def get_feature_columns(self) -> list:
        """Columns excluded from ML features"""
        return ["date", "target", "open", "high", "low", "close", "volume"]


# ----------------------------------------------------------------------
# TESTING BLOCK
# ----------------------------------------------------------------------
if __name__ == "__main__":
    from data_collection import DataCollector

    print("Collecting data...")
    collector = DataCollector()
    raw_data = collector.collect_data(days=365)

    if not raw_data.empty:
        print("\nEngineering features...")
        engineer = FeatureEngineer()
        features = engineer.create_features(raw_data)

        print("\nFeature engineering complete!")
        print("Original shape:", raw_data.shape)
        print("Features shape:", features.shape)
        print("\nColumns:", features.columns.tolist())
        print(features.head())

        features.to_csv("bitcoin_features.csv", index=False)
        print("\n✓ Features saved to bitcoin_features.csv")
