from typing import Dict, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.data_service import data_service
from app.services.ml_service import ml_service

class BacktestService:
    def run_backtest(
        self,
        db: Session,
        start_date: str,
        end_date: str,
        strategy: str,
        starting_cash: float
    ) -> Dict:
        """Run backtesting simulation"""
        try:
            # Get historical data
            historical_data = data_service.get_ohlc_data(
                db, start_date=start_date, end_date=end_date, limit=1000
            )
            
            if not historical_data:
                return {
                    "error": "No historical data available for the selected date range"
                }
            
            # Sort by date ascending
            historical_data.sort(key=lambda x: x["date"])
            
            # Initialize backtest state
            cash = starting_cash
            position = 0  # Number of Bitcoin held
            equity_curve = [cash]
            trades = []
            wins = 0
            losses = 0
            
            # Run backtest
            for i in range(len(historical_data) - 1):
                current = historical_data[i]
                next_day = historical_data[i + 1]
                
                # Get prediction for current day
                prediction = ml_service.predict(
                    current["open"],
                    current["high"],
                    current["low"],
                    current["close"]
                )
                
                predicted_price = prediction["nextClosePrice"]
                actual_next_close = next_day["close"]
                
                # Strategy logic
                if strategy == "directional":
                    # Buy if predicted to go up, sell if predicted to go down
                    if predicted_price > current["close"] and position == 0:
                        # Buy
                        position = cash / current["close"]
                        cash = 0
                        trades.append({
                            "type": "buy",
                            "price": current["close"],
                            "date": current["date"]
                        })
                    elif predicted_price < current["close"] and position > 0:
                        # Sell
                        cash = position * current["close"]
                        position = 0
                        trades.append({
                            "type": "sell",
                            "price": current["close"],
                            "date": current["date"]
                        })
                        # Check if profitable
                        if cash > starting_cash:
                            wins += 1
                        else:
                            losses += 1
                
                elif strategy == "meanreversion":
                    # Buy when price is below predicted, sell when above
                    if current["close"] < predicted_price * 0.98 and position == 0:
                        position = cash / current["close"]
                        cash = 0
                        trades.append({
                            "type": "buy",
                            "price": current["close"],
                            "date": current["date"]
                        })
                    elif current["close"] > predicted_price * 1.02 and position > 0:
                        cash = position * current["close"]
                        position = 0
                        trades.append({
                            "type": "sell",
                            "price": current["close"],
                            "date": current["date"]
                        })
                        if cash > starting_cash:
                            wins += 1
                        else:
                            losses += 1
                
                # Calculate current equity
                current_equity = cash + (position * current["close"])
                equity_curve.append(current_equity)
            
            # Final equity
            final_equity = cash + (position * historical_data[-1]["close"])
            total_return = ((final_equity - starting_cash) / starting_cash) * 100
            
            # Calculate metrics
            win_rate = (wins / len(trades) * 100) if trades else 0
            
            # Calculate max drawdown
            peak = starting_cash
            max_drawdown = 0
            for equity in equity_curve:
                if equity > peak:
                    peak = equity
                drawdown = ((peak - equity) / peak) * 100
                if drawdown > max_drawdown:
                    max_drawdown = drawdown
            
            # Calculate Sharpe ratio (simplified)
            returns = [(equity_curve[i] - equity_curve[i-1]) / equity_curve[i-1] 
                      for i in range(1, len(equity_curve)) if equity_curve[i-1] > 0]
            avg_return = sum(returns) / len(returns) if returns else 0
            sharpe = (avg_return / (max_drawdown / 100)) if max_drawdown > 0 else 0
            
            return {
                "equity": equity_curve,
                "trades": len(trades),
                "winRate": round(win_rate, 2),
                "maxDrawdown": round(max_drawdown, 2),
                "sharpe": round(sharpe, 2),
                "totalReturn": round(total_return, 2),
                "finalEquity": round(final_equity, 2)
            }
            
        except Exception as e:
            return {
                "error": f"Backtest failed: {str(e)}"
            }

# Singleton instance
backtest_service = BacktestService()

