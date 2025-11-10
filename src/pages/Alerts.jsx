import React, { useEffect, useState } from 'react';
import ApplicationHeader from '../components/ui/ApplicationHeader';
import { postJson, getJson, putJson, deleteJson, getApiBaseUrl } from '../utils/api';

const Alerts = () => {
  const [form, setForm] = useState({ type: 'price', operator: '>=', value: 70000 });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      const apiBaseUrl = getApiBaseUrl();
      if (apiBaseUrl) {
        try {
          const data = await getJson('/api/alerts');
          setAlerts(data);
        } catch (err) {
          console.error('Failed to load alerts:', err);
          // Fallback to localStorage
          try { setAlerts(JSON.parse(localStorage.getItem('alerts') || '[]')); } catch {}
        }
      } else {
        // Fallback to localStorage if API not configured
        try { setAlerts(JSON.parse(localStorage.getItem('alerts') || '[]')); } catch {}
      }
    };
    loadAlerts();
  }, []);

  const addAlert = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    try {
      const apiBaseUrl = getApiBaseUrl();
      if (apiBaseUrl) {
        const newAlert = await postJson('/api/alerts', form);
        setAlerts([...alerts, newAlert]);
      } else {
        // Fallback to localStorage
        const next = [...alerts, { id: Date.now(), ...form, active: true }];
        setAlerts(next);
        try { localStorage.setItem('alerts', JSON.stringify(next)); } catch {}
      }
    } catch (err) {
      console.error('Failed to create alert:', err);
      // Fallback to localStorage
      const next = [...alerts, { id: Date.now(), ...form, active: true }];
      setAlerts(next);
      try { localStorage.setItem('alerts', JSON.stringify(next)); } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  const testTrigger = (id) => {
    const a = alerts.find(x => x.id === id);
    if (!a) return;
    // Simulate notification
    alert(`Test alert: ${a.type.toUpperCase()} ${a.operator} ${a.value}`);
  };

  const toggleActive = async (id) => {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl) {
      try {
        await putJson(`/api/alerts/${id}/toggle`);
        const next = alerts.map(a => a.id === id ? { ...a, active: !a.active } : a);
        setAlerts(next);
      } catch (err) {
        console.error('Failed to toggle alert:', err);
        // Fallback to localStorage
        const next = alerts.map(a => a.id === id ? { ...a, active: !a.active } : a);
        setAlerts(next);
        try { localStorage.setItem('alerts', JSON.stringify(next)); } catch {}
      }
    } else {
      // Fallback to localStorage
      const next = alerts.map(a => a.id === id ? { ...a, active: !a.active } : a);
      setAlerts(next);
      try { localStorage.setItem('alerts', JSON.stringify(next)); } catch {}
    }
  };

  const removeAlert = async (id) => {
    const apiBaseUrl = getApiBaseUrl();
    if (apiBaseUrl) {
      try {
        await deleteJson(`/api/alerts/${id}`);
        const next = alerts.filter(a => a.id !== id);
        setAlerts(next);
      } catch (err) {
        console.error('Failed to delete alert:', err);
        // Fallback to localStorage
        const next = alerts.filter(a => a.id !== id);
        setAlerts(next);
        try { localStorage.setItem('alerts', JSON.stringify(next)); } catch {}
      }
    } else {
      // Fallback to localStorage
      const next = alerts.filter(a => a.id !== id);
      setAlerts(next);
      try { localStorage.setItem('alerts', JSON.stringify(next)); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Alerts</h1>
            <form onSubmit={addAlert} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select className="px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="price">Price</option>
                <option value="sma">SMA(14)</option>
                <option value="ema">EMA(14)</option>
              </select>
              <select className="px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })}>
                <option>{'>='}</option>
                <option>{'<='}</option>
              </select>
              <input type="number" className="px-3 py-2 rounded-md bg-input border border-border text-foreground" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value || 0) })} />
              <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50">
                {isLoading ? 'Adding...' : 'Add Alert'}
              </button>
            </form>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h2 className="text-lg font-semibold text-foreground mb-3">Configured Alerts</h2>
            {alerts.length === 0 ? (
              <div className="text-sm text-muted-foreground">No alerts configured.</div>
            ) : (
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className="flex items-center justify-between bg-muted/20 rounded-md p-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground mr-2">{a.type.toUpperCase()} {a.operator}</span>
                      <span className="font-semibold">{a.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full ${a.active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>{a.active ? 'ACTIVE' : 'INACTIVE'}</span>
                      <button onClick={() => testTrigger(a.id)} className="px-3 py-1 text-xs rounded-md border border-border">Test</button>
                      <button onClick={() => toggleActive(a.id)} className="px-3 py-1 text-xs rounded-md border border-border">{a.active ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => removeAlert(a.id)} className="px-3 py-1 text-xs rounded-md bg-destructive text-destructive-foreground">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;


