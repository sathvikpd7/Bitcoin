import React, { useEffect, useState } from 'react';
import ApplicationHeader from '../components/ui/ApplicationHeader';

const Settings = () => {
  const [apiBase, setApiBase] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [refresh, setRefresh] = useState(30);
  const [overlays, setOverlays] = useState({ sma: true, ema: true, rsi: true, macd: true });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('appSettings') || '{}');
      setApiBase(stored.apiBase || '');
      setCurrency(stored.currency || 'USD');
      setRefresh(stored.refresh || 30);
      setOverlays(stored.overlays || { sma: true, ema: true, rsi: true, macd: true });
    } catch {}
  }, []);

  const save = () => {
    const next = { apiBase, currency, refresh, overlays };
    try { localStorage.setItem('appSettings', JSON.stringify(next)); } catch {}
    alert('Settings saved');
  };

  const toggleOverlay = (key) => {
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 shadow-financial">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Settings</h1>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">API Base URL</label>
              <input className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" placeholder="http://127.0.0.1:5000" value={apiBase} onChange={(e) => setApiBase(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Used for Flask back-end requests.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Currency</label>
                <select className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Auto Refresh (sec)</label>
                <input type="number" min="5" step="5" className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={refresh} onChange={(e) => setRefresh(parseInt(e.target.value || '0', 10))} />
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Overlays</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['sma','ema','rsi','macd'].map((k) => (
                  <label key={k} className="flex items-center space-x-2 bg-muted/20 rounded-md px-3 py-2 cursor-pointer">
                    <input type="checkbox" checked={!!overlays[k]} onChange={() => toggleOverlay(k)} />
                    <span className="text-sm capitalize">{k}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={save} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Save</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;


