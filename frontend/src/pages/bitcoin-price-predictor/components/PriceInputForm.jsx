import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PriceInputForm = ({ onPredict, isLoading }) => {
  const [formData, setFormData] = useState({
    open: '',
    high: '',
    low: '',
    close: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Check if all fields are filled
    Object.keys(formData)?.forEach(key => {
      if (!formData?.[key] || formData?.[key]?.trim() === '') {
        newErrors[key] = `${key?.charAt(0)?.toUpperCase() + key?.slice(1)} price is required`;
      } else {
        const value = parseFloat(formData?.[key]);
        if (isNaN(value) || value <= 0) {
          newErrors[key] = `Please enter a valid ${key} price`;
        }
      }
    });

    // Validate price relationships
    if (!newErrors?.high && !newErrors?.low && formData?.high && formData?.low) {
      const high = parseFloat(formData?.high);
      const low = parseFloat(formData?.low);
      if (high <= low) {
        newErrors.high = 'High price must be greater than low price';
        newErrors.low = 'Low price must be less than high price';
      }
    }

    // Validate open and close are within high-low range
    if (!newErrors?.open && !newErrors?.high && !newErrors?.low && formData?.open && formData?.high && formData?.low) {
      const open = parseFloat(formData?.open);
      const high = parseFloat(formData?.high);
      const low = parseFloat(formData?.low);
      if (open > high || open < low) {
        newErrors.open = 'Open price must be between low and high prices';
      }
    }

    if (!newErrors?.close && !newErrors?.high && !newErrors?.low && formData?.close && formData?.high && formData?.low) {
      const close = parseFloat(formData?.close);
      const high = parseFloat(formData?.high);
      const low = parseFloat(formData?.low);
      if (close > high || close < low) {
        newErrors.close = 'Close price must be between low and high prices';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const numericData = {
        open: parseFloat(formData?.open),
        high: parseFloat(formData?.high),
        low: parseFloat(formData?.low),
        close: parseFloat(formData?.close)
      };
      onPredict(numericData);
    }
  };

  const handleReset = () => {
    setFormData({
      open: '',
      high: '',
      low: '',
      close: ''
    });
    setErrors({});
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Historical Price Data Input
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter Bitcoin's OHLC (Open, High, Low, Close) prices in USD to generate ML-powered predictions
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Open Price"
            type="number"
            placeholder="e.g., 45000.00"
            value={formData?.open}
            onChange={(e) => handleInputChange('open', e?.target?.value)}
            error={errors?.open}
            required
            step="0.01"
            min="0"
            description="Opening price for the trading period"
          />

          <Input
            label="High Price"
            type="number"
            placeholder="e.g., 47500.00"
            value={formData?.high}
            onChange={(e) => handleInputChange('high', e?.target?.value)}
            error={errors?.high}
            required
            step="0.01"
            min="0"
            description="Highest price during the trading period"
          />

          <Input
            label="Low Price"
            type="number"
            placeholder="e.g., 44200.00"
            value={formData?.low}
            onChange={(e) => handleInputChange('low', e?.target?.value)}
            error={errors?.low}
            required
            step="0.01"
            min="0"
            description="Lowest price during the trading period"
          />

          <Input
            label="Close Price"
            type="number"
            placeholder="e.g., 46800.00"
            value={formData?.close}
            onChange={(e) => handleInputChange('close', e?.target?.value)}
            error={errors?.close}
            required
            step="0.01"
            min="0"
            description="Closing price for the trading period"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="TrendingUp"
            iconPosition="left"
            className="flex-1"
          >
            {isLoading ? 'Analyzing...' : 'Predict Price'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
            disabled={isLoading}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PriceInputForm;