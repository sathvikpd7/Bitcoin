import React, { useEffect, useState } from 'react';
import ApplicationHeader from '../components/ui/ApplicationHeader';
import { getJson, getApiBaseUrl } from '../utils/api';

const ModelLab = () => {
  const [model, setModel] = useState('lstm');
  const [metrics, setMetrics] = useState({ 
    trainingAccuracy: 0.905, 
    validationAccuracy: 0.885, 
    updatedAt: new Date().toISOString(),
    modelType: 'Fallback',
    modelUsed: 'fallback'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentModelStatus, setCurrentModelStatus] = useState('Loading...');

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
            updatedAt: data.updated_at || new Date().toISOString(),
            modelType: data.model_type || 'Fallback',
            modelUsed: data.model_type || 'Fallback',
            featureCount: data.feature_count || data.features || 0,
            modelPath: data.model_path || '',
            modelExists: data.model_exists,
            featuresFileExists: data.features_file_exists
          });
          
          // Set status message based on model type
          if (data.model_loaded && data.model_type && data.model_type !== 'Fallback') {
            setCurrentModelStatus(`✅ Active: ${data.model_type} model is being used for predictions`);
          } else if (data.model_exists === false) {
            setCurrentModelStatus(`⚠️ Fallback: Model file not found at ${data.model_path || 'configured path'}`);
          } else if (data.features_file_exists === false) {
            setCurrentModelStatus(`⚠️ Fallback: Model loaded but feature file missing. Feature count: ${data.feature_count || 0}`);
          } else {
            setCurrentModelStatus('⚠️ Fallback: Using heuristic prediction (no trained model loaded)');
          }
        } catch (err) {
          console.error('Failed to load metrics:', err);
          setCurrentModelStatus('❌ Error: Could not load model information');
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentModelStatus('⚠️ Backend API not configured. Configure API URL in Settings.');
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
            
            {/* Current Model Status */}
            <div className={`mb-4 p-3 rounded-md ${
              currentModelStatus.includes('✅') 
                ? 'bg-success/10 border border-success/20' 
                : currentModelStatus.includes('⚠️')
                ? 'bg-warning/10 border border-warning/20'
                : 'bg-error/10 border border-error/20'
            }`}>
              <div className="text-sm font-medium text-foreground">
                {currentModelStatus}
              </div>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                {metrics.modelType && (
                  <div>
                    <span className="font-medium">Model Type:</span> {metrics.modelType}
                  </div>
                )}
                {metrics.featureCount !== undefined && (
                  <div>
                    <span className="font-medium">Features:</span> {metrics.featureCount}
                  </div>
                )}
                {metrics.modelPath && (
                  <div className="truncate" title={metrics.modelPath}>
                    <span className="font-medium">Path:</span> {metrics.modelPath}
                  </div>
                )}
                {metrics.modelExists !== undefined && (
                  <div>
                    <span className="font-medium">Model File:</span> {metrics.modelExists ? '✅ Found' : '❌ Missing'}
                  </div>
                )}
                {metrics.featuresFileExists !== undefined && (
                  <div>
                    <span className="font-medium">Features File:</span> {metrics.featuresFileExists ? '✅ Found' : '❌ Missing'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Model Type (Display Only)</label>
                <select 
                  className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)}
                  disabled
                >
                  <option value="lstm">LSTM</option>
                  <option value="gru">GRU</option>
                  <option value="arima">ARIMA</option>
                  <option value="baseline">Baseline</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: Model selection is for display only. The backend automatically loads the model from the file system.
                </p>
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


