"""
Data collection script for Bitcoin historical data
Supports multiple data sources: CoinGecko, Alpha Vantage, yfinance
"""
import pandas as pd
import requests
import yfinance as yf
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import os

# Optional: Load environment variables if dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, continue without it (API keys can be set as env vars)
    pass

class DataCollector:
    def __init__(self):
        self.alpha_vantage_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        self.use_alpha_vantage = os.getenv("USE_ALPHA_VANTAGE", "false").lower() == "true"
    
    def fetch_from_yfinance(self, days: int = 365) -> pd.DataFrame:
        """
        Fetch Bitcoin data using yfinance (recommended - no API key needed)
        Returns actual OHLC data
        """
        try:
            # yfinance uses BTC-USD ticker
            ticker = yf.Ticker("BTC-USD")
            
            # Get historical data
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            data = ticker.history(start=start_date, end=end_date, interval="1d")
            
            if data.empty:
                return pd.DataFrame()
            
            # Reset index to get Date as column
            data.reset_index(inplace=True)
            
            # Rename columns to match our schema
            data.rename(columns={
                'Date': 'date',
                'Open': 'open',
                'High': 'high',
                'Low': 'low',
                'Close': 'close',
                'Volume': 'volume'
            }, inplace=True)
            
            # Convert date to string
            data['date'] = data['date'].dt.strftime('%Y-%m-%d')
            
            # Select only needed columns
            data = data[['date', 'open', 'high', 'low', 'close', 'volume']]
            
            return data
            
        except Exception as e:
            print(f"Error fetching from yfinance: {e}")
            return pd.DataFrame()
    
    def fetch_from_alpha_vantage(self, days: int = 365) -> pd.DataFrame:
        """
        Fetch Bitcoin data from Alpha Vantage
        Requires API key
        """
        if not self.alpha_vantage_key:
            print("Alpha Vantage API key not found")
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
            
            if "Error Message" in data:
                print(f"Alpha Vantage Error: {data['Error Message']}")
                return pd.DataFrame()
            
            if "Time Series (Digital Currency Daily)" not in data:
                print("No data returned from Alpha Vantage")
                return pd.DataFrame()
            
            time_series = data["Time Series (Digital Currency Daily)"]
            
            # Convert to DataFrame
            records = []
            for date_str, values in time_series.items():
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
            
            # Filter by days
            if days < len(df):
                df = df.tail(days)
            
            return df
            
        except Exception as e:
            print(f"Error fetching from Alpha Vantage: {e}")
            return pd.DataFrame()
    
    def fetch_from_coingecko(self, days: int = 365) -> pd.DataFrame:
        """
        Fetch Bitcoin data from CoinGecko (fallback)
        Only provides close prices, approximates OHLC
        """
        try:
            url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
            params = {
                "vs_currency": "usd",
                "days": days,
                "interval": "daily"
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            prices = data.get("prices", [])
            
            records = []
            for timestamp, price in prices:
                date = datetime.fromtimestamp(timestamp / 1000).date()
                records.append({
                    'date': date.isoformat(),
                    'open': price,
                    'high': price * 1.02,  # Approximate
                    'low': price * 0.98,    # Approximate
                    'close': price,
                    'volume': 0
                })
            
            df = pd.DataFrame(records)
            return df
            
        except Exception as e:
            print(f"Error fetching from CoinGecko: {e}")
            return pd.DataFrame()
    
    def collect_data(self, days: int = 365) -> pd.DataFrame:
        """
        Collect data from best available source
        Priority: yfinance > Alpha Vantage > CoinGecko
        """
        # Try yfinance first (best, no API key needed)
        df = self.fetch_from_yfinance(days)
        if not df.empty:
            print(f"✓ Collected {len(df)} records from yfinance")
            return df
        
        # Try Alpha Vantage if configured
        if self.use_alpha_vantage and self.alpha_vantage_key:
            df = self.fetch_from_alpha_vantage(days)
            if not df.empty:
                print(f"✓ Collected {len(df)} records from Alpha Vantage")
                return df
        
        # Fallback to CoinGecko
        df = self.fetch_from_coingecko(days)
        if not df.empty:
            print(f"✓ Collected {len(df)} records from CoinGecko (approximate OHLC)")
            return df
        
        print("✗ Failed to collect data from all sources")
        return pd.DataFrame()

if __name__ == "__main__":
    collector = DataCollector()
    data = collector.collect_data(days=365)
    
    if not data.empty:
        print(f"\nData shape: {data.shape}")
        print(f"\nFirst few rows:")
        print(data.head())
        print(f"\nLast few rows:")
        print(data.tail())
        
        # Save to CSV for inspection
        data.to_csv("bitcoin_data.csv", index=False)
        print(f"\n✓ Data saved to bitcoin_data.csv")
    else:
        print("No data collected")

