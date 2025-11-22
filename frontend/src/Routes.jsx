import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BitcoinPricePredictor from './pages/bitcoin-price-predictor';
import Settings from 'pages/Settings';
import Backtesting from 'pages/Backtesting';
import DataExplorer from 'pages/DataExplorer';
import ModelLab from 'pages/ModelLab';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BitcoinPricePredictor />} />
        <Route path="/bitcoin-price-predictor" element={<BitcoinPricePredictor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/backtesting" element={<Backtesting />} />
        <Route path="/data-explorer" element={<DataExplorer />} />
        <Route path="/model-lab" element={<ModelLab />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
