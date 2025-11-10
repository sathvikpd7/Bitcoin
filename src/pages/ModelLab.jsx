import React, { useEffect, useState } from 'react';
import ApplicationHeader from '../components/ui/ApplicationHeader';
import { getJson, getApiBaseUrl } from '../utils/api';

const ModelLab = () => {
  const [model, setModel] = useState('lstm');
  const [metrics, setMetrics] = useState({ trainingAccuracy: 0.905, validationAccuracy: 0.885, updatedAt: new Date().toISOString() });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMetrics = async () => {
      const apiBaseUrl = getApiBaseUrl();
      if (apiBaseUrl) {
        setIsLoading(true);
        try {
          const data = await getJson('/api/model/metrics');
          setMetrics({
            trainingAccuracy: data.trainingAccuracy || 0.905,
            validationAccuracy: data.validationAccuracy || 0.885,
            updatedAt: data.updated_at || new Date().toISOString()
          });
        } catch (err) {
          console.error('Failed to load metrics:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadMetrics();
  }, []);
  const [versions, setVersions] = useState([
    { id: 'v1.2.0', note: 'Added dropout, improved validation', date: '2025-09-15' },
    { id: 'v1.1.0', note: 'Baseline LSTM', date: '2025-07-01' }
  ]);
  const [compare, setCompare] = useState([
    { model: 'LSTM', training: 0.905, validation: 0.885 },
    { model: 'GRU', training: 0.892, validation: 0.874 },
    { model: 'Baseline', training: 0.760, validation: 0.742 },
  ]);
  const [fileName, setFileName] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Model Lab</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Model</label>
                <select className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="lstm">LSTM</option>
                  <option value="gru">GRU</option>
                  <option value="arima">ARIMA</option>
                  <option value="baseline">Baseline</option>
                </select>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-muted/20 rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Training Acc.</div>
                  <div className="text-xl font-semibold">{(metrics.trainingAccuracy * 100).toFixed(2)}%</div>
                </div>
                <div className="bg-muted/20 rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Validation Acc.</div>
                  <div className="text-xl font-semibold">{(metrics.validationAccuracy * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
            {isLoading && <div className="text-xs text-muted-foreground mt-2">Loading metrics...</div>}
            <div className="text-xs text-muted-foreground mt-2">Updated: {new Date(metrics.updatedAt).toLocaleString()}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h2 className="text-lg font-semibold text-foreground mb-3">Model Versions</h2>
            <div className="space-y-2">
              {versions.map(v => (
                <div key={v.id} className="flex items-center justify-between bg-muted/20 rounded-md p-3">
                  <div>
                    <div className="text-sm font-medium">{v.id}</div>
                    <div className="text-xs text-muted-foreground">{v.note}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{v.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h2 className="text-lg font-semibold text-foreground mb-3">Compare Models</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2">Model</th>
                    <th className="py-2">Training Acc.</th>
                    <th className="py-2">Validation Acc.</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.map((c) => (
                    <tr key={c.model} className="border-t border-border">
                      <td className="py-2">{c.model}</td>
                      <td className="py-2">{(c.training * 100).toFixed(2)}%</td>
                      <td className="py-2">{(c.validation * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
            <h2 className="text-lg font-semibold text-foreground mb-3">Upload Model (stub)</h2>
            <div className="flex items-center gap-3">
              <input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} className="text-sm" />
              <button onClick={() => alert(fileName ? `Uploaded ${fileName} (stub)` : 'Choose a file')} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Upload</button>
            </div>
            {fileName && <div className="text-xs text-muted-foreground mt-2">Selected: {fileName}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelLab;


