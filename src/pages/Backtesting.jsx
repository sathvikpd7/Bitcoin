import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ApplicationHeader from '../components/ui/ApplicationHeader';
import { postJson, getApiBaseUrl } from '../utils/api';

const Backtesting = () => {
  const [form, setForm] = useState({ start: '', end: '', strategy: 'directional', cash: 10000 });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runBacktest = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const apiBaseUrl = getApiBaseUrl();
      if (apiBaseUrl && form.start && form.end) {
        const response = await postJson('/api/backtest', {
          start_date: form.start,
          end_date: form.end,
          strategy: form.strategy,
          starting_cash: form.cash
        });
        
        if (response.error) {
          setError(response.error);
        } else {
          setResults(response);
        }
      } else {
        // Fallback to mock data if API not configured
        const equity = [form.cash, form.cash * 1.03, form.cash * 0.98, form.cash * 1.1];
        setResults({
          equity,
          trades: 12,
          winRate: 58,
          maxDrawdown: 6.5,
          sharpe: 1.2
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to run backtest');
      // Fallback to mock data on error
      const equity = [form.cash, form.cash * 1.03, form.cash * 0.98, form.cash * 1.1];
      setResults({
        equity,
        trades: 12,
        winRate: 58,
        maxDrawdown: 6.5,
        sharpe: 1.2
      });
    } finally {
      setIsLoading(false);
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
                <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50">
                  {isLoading ? 'Running...' : 'Run Backtest'}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
              <div className="text-error text-sm">{error}</div>
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


