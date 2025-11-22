import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ApplicationHeader from '../components/ui/ApplicationHeader';
import { postJson, getApiBaseUrl, getJson } from '../utils/api';

const Backtesting = () => {
  const [form, setForm] = useState({ start: '', end: '', strategy: 'directional', cash: 10000 });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const syncData = async (days = 365) => {
    setIsSyncing(true);
    setError(null);
    try {
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        throw new Error('Backend API is not configured. Please configure the API base URL in Settings.');
      }

      const response = await fetch(`${apiBaseUrl}/api/data/sync?days=${days}`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Failed to sync data: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error syncing data:', err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const runBacktest = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        throw new Error('Backend API is not configured. Please configure the API base URL in Settings to run backtests.');
      }

      if (!form.start || !form.end) {
        throw new Error('Please select both start and end dates.');
      }

      // First, try to run the backtest
      let response;
      try {
        response = await postJson('/api/backtest', {
          start_date: form.start,
          end_date: form.end,
          strategy: form.strategy,
          starting_cash: form.cash
        });
      } catch (backtestError) {
        // If error is about missing data, try to sync data automatically
        const errorMessage = backtestError.message || '';
        if (errorMessage.includes('No historical data') || errorMessage.includes('No price data')) {
          // Calculate days needed for sync
          const startDate = new Date(form.start);
          const endDate = new Date(form.end);
          const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 30; // Add 30 day buffer
          const daysToSync = Math.min(Math.max(daysDiff, 30), 365); // Between 30 and 365 days
          
          setError('No data available. Syncing historical data...');
          setIsLoading(false);
          setIsSyncing(true);
          
          try {
            await syncData(daysToSync);
            // Retry backtest after syncing
            setIsSyncing(false);
            setIsLoading(true);
            response = await postJson('/api/backtest', {
              start_date: form.start,
              end_date: form.end,
              strategy: form.strategy,
              starting_cash: form.cash
            });
          } catch (syncError) {
            throw new Error(`Failed to sync data: ${syncError.message}. Please try syncing data manually using the "Sync Data" button.`);
          }
        } else {
          throw backtestError;
        }
      }
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response || !response.equity) {
        throw new Error('Invalid response from backtest API');
      }
      
      setResults(response);
    } catch (err) {
      console.error('Error running backtest:', err);
      setError(err.message || 'Failed to run backtest. Please ensure your backend API is running and configured correctly.');
      setResults(null);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Backtesting</h1>
            <form onSubmit={runBacktest} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Start Date</label>
                <input type="date" className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">End Date</label>
                <input type="date" className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Strategy</label>
                <select className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })}>
                  <option value="directional">Directional (follow predicted move)</option>
                  <option value="meanreversion">Mean Reversion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Starting Cash</label>
                <input type="number" className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.cash} onChange={(e) => setForm({ ...form, cash: Number(e.target.value || 0) })} />
              </div>
              <div className="md:col-span-5 flex items-end justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, start: '2024-01-01', end: '2024-12-31' }))} className="px-3 py-1.5 text-xs rounded-md border border-border">2024</button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, start: '2025-01-01', end: '2025-12-31' }))} className="px-3 py-1.5 text-xs rounded-md border border-border">2025</button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, strategy: 'directional' }))} className="px-3 py-1.5 text-xs rounded-md border border-border">Directional</button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, strategy: 'meanreversion' }))} className="px-3 py-1.5 text-xs rounded-md border border-border">Mean Rev</button>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={async () => {
                      try {
                        setError(null);
                        await syncData(365);
                        setError('Data synced successfully! You can now run backtests.');
                        setTimeout(() => setError(null), 3000);
                      } catch (err) {
                        setError(err.message || 'Failed to sync data');
                      }
                    }}
                    disabled={isSyncing || isLoading}
                    className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSyncing ? 'Syncing...' : 'Sync Data'}
                  </button>
                  <button type="submit" disabled={isLoading || isSyncing} className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50">
                    {isLoading ? 'Running...' : 'Run Backtest'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {error && (
            <div className={`bg-card border border-border rounded-lg p-6 shadow-financial ${
              error.includes('successfully') ? 'border-success' : 'border-error'
            }`}>
              <div className={`text-sm ${error.includes('successfully') ? 'text-success' : 'text-error'}`}>
                {error}
              </div>
              {error.includes('No historical data') && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Tip: Click "Sync Data" button to fetch historical Bitcoin data from the API.
                </div>
              )}
            </div>
          )}

          {(isSyncing || (isLoading && error && error.includes('Syncing'))) && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <div className="text-sm text-foreground">Syncing historical Bitcoin data... This may take a moment.</div>
              </div>
            </div>
          )}

          {results && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
              <h2 className="text-lg font-semibold text-foreground mb-3">Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div><div className="text-xs text-muted-foreground">Trades</div><div className="text-lg font-semibold">{results.trades}</div></div>
                <div><div className="text-xs text-muted-foreground">Win Rate</div><div className="text-lg font-semibold">{results.winRate}%</div></div>
                <div><div className="text-xs text-muted-foreground">Max Drawdown</div><div className="text-lg font-semibold">{results.maxDrawdown}%</div></div>
                <div><div className="text-xs text-muted-foreground">Sharpe</div><div className="text-lg font-semibold">{results.sharpe}</div></div>
              </div>
              <div className="text-sm text-muted-foreground">Equity Curve</div>
              <div className="mt-2 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.equity.map((v, i) => ({ step: i, equity: v }))} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="step" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="equity" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Backtesting;


