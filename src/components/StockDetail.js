import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchStockByTicker, fetchHistoricalData } from '../services/stockService';
import './StockDetail.css';

const StockDetail = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [chartData, setChartData] = useState([]);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const periods = ['1D', '1M', '3M', '1Y', '5Y', 'ALL'];
  
  useEffect(() => {
    const loadStock = async () => {
      try {
        setLoading(true);
        const stockData = await fetchStockByTicker(ticker);
        setStock(stockData);
        setError(null);
      } catch (err) {
        console.error('Failed to load stock:', err);
        setError('Stock not found or failed to load data.');
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, [ticker]);
  
  useEffect(() => {
    const loadChartData = async () => {
      if (stock) {
        try {
          const historicalData = await fetchHistoricalData(ticker, selectedPeriod);
          setChartData(historicalData);
        } catch (err) {
          console.error('Failed to load chart data:', err);
        }
      }
    };

    loadChartData();
  }, [stock, ticker, selectedPeriod]);
  
  if (loading) {
    return (
      <div className="stock-detail">
        <div className="loading">Loading stock data...</div>
      </div>
    );
  }
  
  if (error || !stock) {
    return (
      <div className="stock-detail">
        <div className="error">{error || 'Stock not found'}</div>
        <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    );
  }
  
  return (
    <div className="stock-detail">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="stock-title">
          <h1>{stock.ticker} - {stock.company}</h1>
          <div className="current-metrics">
            <span className="current-price">${stock.stockPrice}</span>
            <span className="current-rating">{stock.glassdoorRating}⭐ Glassdoor</span>
          </div>
        </div>
      </header>
      
      <div className="period-selector">
        {periods.map(period => (
          <button
            key={period}
            className={`period-button ${selectedPeriod === period ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
      
      <div className="charts-container">
        <div className="chart-section">
          <h3>Stock Price ({selectedPeriod})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value}
              />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                labelFormatter={(value) => value}
                formatter={(value) => [`$${value}`, 'Stock Price']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3498db" 
                strokeWidth={2}
                name="Stock Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-section">
          <h3>Glassdoor Rating ({selectedPeriod})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value}
              />
              <YAxis domain={[1, 5]} />
              <Tooltip 
                labelFormatter={(value) => value}
                formatter={(value) => [`${value}⭐`, 'Glassdoor Rating']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="glassdoorRating" 
                stroke="#e74c3c" 
                strokeWidth={2}
                name="Glassdoor Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;