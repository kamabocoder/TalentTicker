import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllStocks } from "../services/stockService";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const stockData = await fetchAllStocks();
        setStocks(stockData);
        setError(null);
      } catch (err) {
        console.error("Failed to load stocks:", err);
        setError("Failed to load stock data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  const handleStockClick = (ticker) => {
    navigate(`/stock/${ticker}`);
  };

  if (loading) {
    return (
      <div className="home-page">
        <header className="header">
          <h1>TalentTicker</h1>
          <p>What Wall Street Doesn't See: The Employee Factor</p>
        </header>
        <div className="loading">Loading stock data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <header className="header">
          <h1>TalentTicker</h1>
          <p>What Wall Street Doesn't See: The Employee Factor</p>
        </header>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="header">
        <h1>TalentTicker</h1>
        <p>What Wall Street Doesn't See: The Employee Factor</p>
      </header>

      <div className="stock-list">
        {stocks.map((stock) => (
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
                <div className="ceo-rating">
                  <span className="label">CEO Approval</span>
                  <span className="value">{stock.ceoRating}%</span>
                </div>
                <div className="review-count">
                  <span className="label">Reviews</span>
                  <span className="value">{stock.reviewCount?.toLocaleString() || 0}</span>
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
