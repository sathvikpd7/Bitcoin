import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PriceChart = ({ historicalData, prediction, title = "Bitcoin Price Analysis" }) => {
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
                {formatCurrency(data?.close)}
              </span>
            </div>
            {data?.predicted && (
              <div className="flex justify-between items-center space-x-4 pt-1 border-t border-border">
                <span className="text-xs text-accent">Predicted:</span>
                <span className="text-xs font-semibold text-accent data-mono">
                  {formatCurrency(data?.close)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Combine historical data with prediction
  const chartData = [...historicalData];
  if (prediction) {
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const nextDate = new Date(lastDate);
    nextDate?.setDate(nextDate?.getDate() + 1);
    
    chartData?.push({
      date: nextDate?.toISOString()?.split('T')?.[0],
      open: prediction?.nextClosePrice,
      high: prediction?.nextClosePrice * 1.02,
      low: prediction?.nextClosePrice * 0.98,
      close: prediction?.nextClosePrice,
      predicted: true
    });
  }

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
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            
            {/* Historical price line */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            
            {/* High price line */}
            <Line
              type="monotone"
              dataKey="high"
              stroke="var(--color-success)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            
            {/* Low price line */}
            <Line
              type="monotone"
              dataKey="low"
              stroke="var(--color-error)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Prediction reference line */}
            {prediction && (
              <ReferenceLine 
                x={chartData?.[chartData?.length - 1]?.date} 
                stroke="var(--color-accent)" 
                strokeDasharray="3 3"
                strokeWidth={2}
              />
            )}
          </LineChart>
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
      </div>
    </div>
  );
};

export default PriceChart;