import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictionResults = ({ prediction, modelMetrics, isVisible }) => {
  if (!isVisible || !prediction) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${(value * 100)?.toFixed(2)}%`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.7) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'High Confidence';
    if (confidence >= 0.7) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-financial animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Prediction Results
        </h2>
        <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success font-medium">
            Analysis Complete
          </span>
        </div>
      </div>
      {/* Main Prediction Display */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Icon 
              name="TrendingUp" 
              size={32} 
              color="var(--color-primary)"
              strokeWidth={2}
            />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {prediction?.predictionDate 
              ? `Predicted Price for ${new Date(prediction.predictionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
              : 'Predicted Next Close Price'}
          </h3>
          {prediction?.basedOnDate && (
            <p className="text-xs text-muted-foreground mb-2">
              Based on today's price ({new Date(prediction.basedOnDate).toLocaleDateString()})
            </p>
          )}
          <div className="text-4xl font-bold text-primary mb-2 data-mono">
            {formatCurrency(prediction?.nextClosePrice)}
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`flex items-center space-x-1 ${getConfidenceColor(prediction?.confidence)}`}>
              <Icon name="Target" size={16} />
              <span className="font-medium">
                {getConfidenceLabel(prediction?.confidence)}
              </span>
            </div>
            <div className="text-muted-foreground">
              {formatPercentage(prediction?.confidence)} Accuracy
            </div>
          </div>
        </div>
      </div>
      {/* Price Change Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="ArrowUp" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-muted-foreground">
              Price Change
            </span>
          </div>
          <div className="text-lg font-semibold text-success data-mono">
            +{formatCurrency(prediction?.priceChange)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatPercentage(prediction?.percentageChange)} increase
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="BarChart3" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-muted-foreground">
              Volatility
            </span>
          </div>
          <div className="text-lg font-semibold text-foreground data-mono">
            {formatPercentage(prediction?.volatility)}
          </div>
          <div className="text-xs text-muted-foreground">
            Expected price variance
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} color="var(--color-accent)" />
            <span className="text-sm font-medium text-muted-foreground">
              Prediction Time
            </span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {new Date(prediction.timestamp)?.toLocaleTimeString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(prediction.timestamp)?.toLocaleDateString()}
          </div>
        </div>
      </div>
      {/* Model Performance Metrics */}
      {modelMetrics && (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Model Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Training Accuracy</span>
                <span className="text-sm font-semibold text-foreground data-mono">
                  {formatPercentage(modelMetrics?.trainingAccuracy)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${modelMetrics?.trainingAccuracy * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Validation Accuracy</span>
                <span className="text-sm font-semibold text-foreground data-mono">
                  {formatPercentage(modelMetrics?.validationAccuracy)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${modelMetrics?.validationAccuracy * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {modelMetrics && (modelMetrics.dataPoints > 0 || modelMetrics.features > 0) && (
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <span>
                    {modelMetrics.dataPoints > 0 
                      ? `Model trained on ${modelMetrics.dataPoints.toLocaleString()} historical data points`
                      : 'Model information'}
                    {modelMetrics.features > 0 && ` with ${modelMetrics.features} features`}
                  </span>
                </div>
              </div>
            )}
            
            {/* Show which model was actually used for this prediction */}
            {prediction?.model_used && (
              <div className={`p-3 rounded-lg border ${
                prediction.model_used === 'trained' 
                  ? 'bg-success/10 border-success/20' 
                  : 'bg-warning/10 border-warning/20'
              }`}>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon 
                    name={prediction.model_used === 'trained' ? 'CheckCircle' : 'AlertCircle'} 
                    size={16} 
                    color={prediction.model_used === 'trained' ? 'var(--color-success)' : 'var(--color-warning)'}
                  />
                  <span className={prediction.model_used === 'trained' ? 'text-success font-medium' : 'text-warning font-medium'}>
                    {prediction.model_used === 'trained' 
                      ? `✅ Using trained ${modelMetrics?.model_type || 'ML'} model for this prediction`
                      : '⚠️ Using fallback heuristic prediction (trained model not available or incompatible)'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;