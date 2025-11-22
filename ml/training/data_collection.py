"""
Data collection script for Bitcoin historical data
Supports multiple data sources: yfinance (primary), Alpha Vantage, CoinGecko
"""
import pandas as pd
import requests
import yfinance as yf
from datetime import datetime, timedelta
from typing import Optional
import os

# Optional dotenv support
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


class DataCollector:
    def __init__(self):
        self.alpha_vantage_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        self.use_alpha_vantage = os.getenv("USE_ALPHA_VANTAGE", "false").lower() == "true"

    # ----------------------------------------------------------------------
    # 1. YFINANCE (BEST SOURCE — HIGH ACCURACY, NO API KEY REQUIRED)
    # ----------------------------------------------------------------------
    def fetch_from_yfinance(self, days: int = 365) -> pd.DataFrame:
        """
        Fetch Bitcoin OHLCV data using yfinance.
        This is the recommended primary data source.
        """
        try:
            ticker = yf.Ticker("BTC-USD")

            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            data = ticker.history(start=start_date, end=end_date, interval="1d")

            if data.empty:
                print("yfinance returned empty data.")
                return pd.DataFrame()

            data = data.reset_index()

            data.rename(columns={
                'Date': 'date',
                'Open': 'open',
                'High': 'high',
                'Low': 'low',
                'Close': 'close',
                'Volume': 'volume'
            }, inplace=True)

            # Ensure correct data format
            data['date'] = pd.to_datetime(data['date']).dt.strftime('%Y-%m-%d')

            return data[['date', 'open', 'high', 'low', 'close', 'volume']]

        except Exception as e:
            print(f"Error fetching from yfinance: {e}")
            return pd.DataFrame()

    # ----------------------------------------------------------------------
    # 2. ALPHA VANTAGE (REQUIRES API KEY & SLOW — USE ONLY IF ENABLED)
    # ----------------------------------------------------------------------
    def fetch_from_alpha_vantage(self, days: int = 365) -> pd.DataFrame:
        """
        Fetch Bitcoin OHLCV from Alpha Vantage.
        Requires API key and may be slower.
        """
        if not self.alpha_vantage_key:
            print("Alpha Vantage API key not found. Skipping.")
            return pd.DataFrame()

        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "DIGITAL_CURRENCY_DAILY",
                "symbol": "BTC",
                "market": "USD",
                "apikey": self.alpha_vantage_key
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            if "Time Series (Digital Currency Daily)" not in data:
                print("Alpha Vantage data missing.")
                return pd.DataFrame()

            records = []
            for date_str, values in data["Time Series (Digital Currency Daily)"].items():
                records.append({
                    'date': date_str,
                    'open': float(values['1a. open (USD)']),
                    'high': float(values['2a. high (USD)']),
                    'low': float(values['3a. low (USD)']),
                    'close': float(values['4a. close (USD)']),
                    'volume': float(values['5. volume'])
                })

            df = pd.DataFrame(records)
            df = df.sort_values('date')

            if days < len(df):
                df = df.tail(days)

            return df

        except Exception as e:
            print(f"Error fetching from Alpha Vantage: {e}")
            return pd.DataFrame()

    # ----------------------------------------------------------------------
    # 3. CoinGecko (FALLBACK — ONLY CLOSE PRICE IS REAL, OHLC APPROXIMATED)
    # ----------------------------------------------------------------------
    def fetch_from_coingecko(self, days: int = 365) -> pd.DataFrame:
        """
        Fetch Bitcoin from CoinGecko.
        Provides close prices only; OHLC is approximated.
        """
        try:
            url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
            params = {
                "vs_currency": "usd",
                "days": days,
                "interval": "daily"
            }

            res = requests.get(url, params=params, timeout=10)
            res.raise_for_status()
            data = res.json()

            prices = data.get("prices", [])
            if not prices:
                print("CoinGecko returned empty data.")
                return pd.DataFrame()

            records = []
            for timestamp, price in prices:
                date = datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
                records.append({
                    'date': date,
                    'open': price,
                    'high': price * 1.02,  # approximate
                    'low': price * 0.98,   # approximate
                    'close': price,
                    'volume': 0
                })

            return pd.DataFrame(records)

        except Exception as e:
            print(f"Error fetching from CoinGecko: {e}")
            return pd.DataFrame()

    # ----------------------------------------------------------------------
    # MAIN DATA COLLECTION PIPELINE
    # ----------------------------------------------------------------------
    def collect_data(self, days: int = 365) -> pd.DataFrame:
        """
        Collect Bitcoin historical OHLCV data.
        Priority:
            1. yfinance
            2. Alpha Vantage (optional)
            3. CoinGecko (fallback)
        """
        print("Trying yfinance...")
        df = self.fetch_from_yfinance(days)
        if not df.empty:
            print(f"✓ Fetched {len(df)} records from yfinance")
            return df

        if self.use_alpha_vantage:
            print("Trying Alpha Vantage...")
            df = self.fetch_from_alpha_vantage(days)
            if not df.empty:
                print(f"✓ Fetched {len(df)} records from Alpha Vantage")
                return df

        print("Trying CoinGecko...")
        df = self.fetch_from_coingecko(days)
        if not df.empty:
            print(f"✓ Fetched {len(df)} records from CoinGecko")
            return df

        print("✗ Failed to collect Bitcoin data from all sources.")
        return pd.DataFrame()


# ----------------------------------------------------------------------
# Demo Run
# ----------------------------------------------------------------------
if __name__ == "__main__":
    collector = DataCollector()
    data = collector.collect_data(days=365)

    if not data.empty:
        print(f"\nData shape: {data.shape}")
        print("\nSample:")
        print(data.head())
        data.to_csv("bitcoin_data.csv", index=False)
        print("\n✓ Saved to bitcoin_data.csv")
    else:
        print("No data collected.")
