import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mag7Stocks } from '../data/stockData';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStockClick = (ticker) => {
    navigate(`/stock/${ticker}`);
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>TalentTicker</h1>
        <p>MAG7 Stocks with Glassdoor Ratings</p>
      </header>
      
      <div className="stock-list">
        {mag7Stocks.map((stock) => (
          <div 
            key={stock.ticker} 
            className="stock-card"
            onClick={() => handleStockClick(stock.ticker)}
          >
            <div className="stock-info">
              <div className="ticker-company">
                <span className="ticker">{stock.ticker}</span>
                <span className="company">{stock.company}</span>
              </div>
              <div className="metrics">
                <div className="price">
                  <span className="label">Stock Price</span>
                  <span className="value">${stock.stockPrice}</span>
                </div>
                <div className="rating">
                  <span className="label">Glassdoor Rating</span>
                  <span className="value">{stock.glassdoorRating}⭐</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;