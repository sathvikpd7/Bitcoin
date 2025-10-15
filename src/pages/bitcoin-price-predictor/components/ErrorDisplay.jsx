import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorDisplay = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'WifiOff';
      case 'validation':
        return 'AlertTriangle';
      case 'server':
        return 'Server';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Connection Error';
      case 'validation':
        return 'Invalid Input Data';
      case 'server':
        return 'Server Error';
      default:
        return 'Prediction Failed';
    }
  };

  const getErrorDescription = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Unable to connect to the prediction service. Please check your internet connection and try again.';
      case 'validation':
        return 'The provided price data contains invalid values. Please verify your input and ensure all prices are positive numbers.';
      case 'server':
        return 'The prediction service is temporarily unavailable. Our team has been notified and is working to resolve the issue.';
      default:
        return 'An unexpected error occurred while processing your prediction request. Please try again or contact support if the problem persists.';
    }
  };

  return (
    <div className="bg-card border border-error/20 rounded-lg p-6 shadow-financial animate-slide-up">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
            <Icon 
              name={getErrorIcon(error?.type)} 
              size={24} 
              color="var(--color-error)"
              strokeWidth={2}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {getErrorTitle(error?.type)}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {error?.message || getErrorDescription(error?.type)}
          </p>
          
          {/* Error Details (for development/debugging) */}
          {error?.details && (
            <div className="bg-muted/20 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Code" size={16} color="var(--color-muted-foreground)" />
                <span className="text-xs font-medium text-muted-foreground">
                  Technical Details
                </span>
              </div>
              <pre className="text-xs text-muted-foreground font-mono overflow-x-auto">
                {JSON.stringify(error?.details, null, 2)}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button
                variant="default"
                onClick={onRetry}
                iconName="RefreshCw"
                iconPosition="left"
                className="flex-1 sm:flex-none"
              >
                Try Again
              </Button>
            )}
            
            {onDismiss && (
              <Button
                variant="outline"
                onClick={onDismiss}
                iconName="X"
                iconPosition="left"
                className="flex-1 sm:flex-none"
              >
                Dismiss
              </Button>
            )}

            {/* Help/Support Button */}
            <Button
              variant="ghost"
              onClick={() => window.open('mailto:support@bitcoinpredictor.com', '_blank')}
              iconName="HelpCircle"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Get Help
            </Button>
          </div>
        </div>
      </div>
      {/* Error Prevention Tips */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Prevention Tips
        </h4>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle2" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Ensure all price values are positive numbers with up to 2 decimal places
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle2" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Verify that High &gt; Low and Open/Close are within the High-Low range
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle2" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Check your internet connection before submitting predictions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;