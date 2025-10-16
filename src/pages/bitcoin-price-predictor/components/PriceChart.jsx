import React, { useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Customized } from 'recharts';

const PriceChart = ({ historicalData, prediction, title = "Bitcoin Price Analysis" }) => {
  // --- Indicators helpers ---
  const computeSMA = (data, period = 14) => {
    const result = [];
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].close;
      if (i >= period) sum -= data[i - period].close;
      result.push(i >= period - 1 ? sum / period : null);
    }
    return result;
  };

  const computeEMA = (data, period = 14) => {
    const k = 2 / (period + 1);
    const result = [];
    let ema = null;
    for (let i = 0; i < data.length; i++) {
      const price = data[i].close;
      if (ema == null) {
        ema = price;
      } else {
        ema = price * k + ema * (1 - k);
      }
      result.push(i >= period - 1 ? ema : null);
    }
    return result;
  };

  const computeRSI = (data, period = 14) => {
    const result = new Array(data.length).fill(null);
    if (data.length < period + 1) return result;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
      const change = data[i].close - data[i - 1].close;
      gains += Math.max(0, change);
      losses += Math.max(0, -change);
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    for (let i = period + 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      avgGain = (avgGain * (period - 1) + Math.max(0, change)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.max(0, -change)) / period;
      result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
    return result;
  };

  const computeMACD = (data, shortP = 12, longP = 26, signalP = 9) => {
    const emaShort = computeEMA(data, shortP);
    const emaLong = computeEMA(data, longP);
    const macd = emaShort.map((v, i) => (v != null && emaLong[i] != null ? v - emaLong[i] : null));
    // signal EMA on macd (skip nulls by carrying last value)
    const macdClean = macd.map((v) => (v == null ? 0 : v));
    const signal = [];
    let ema = null;
    const k = 2 / (signalP + 1);
    for (let i = 0; i < macdClean.length; i++) {
      const val = macd[i] == null ? null : macdClean[i];
      if (val == null) {
        signal.push(null);
        continue;
      }
      if (ema == null) {
        ema = val;
      } else {
        ema = val * k + ema * (1 - k);
      }
      signal.push(ema);
    }
    const histogram = macd.map((v, i) => (v != null && signal[i] != null ? v - signal[i] : null));
    return { macd, signal, histogram };
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const idx = chartData.findIndex((d) => d.date === data?.date);
      const prevClose = idx > 0 ? chartData[idx - 1]?.close ?? null : null;
      const deltaPrev = prevClose != null && data?.close != null ? data.close - prevClose : null;
      const deltaSma = data?.sma14 != null && data?.close != null ? data.close - data.sma14 : null;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-financial">
          <p className="text-sm font-medium text-foreground mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center space-x-4">
              <span className="text-xs text-muted-foreground">Open:</span>
              <span className="text-xs font-medium text-foreground data-mono">
                {formatCurrency(data?.open)}
              </span>
            </div>
            <div className="flex justify-between items-center space-x-4">
              <span className="text-xs text-muted-foreground">High:</span>
              <span className="text-xs font-medium text-success data-mono">
                {formatCurrency(data?.high)}
              </span>
            </div>
            <div className="flex justify-between items-center space-x-4">
              <span className="text-xs text-muted-foreground">Low:</span>
              <span className="text-xs font-medium text-error data-mono">
                {formatCurrency(data?.low)}
              </span>
            </div>
            <div className="flex justify-between items-center space-x-4">
              <span className="text-xs text-muted-foreground">Close:</span>
              <span className="text-xs font-medium text-primary data-mono">
                {data?.close != null ? formatCurrency(data?.close) : '—'}
              </span>
            </div>
            {data?.predictedClose != null && (
              <div className="flex justify-between items-center space-x-4">
                <span className="text-xs text-muted-foreground">Predicted:</span>
                <span className="text-xs font-semibold text-accent data-mono">
                  {formatCurrency(data?.predictedClose)}
                </span>
              </div>
            )}
            {data?.sma14 != null && (
              <div className="flex justify-between items-center space-x-4">
                <span className="text-xs text-muted-foreground">SMA(14):</span>
                <span className="text-xs font-medium text-foreground data-mono">
                  {formatCurrency(data?.sma14)}
                </span>
              </div>
            )}
            {data?.ema14 != null && (
              <div className="flex justify-between items-center space-x-4">
                <span className="text-xs text-muted-foreground">EMA(14):</span>
                <span className="text-xs font-medium text-warning data-mono">
                  {formatCurrency(data?.ema14)}
                </span>
              </div>
            )}
            {(deltaPrev != null || deltaSma != null) && (
              <div className="pt-1 border-t border-border space-y-1">
                {deltaPrev != null && (
                  <div className="flex justify-between items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Δ vs Prev Close:</span>
                    <span className={`text-xs font-semibold data-mono ${deltaPrev >= 0 ? 'text-success' : 'text-error'}`}>
                      {deltaPrev >= 0 ? '+' : ''}{formatCurrency(Math.abs(deltaPrev))}
                    </span>
                  </div>
                )}
                {deltaSma != null && (
                  <div className="flex justify-between items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Δ vs SMA(14):</span>
                    <span className={`text-xs font-semibold data-mono ${deltaSma >= 0 ? 'text-success' : 'text-error'}`}>
                      {deltaSma >= 0 ? '+' : ''}{formatCurrency(Math.abs(deltaSma))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Combine data with prediction and compute indicators
  const { chartData, sma14, ema14, rsi14, macdData } = useMemo(() => {
    const base = [...historicalData];
    if (prediction && historicalData.length) {
      const lastDate = new Date(historicalData[historicalData.length - 1].date);
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      base.push({
        date: nextDate.toISOString().split('T')[0],
        open: prediction.nextClosePrice,
        high: prediction.nextClosePrice * 1.02,
        low: prediction.nextClosePrice * 0.98,
        // keep actual close for historical; add predictedClose for predicted series
        close: null,
        predictedClose: prediction.nextClosePrice,
        predicted: true
      });
    }
    const sma = computeSMA(base, 14);
    const ema = computeEMA(base, 14);
    const rsi = computeRSI(base, 14);
    const macd = computeMACD(base, 12, 26, 9);
    const enriched = base.map((d, i) => ({
      ...d,
      sma14: sma[i],
      ema14: ema[i],
      rsi14: rsi[i],
      macd: macd.macd[i],
      macdSignal: macd.signal[i],
      macdHist: macd.histogram[i]
    }));
    return { chartData: enriched, sma14: sma, ema14: ema, rsi14: rsi, macdData: macd };
  }, [historicalData, prediction]);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-financial">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Historical price trends with ML prediction overlay
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span className="text-muted-foreground">Historical</span>
          </div>
          {prediction && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-accent"></div>
              <span className="text-muted-foreground">Predicted</span>
            </div>
          )}
        </div>
      </div>
      <div className="h-72 sm:h-80 lg:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Candlesticks via Customized shape */}
            <Customized component={({ xAxisMap, yAxisMap, offset }) => {
              const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
              const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
              const xScale = xAxis?.scale;
              const yScale = yAxis?.scale;
              const candleWidth = 8;
              return (
                <g>
                  {chartData.map((d, i) => {
                    if (d.close == null && d.open == null) return null;
                    const x = xScale(d.date) - candleWidth / 2;
                    const openY = yScale(d.open);
                    const closeY = yScale(d.close ?? d.open);
                    const highY = yScale(d.high);
                    const lowY = yScale(d.low);
                    const isUp = (d.close ?? d.open) >= d.open;
                    const bodyY = Math.min(openY, closeY);
                    const bodyH = Math.max(2, Math.abs(closeY - openY));
                    const color = isUp ? 'var(--color-success)' : 'var(--color-error)';
                    return (
                      <g key={`candle-${i}`}>
                        {/* Wick */}
                        <line x1={x + candleWidth / 2} x2={x + candleWidth / 2} y1={highY} y2={lowY} stroke={color} strokeWidth={1} />
                        {/* Body */}
                        <rect x={x} y={bodyY} width={candleWidth} height={bodyH} fill={color} opacity={0.4} stroke={color} />
                      </g>
                    );
                  })}
                </g>
              );
            }} />

            {/* Overlays */}
            <Line type="monotone" dataKey="sma14" stroke="var(--color-muted-foreground)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="ema14" stroke="var(--color-warning)" strokeWidth={1.5} dot={false} />

            {/* Close price line for clarity over candles */}
            <Line type="monotone" dataKey="close" stroke="var(--color-primary)" strokeWidth={1} dot={false} />

            {/* Predicted series */}
            <Line type="monotone" dataKey="predictedClose" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />

            {/* Prediction reference line */}
            {prediction && (
              <ReferenceLine 
                x={chartData?.[chartData?.length - 1]?.date} 
                stroke="var(--color-accent)" 
                strokeDasharray="3 3"
                strokeWidth={2}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* RSI mini-panel */}
      <div className="mt-6 h-32 sm:h-36 lg:h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={10} />
            <ReferenceLine y={70} stroke="var(--color-error)" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="var(--color-success)" strokeDasharray="3 3" />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)}%`} />
            <Line type="monotone" dataKey="rsi14" stroke="var(--color-accent)" strokeWidth={1.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* MACD mini-panel */}
      <div className="mt-4 h-32 sm:h-36 lg:h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="macd" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="macdSignal" stroke="var(--color-warning)" strokeWidth={1.5} dot={false} />
            <Customized component={({ xAxisMap, yAxisMap }) => {
              const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
              const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
              const xScale = xAxis?.scale;
              const yScale = yAxis?.scale;
              const barWidth = 4;
              return (
                <g>
                  {chartData.map((d, i) => {
                    if (d.macdHist == null) return null;
                    const x = xScale(d.date) - barWidth / 2;
                    const y0 = yScale(0);
                    const y = yScale(d.macdHist);
                    const height = Math.max(1, Math.abs(y - y0));
                    const color = d.macdHist >= 0 ? 'var(--color-success)' : 'var(--color-error)';
                    return <rect key={`macd-bar-${i}`} x={x} y={Math.min(y, y0)} width={barWidth} height={height} fill={color} opacity={0.6} />;
                  })}
                </g>
              );
            }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-primary"></div>
          <span className="text-xs text-muted-foreground">Close Price</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-success border-dashed border-t"></div>
          <span className="text-xs text-muted-foreground">High Price</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-error border-dashed border-t"></div>
          <span className="text-xs text-muted-foreground">Low Price</span>
        </div>
        {prediction && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-accent border-dashed border-t"></div>
            <span className="text-xs text-muted-foreground">ML Prediction</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5" style={{ background: 'var(--color-warning)' }}></div>
          <span className="text-xs text-muted-foreground">EMA(14)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5" style={{ background: 'var(--color-muted-foreground)' }}></div>
          <span className="text-xs text-muted-foreground">SMA(14)</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;