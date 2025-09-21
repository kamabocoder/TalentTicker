import { supabase } from '../config/supabase';

// Fetch all companies with their latest stock prices and ratings
export const fetchAllStocks = async () => {
  try {
    console.log('Fetching stocks from Supabase...');
    
    // First, let's try a simpler query to see if the connection works
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
      
    console.log('Companies query result:', { companies, companiesError });
    
    if (companiesError) {
      console.error('Companies query error:', companiesError);
      throw companiesError;
    }

    // Then fetch stocks and ratings separately
    const { data: stocks, error: stocksError } = await supabase
      .from('stocks')
      .select('*')
      .eq('date', '2025-09-21');
      
    console.log('Stocks query result:', { stocks, stocksError });

    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('*')
      .eq('date', '2025-09-21');
      
    console.log('Ratings query result:', { ratings, ratingsError });

    if (stocksError) throw stocksError;
    if (ratingsError) throw ratingsError;

    // Combine the data manually
    const transformedData = companies.map(company => {
      const stock = stocks.find(s => s.companyid === company.companyid);
      const rating = ratings.find(r => r.companyid === company.companyid);

      return {
        company: company.companyname,
        ticker: stock?.stockticker || '',
        stockPrice: parseFloat(stock?.stockprice || 0),
        glassdoorRating: parseFloat(rating?.rating || 0),
        date: stock?.date || '2025-09-21'
      };
    });

    console.log('Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

// Fetch individual stock data by ticker
export const fetchStockByTicker = async (ticker) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        companyid,
        companyname,
        stocks!inner(stockticker, stockprice, date),
        ratings!inner(rating, date)
      `)
      .eq('stocks.stockticker', ticker)
      .eq('stocks.date', '2025-09-21')
      .eq('ratings.date', '2025-09-21')
      .single();

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = {
      company: data.companyname,
      ticker: data.stocks[0]?.stockticker || '',
      stockPrice: parseFloat(data.stocks[0]?.stockprice || 0),
      glassdoorRating: parseFloat(data.ratings[0]?.rating || 0),
      date: data.stocks[0]?.date || '2025-09-21'
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching stock by ticker:', error);
    throw error;
  }
};

// Fetch historical data for a specific company (for charts)
export const fetchHistoricalData = async (ticker, period = '1M') => {
  try {
    // For now, we'll use the single date we have and generate mock historical data
    // In the future, this would fetch actual historical data from the database
    const stock = await fetchStockByTicker(ticker);
    
    if (!stock) return [];

    // Generate mock historical data based on current price
    const data = [];
    const periods = {
      '1D': 1,
      '1M': 30,
      '3M': 90,
      '1Y': 365,
      '5Y': 365 * 5,
      'ALL': 365 * 5
    };
    
    const daysBack = periods[period] || 30;
    
    for (let i = daysBack; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some randomness to the price for demo purposes
      const variation = (Math.random() - 0.5) * 0.1;
      const price = stock.stockPrice * (1 + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2)),
        glassdoorRating: stock.glassdoorRating
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};