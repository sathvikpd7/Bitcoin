import React, { useEffect, useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ApplicationHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersLight = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const startLight = stored ? stored === 'light' : prefersLight;
    if (startLight) {
      document.documentElement.classList.add('light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('light');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const nextIsDark = !prev;
      if (nextIsDark) {
        document.documentElement.classList.remove('light');
        try { localStorage.setItem('theme', 'dark'); } catch {}
      } else {
        document.documentElement.classList.add('light');
        try { localStorage.setItem('theme', 'light'); } catch {}
      }
      return nextIsDark;
    });
  };

  const NavLinks = () => (
    <>
      {[
        { href: '/', label: 'Predictor' },
        { href: '/data-explorer', label: 'Data' },
        { href: '/backtesting', label: 'Backtesting' },
        { href: '/model-lab', label: 'Model Lab' },
        { href: '/settings', label: 'Settings' }
      ].map((item) => {
        const isActive = typeof window !== 'undefined' && window.location && window.location.pathname === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors border ${
              isActive
                ? 'bg-primary/20 text-primary border-primary/30'
                : 'text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/30 border-transparent'
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-financial">
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

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks />
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="Menu" size={18} color="currentColor" />
          </Button>
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70" onClick={() => setMobileOpen(false)}></div>
          <div className="absolute top-0 right-0 h-full w-72 bg-card border-l border-border shadow-financial-lg p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Navigation</div>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setMobileOpen(false)}>
                <Icon name="X" size={16} color="currentColor" />
              </Button>
            </div>
            <div className="flex flex-col space-y-2">
              {[
                { href: '/', label: 'Predictor' },
                { href: '/data-explorer', label: 'Data' },
                { href: '/backtesting', label: 'Backtesting' },
                { href: '/model-lab', label: 'Model Lab' },
                { href: '/settings', label: 'Settings' }
              ].map((item) => {
                const isActive = typeof window !== 'undefined' && window.location && window.location.pathname === item.href;
                return (
                  <a
                    key={`m-${item.href}`}
                    href={item.href}
                    className={`text-sm px-3 py-2 rounded-md transition-colors border ${
                      isActive
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/30 border-transparent'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ApplicationHeader;