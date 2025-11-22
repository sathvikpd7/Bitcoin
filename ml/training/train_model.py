"""
Train XGBoost model for Bitcoin price prediction
"""
import pandas as pd  # type: ignore
import numpy as np  # type: ignore
import joblib  # type: ignore
from pathlib import Path
from sklearn.model_selection import train_test_split  # type: ignore
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score  # type: ignore
import xgboost as xgb  # type: ignore
from data_collection import DataCollector
from feature_engineering import FeatureEngineer
import warnings
warnings.filterwarnings('ignore')

class ModelTrainer:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        self.scaler = None
        
    def prepare_data(self, days: int = 365) -> tuple:
        """
        Collect and prepare data for training
        """
        print("=" * 60)
        print("STEP 1: Data Collection")
        print("=" * 60)
        
        collector = DataCollector()
        raw_data = collector.collect_data(days=days)
        
        if raw_data.empty:
            raise ValueError("No data collected. Check your data source.")
        
        print(f"\n✓ Collected {len(raw_data)} records")
        
        print("\n" + "=" * 60)
        print("STEP 2: Feature Engineering")
        print("=" * 60)
        
        engineer = FeatureEngineer()
        features = engineer.create_features(raw_data)
        
        if features.empty:
            raise ValueError("Feature engineering failed. No features created.")
        
        print(f"\n✓ Created {features.shape[1]} features from {len(features)} samples")
        
        # Separate features and target
        exclude_cols = ['date', 'target', 'open', 'high', 'low', 'close']
        if 'volume' in features.columns:
            exclude_cols.append('volume')
        
        feature_cols = [col for col in features.columns if col not in exclude_cols]
        self.feature_columns = feature_cols
        
        X = features[feature_cols].values
        y = features['target'].values
        
        print(f"\n✓ Prepared {len(feature_cols)} features")
        print(f"  Sample features: {feature_cols[:10]}")
        
        return X, y, features
    
    def train(self, X: np.ndarray, y: np.ndarray, test_size: float = 0.2):
        """
        Train XGBoost model
        """
        print("\n" + "=" * 60)
        print("STEP 3: Model Training")
        print("=" * 60)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, shuffle=False
        )
        
        print(f"\nTraining set: {len(X_train)} samples")
        print(f"Test set: {len(X_test)} samples")
        
        print("\nTraining XGBoost model...")
        
        # UPDATED FOR XGBOOST 2.x
        self.model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            verbosity=1,
            eval_metric="rmse"   # moved from fit() to here
        )
        
        # UPDATED: removed eval_metric from fit()
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_train, y_train), (X_test, y_test)],
            verbose=True
        )
        
        print("\n" + "=" * 60)
        print("STEP 4: Model Evaluation")
        print("=" * 60)
        
        y_train_pred = self.model.predict(X_train)
        y_test_pred = self.model.predict(X_test)
        
        train_mae = mean_absolute_error(y_train, y_train_pred)
        test_mae = mean_absolute_error(y_test, y_test_pred)
        
        train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
        test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
        
        train_r2 = r2_score(y_train, y_train_pred)
        test_r2 = r2_score(y_test, y_test_pred)
        
        # Accuracy = % within 2% error
        train_accuracy = np.mean(np.abs((y_train - y_train_pred) / y_train) < 0.02) * 100
        test_accuracy = np.mean(np.abs((y_test - y_test_pred) / y_test) < 0.02) * 100
        
        print(f"\nTraining Metrics:")
        print(f"  MAE:  ${train_mae:.2f}")
        print(f"  RMSE: ${train_rmse:.2f}")
        print(f"  R²:   {train_r2:.4f}")
        print(f"  Accuracy (±2%): {train_accuracy:.2f}%")
        
        print(f"\nTest Metrics:")
        print(f"  MAE:  ${test_mae:.2f}")
        print(f"  RMSE: ${test_rmse:.2f}")
        print(f"  R²:   {test_r2:.4f}")
        print(f"  Accuracy (±2%): {test_accuracy:.2f}%")
        
        return {
            'train_mae': train_mae,
            'test_mae': test_mae,
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'train_r2': train_r2,
            'test_r2': test_r2,
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy
        }
    
    def save_model(self, model_path: str = "../models/trained_model.pkl"):
        """
        Save trained model and feature names
        """
        print("\n" + "=" * 60)
        print("STEP 5: Saving Model")
        print("=" * 60)
        
        model_dir = Path(model_path).parent
        model_dir.mkdir(parents=True, exist_ok=True)
        
        joblib.dump(self.model, model_path)
        print(f"\n✓ Model saved to: {model_path}")
        
        feature_path = model_path.replace('.pkl', '_features.pkl')
        joblib.dump(self.feature_columns, feature_path)
        print(f"✓ Feature columns saved to: {feature_path}")
        
        return model_path

def main():
    print("\n" + "=" * 60)
    print("BITCOIN PRICE PREDICTION - MODEL TRAINING")
    print("=" * 60)
    
    try:
        trainer = ModelTrainer()
        
        X, y, features_df = trainer.prepare_data(days=730)
        
        metrics = trainer.train(X, y, test_size=0.2)
        
        model_path = trainer.save_model()
        
        print("\n" + "=" * 60)
        print("TRAINING COMPLETE!")
        print("=" * 60)
        print(f"\n✓ Model saved successfully")
        print(f"✓ Test Accuracy: {metrics['test_accuracy']:.2f}%")
        print(f"✓ Test R² Score: {metrics['test_r2']:.4f}")
        print(f"\nModel location: {model_path}")
        
    except Exception as e:
        print(f"\n✗ Training failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
