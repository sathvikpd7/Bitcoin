import React from 'react';
import Icon from '../AppIcon';

const LoadingOverlay = ({ 
  isVisible = false, 
  message = "Processing prediction...", 
  progress = null,
  onCancel = null 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-lg shadow-financial-lg p-8 max-w-sm w-full mx-4 animate-slide-up">
        {/* Loading Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon 
                name="Brain" 
                size={24} 
                color="var(--color-primary)"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Analyzing Market Data
          </h3>
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        {/* Progress Bar (if provided) */}
        {progress !== null && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Progress
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Processing Steps */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Data preprocessing complete</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-foreground">Running ML prediction model</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <span className="text-muted-foreground">Generating confidence intervals</span>
          </div>
        </div>

        {/* Cancel Button (if provided) */}
        {onCancel && (
          <div className="flex justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 border border-border rounded-md hover:bg-muted/50"
            >
              Cancel Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;