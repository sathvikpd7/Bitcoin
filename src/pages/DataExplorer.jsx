import React, { useMemo, useState } from 'react';
import ApplicationHeader from '../components/ui/ApplicationHeader';

const sampleRows = [
  { date: '2024-10-08', open: 62500, high: 63800, low: 61200, close: 63200 },
  { date: '2024-10-09', open: 63200, high: 64500, low: 62800, close: 64100 },
  { date: '2024-10-10', open: 64100, high: 65200, low: 63500, close: 64800 },
];

const DataExplorer = () => {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(sampleRows);
  const [sort, setSort] = useState({ key: 'date', dir: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
    const header = ['date','open','high','low','close'];
    const csv = [header.join(',')].concat(filtered.map(r => header.map(h => r[h]).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ohlc.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Data Explorer</h1>
            <div className="flex items-center gap-3">
              <input className="flex-1 px-3 py-2 rounded-md bg-input border border-border text-foreground" placeholder="Filter by date (YYYY-MM-DD)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button onClick={exportCsv} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Export CSV</button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-financial overflow-auto">
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
              <div className="text-xs text-muted-foreground">Page {page} of {Math.max(1, Math.ceil(filtered.length / pageSize))}</div>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 text-xs rounded-md border border-border disabled:opacity-50">Prev</button>
                <button disabled={page >= Math.ceil(filtered.length / pageSize)} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-xs rounded-md border border-border disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataExplorer;


