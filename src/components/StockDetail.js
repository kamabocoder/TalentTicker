import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mag7Stocks, generateHistoricalData } from '../data/stockData';
import './StockDetail.css';

const StockDetail = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [chartData, setChartData] = useState([]);
  
  const stock = mag7Stocks.find(s => s.ticker === ticker);
  
  const periods = ['1D', '1M', '3M', '1Y', '5Y', 'ALL'];
  
  useEffect(() => {
    if (stock) {
      const historicalData = generateHistoricalData(ticker, stock.stockPrice);
      
      const periodDays = {
        '1D': 1,
        '1M': 30,
        '3M': 90,
        '1Y': 365,
        '5Y': 365 * 5,
        'ALL': 365 * 5
      };
      
      const filteredData = historicalData.slice(-periodDays[selectedPeriod]);
      setChartData(filteredData);
    }
  }, [stock, ticker, selectedPeriod]);
  
  if (!stock) {
    return (
      <div className="stock-detail">
        <div className="error">Stock not found</div>
        <button onClick={() => navigate('/')}>Back to Home</button>
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
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
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
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis domain={[1, 5]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
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