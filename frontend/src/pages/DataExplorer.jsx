import React, { useMemo, useState, useEffect } from 'react';
import ApplicationHeader from '../components/ui/ApplicationHeader';
import { getJson, getApiBaseUrl } from '../utils/api';

const DataExplorer = () => {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState({ key: 'date', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First, try to fetch from backend API if available
      const apiBaseUrl = getApiBaseUrl();
      if (apiBaseUrl) {
        try {
          const response = await getJson('/api/data/ohlc?limit=1000');
          // Handle different response formats
          const data = response.data || response;
          if (data && Array.isArray(data) && data.length > 0) {
            setRows(data);
            setIsLoading(false);
            return;
          }
        } catch (backendError) {
          console.warn('Backend API not available, falling back to CoinGecko:', backendError);
          // Fall through to CoinGecko API
        }
      }

      // Fallback to CoinGecko API (free, no API key required)
      const days = 365; // Fetch last year of data
      const coinGeckoOhlcUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`;
      
      const response = await fetch(coinGeckoOhlcUrl);
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} - ${response.statusText}`);
      }
      
      const ohlcData = await response.json();
      
      // CoinGecko OHLC returns array of [timestamp, open, high, low, close]
      if (ohlcData && Array.isArray(ohlcData) && ohlcData.length > 0) {
        const transformedData = ohlcData.map((candle) => {
          const [timestamp, open, high, low, close] = candle;
          const date = new Date(timestamp);
          
          return {
            date: date.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
          };
        });
        
        // Sort by date to ensure chronological order
        transformedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setRows(transformedData);
      } else {
        throw new Error('Invalid data format from CoinGecko API - received empty or invalid response');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load Bitcoin data');
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const base = !query ? rows : rows.filter(r => r.date.includes(query));
    const sorted = [...base].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (va === vb) return 0;
      const res = va > vb ? 1 : -1;
      return sort.dir === 'asc' ? res : -res;
    });
    return sorted;
  }, [rows, query, sort]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const setSortKey = (key) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      alert('No data to export');
      return;
    }
    const header = ['date','open','high','low','close'];
    const csv = [header.join(',')].concat(filtered.map(r => header.map(h => r[h]).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = 'bitcoin_ohlc.csv'; 
    a.click(); 
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-foreground">Data Explorer</h1>
              <button
                onClick={loadData}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input className="flex-1 px-3 py-2 rounded-md bg-input border border-border text-foreground" placeholder="Filter by date (YYYY-MM-DD)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button onClick={exportCsv} disabled={rows.length === 0} className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">Export CSV</button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-financial overflow-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Loading real-time Bitcoin data...</p>
                </div>
              </div>
            )}
            {error && !isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-error mb-2">⚠️</div>
                  <p className="text-sm font-medium text-foreground mb-1">Failed to load data</p>
                  <p className="text-xs text-muted-foreground mb-4">{error}</p>
                  <button
                    onClick={loadData}
                    className="px-4 py-2 text-xs font-medium text-foreground bg-primary hover:bg-primary/80 rounded-md transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {!isLoading && !error && rows.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">No data available</p>
                  <button
                    onClick={loadData}
                    className="px-4 py-2 text-xs font-medium text-foreground bg-primary hover:bg-primary/80 rounded-md transition-colors"
                  >
                    Load Data
                  </button>
                </div>
              </div>
            )}
            {!isLoading && !error && rows.length > 0 && (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 cursor-pointer" onClick={() => setSortKey('date')}>Date</th>
                      <th className="py-2 cursor-pointer" onClick={() => setSortKey('open')}>Open</th>
                      <th className="py-2 cursor-pointer" onClick={() => setSortKey('high')}>High</th>
                      <th className="py-2 cursor-pointer" onClick={() => setSortKey('low')}>Low</th>
                      <th className="py-2 cursor-pointer" onClick={() => setSortKey('close')}>Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((r) => (
                      <tr key={r.date} className="border-t border-border">
                        <td className="py-2">{r.date}</td>
                        <td className="py-2">{r.open.toLocaleString()}</td>
                        <td className="py-2">{r.high.toLocaleString()}</td>
                        <td className="py-2">{r.low.toLocaleString()}</td>
                        <td className="py-2">{r.close.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-muted-foreground">
                    Showing {filtered.length > 0 ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, filtered.length)} of {filtered.length} records
                  </div>
                  <div className="flex items-center gap-2">
                    <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 text-xs rounded-md border border-border disabled:opacity-50">Prev</button>
                    <button disabled={page >= Math.ceil(filtered.length / pageSize)} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-xs rounded-md border border-border disabled:opacity-50">Next</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataExplorer;


