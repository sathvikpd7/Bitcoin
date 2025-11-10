# 🎓 How to Train the ML Model - Step by Step Guide

## 📋 Prerequisites

Before training, make sure you have:
- ✅ Python 3.8 or higher installed
- ✅ Internet connection (for downloading Bitcoin data)
- ✅ 5-10 minutes of time

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Navigate to ML Folder**
```bash
cd ml
```

### **Step 2: Install Dependencies**
```bash
pip install -r requirements.txt
```

### **Step 3: Train the Model**
```bash
python training/train_model.py
```

**That's it!** The model will be trained and saved automatically.

---

## 📝 Detailed Step-by-Step Instructions

### **Step 1: Open Terminal/Command Prompt**

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**Mac/Linux:**
- Open Terminal

### **Step 2: Navigate to Project Directory**

```bash
cd C:\Users\Hp\Desktop\Bitcoin
```

### **Step 3: Navigate to ML Folder**

```bash
cd ml
```

### **Step 4: Create Virtual Environment (Recommended)**

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Note:** Virtual environment is optional but recommended to avoid conflicts.

### **Step 5: Install Required Packages**

```bash
pip install -r requirements.txt
```

**What this installs:**
- pandas - Data manipulation
- numpy - Numerical computing
- scikit-learn - Machine learning utilities
- xgboost - XGBoost model
- joblib - Model saving/loading
- yfinance - Bitcoin data collection
- ta - Technical analysis indicators
- requests - API calls

**Expected output:**
```
Collecting pandas==2.1.3
  Downloading pandas-2.1.3...
...
Successfully installed pandas-2.1.3 numpy-1.26.2 ...
```

### **Step 6: Train the Model**

```bash
python training/train_model.py
```

**What happens:**
1. ✅ Collects Bitcoin historical data (2 years)
2. ✅ Creates 50+ technical features
3. ✅ Splits data into training/test sets
4. ✅ Trains XGBoost model
5. ✅ Evaluates model performance
6. ✅ Saves model to `ml/models/trained_model.pkl`

**Expected output:**
```
============================================================
BITCOIN PRICE PREDICTION - MODEL TRAINING
============================================================

============================================================
STEP 1: Data Collection
============================================================
Collecting data...
✓ Collected 730 records from yfinance

============================================================
STEP 2: Feature Engineering
============================================================
Engineering features...
✓ Created 65 features from 650 samples

============================================================
STEP 3: Model Training
============================================================
Training set: 520 samples
Test set: 130 samples

Training XGBoost model...
[0] train-rmse:5000.23  test-rmse:5200.45
[1] train-rmse:4800.12  test-rmse:5100.34
...
[199] train-rmse:350.12  test-rmse:450.23

============================================================
STEP 4: Model Evaluation
============================================================

Training Metrics:
  MAE:  $320.45
  RMSE: $350.12
  R²:   0.8923
  Accuracy (±2%): 87.5%

Test Metrics:
  MAE:  $420.67
  RMSE: $450.23
  R²:   0.8745
  Accuracy (±2%): 85.2%

============================================================
STEP 5: Saving Model
============================================================

✓ Model saved to: ../models/trained_model.pkl
✓ Feature columns saved to: ../models/trained_model_features.pkl

============================================================
TRAINING COMPLETE!
============================================================

✓ Model saved successfully
✓ Test Accuracy: 85.20%
✓ Test R² Score: 0.8745

You can now use this model in the backend!
Model location: ../models/trained_model.pkl
```

---

## ⏱️ Training Time

- **Data Collection:** 1-2 minutes
- **Feature Engineering:** 30 seconds
- **Model Training:** 3-5 minutes
- **Total:** ~5-10 minutes

---

## ✅ Verify Training Success

After training completes, check:

1. **Model file exists:**
   ```bash
   ls models/trained_model.pkl
   # or on Windows:
   dir models\trained_model.pkl
   ```

2. **File size should be:** 2-5 MB

3. **Check training output:**
   - Should show accuracy > 80%
   - Should show R² score > 0.80
   - Should say "TRAINING COMPLETE!"

---

## 🔄 Using the Trained Model

Once training is complete:

1. **Start the backend:**
   ```bash
   cd ../backend
   python run.py
   ```

2. **Check backend logs:**
   - Should see: `Model loaded from ../ml/models/trained_model.pkl`
   - NOT: `Model not found... Using fallback`

3. **Test predictions:**
   - Open frontend
   - Go to Bitcoin Price Predictor
   - Make a prediction
   - Should use trained model!

---

## 🐛 Troubleshooting

### **Problem: "Module not found" error**

**Solution:**
```bash
# Make sure you're in the ml folder
cd ml

# Install dependencies again
pip install -r requirements.txt
```

### **Problem: "No data collected"**

**Solution:**
- Check internet connection
- Try again (data source might be temporarily unavailable)
- The script tries multiple data sources automatically

### **Problem: "Training failed"**

**Solution:**
- Check Python version: `python --version` (should be 3.8+)
- Make sure all packages installed: `pip list`
- Check error message for specific issue

### **Problem: Low accuracy (< 70%)**

**Solution:**
- This is normal for first training
- Try training with more data (modify `days=730` to `days=1095` in train_model.py)
- Bitcoin prices are highly volatile - 80-85% accuracy is good

### **Problem: Model file not found after training**

**Solution:**
- Check if `ml/models/` folder exists
- Check file path in error message
- Make sure training completed successfully

---

## 🎯 Training Options

### **Train with More Data (Better Accuracy)**

Edit `ml/training/train_model.py`:

```python
# Change this line (around line 200):
X, y, features_df = trainer.prepare_data(days=730)  # 2 years

# To:
X, y, features_df = trainer.prepare_data(days=1095)  # 3 years
```

### **Train with Different Model Parameters**

Edit `ml/training/train_model.py`:

```python
# In the train() method, modify:
self.model = xgb.XGBRegressor(
    n_estimators=200,      # Increase for better accuracy (slower)
    max_depth=6,           # Increase for complex patterns
    learning_rate=0.1,     # Decrease for better accuracy (slower)
    ...
)
```

---

## 📊 Understanding Training Output

### **Metrics Explained:**

- **MAE (Mean Absolute Error):** Average prediction error in dollars
  - Lower is better
  - Example: $420 means average error is $420

- **RMSE (Root Mean Squared Error):** Penalizes large errors more
  - Lower is better
  - Example: $450 means typical error is around $450

- **R² Score:** How well model explains price variance
  - Range: 0 to 1
  - 0.85 = 85% of price variance explained
  - Higher is better

- **Accuracy (±2%):** Percentage of predictions within 2% of actual price
  - Higher is better
  - 85% = 85 out of 100 predictions are within 2%

### **Good Results:**
- ✅ Accuracy: > 80%
- ✅ R² Score: > 0.80
- ✅ MAE: < $500 (for Bitcoin prices around $60k)

---

## 🔁 Retraining the Model

To retrain with fresh data:

1. **Delete old model (optional):**
   ```bash
   rm ml/models/trained_model.pkl
   ```

2. **Run training again:**
   ```bash
   cd ml
   python training/train_model.py
   ```

**When to retrain:**
- Monthly (to include latest market data)
- After major market events
- If prediction accuracy drops
- When you want to improve model

---

## 📁 File Structure After Training

```
ml/
├── models/
│   ├── trained_model.pkl          ← Trained model (2-5 MB)
│   └── trained_model_features.pkl ← Feature list
├── training/
│   ├── train_model.py
│   ├── data_collection.py
│   └── feature_engineering.py
└── requirements.txt
```

---

## 🎉 Success Checklist

After training, you should have:

- ✅ `ml/models/trained_model.pkl` file exists
- ✅ Training shows accuracy > 80%
- ✅ No errors in training output
- ✅ Model file size: 2-5 MB
- ✅ Backend can load model successfully

---

## 💡 Tips for Better Results

1. **More Data = Better Model**
   - Use 2-3 years of data (730-1095 days)
   - More historical data helps model learn patterns

2. **Regular Retraining**
   - Retrain monthly with fresh data
   - Markets change, model should adapt

3. **Monitor Performance**
   - Check accuracy metrics
   - Compare with previous training
   - Adjust if accuracy drops

4. **Feature Engineering**
   - Current script creates 50+ features
   - Can add more indicators if needed

---

## 🚀 Next Steps After Training

1. ✅ Model is trained and saved
2. ✅ Start backend: `cd ../backend && python run.py`
3. ✅ Verify model loads (check logs)
4. ✅ Test predictions in frontend
5. ✅ Enjoy ML-powered predictions!

---

## ❓ Still Having Issues?

1. **Check Python version:**
   ```bash
   python --version  # Should be 3.8+
   ```

2. **Verify packages installed:**
   ```bash
   pip list | grep -E "pandas|numpy|xgboost|yfinance"
   ```

3. **Check internet connection:**
   - Training needs internet to download data

4. **Review error messages:**
   - They usually indicate the specific problem

5. **Try training again:**
   - Sometimes data sources are temporarily unavailable

---

## 📞 Quick Reference

**Training Command:**
```bash
cd ml && pip install -r requirements.txt && python training/train_model.py
```

**Expected Time:** 5-10 minutes

**Expected Accuracy:** 80-90%

**Model Location:** `ml/models/trained_model.pkl`

**Success Indicator:** "TRAINING COMPLETE!" message with accuracy > 80%

---

Good luck with training! 🎓🚀

