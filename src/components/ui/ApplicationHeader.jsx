import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ApplicationHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Theme toggle logic would be implemented here
    document.documentElement?.classList?.toggle('dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-financial">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon 
              name="TrendingUp" 
              size={24} 
              color="white" 
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Bitcoin Price Predictor
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Real-Time ML-Powered Analysis
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          {/* Prediction Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-card rounded-lg border border-border">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground font-medium">
              Model Active
            </span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
          >
            <Icon 
              name={isDarkMode ? "Sun" : "Moon"} 
              size={18} 
              color="currentColor"
            />
          </Button>

          {/* Settings Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
          >
            <Icon 
              name="Settings" 
              size={18} 
              color="currentColor"
            />
          </Button>

          {/* Help/Info */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
          >
            <Icon 
              name="HelpCircle" 
              size={18} 
              color="currentColor"
            />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Indicator */}
      <div className="md:hidden px-6 pb-2">
        <div className="flex items-center justify-center space-x-2 py-1">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground font-medium">
            ML Model Ready
          </span>
        </div>
      </div>
    </header>
  );
};

export default ApplicationHeader;