export const mag7Stocks = [
  {
    company: 'Google',
    ticker: 'GOOG',
    stockPrice: 138.45,
    glassdoorRating: 4.4,
    date: '9/21/25'
  },
  {
    company: 'Amazon', 
    ticker: 'AMZN',
    stockPrice: 144.78,
    glassdoorRating: 3.6,
    date: '9/21/25'
  },
  {
    company: 'Apple',
    ticker: 'AAPL', 
    stockPrice: 225.67,
    glassdoorRating: 4.1,
    date: '9/21/25'
  },
  {
    company: 'Microsoft',
    ticker: 'MSFT',
    stockPrice: 428.91,
    glassdoorRating: 4.1,
    date: '9/21/25'
  },
  {
    company: 'Meta',
    ticker: 'META',
    stockPrice: 567.23,
    glassdoorRating: 3.8,
    date: '9/21/25'
  },
  {
    company: 'NVIDIA',
    ticker: 'NVDA',
    stockPrice: 134.56,
    glassdoorRating: 4.6,
    date: '9/21/25'
  },
  {
    company: 'Tesla',
    ticker: 'TSLA',
    stockPrice: 248.89,
    glassdoorRating: 3.5,
    date: '9/21/25'
  }
];

// Sample historical data for charts (since we only have one date)
export const generateHistoricalData = (ticker, currentPrice) => {
  const data = [];
  const periods = {
    '1D': 1,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
    '5Y': 365 * 5,
    'ALL': 365 * 5
  };
  
  // Generate mock historical data
  for (let i = periods['5Y']; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the price
    const variation = (Math.random() - 0.5) * 0.1;
    const price = currentPrice * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      glassdoorRating: mag7Stocks.find(stock => stock.ticker === ticker)?.glassdoorRating || 4.0
    });
  }
  
  return data;
};