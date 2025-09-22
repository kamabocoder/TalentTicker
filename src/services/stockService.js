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

    // Get the most recent date from stocks table
    const { data: latestStock, error: latestError } = await supabase
      .from('stocks')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (latestError) {
      console.error('Error getting latest date:', latestError);
      throw latestError;
    }

    const latestDate = latestStock.date;
    console.log('Using latest date:', latestDate);

    // Then fetch stocks and ratings for the latest date
    const { data: stocks, error: stocksError } = await supabase
      .from('stocks')
      .select('*')
      .eq('date', latestDate);

    console.log('Stocks query result:', { stocks, stocksError });

    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('*')
      .eq('date', latestDate);
      
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
        ceoRating: parseFloat(rating?.ceorating || 0),
        reviewCount: parseInt(rating?.reviewcount || 0),
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
    // Get the most recent date first
    const { data: latestStock, error: latestError } = await supabase
      .from('stocks')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (latestError) {
      console.error('Error getting latest date:', latestError);
      throw latestError;
    }

    const latestDate = latestStock.date;

    const { data, error } = await supabase
      .from('companies')
      .select(`
        companyid,
        companyname,
        stocks!inner(stockticker, stockprice, date),
        ratings!inner(rating, ceorating, reviewcount, date)
      `)
      .eq('stocks.stockticker', ticker)
      .eq('stocks.date', latestDate)
      .eq('ratings.date', latestDate)
      .single();

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = {
      company: data.companyname,
      ticker: data.stocks[0]?.stockticker || '',
      stockPrice: parseFloat(data.stocks[0]?.stockprice || 0),
      glassdoorRating: parseFloat(data.ratings[0]?.rating || 0),
      ceoRating: parseFloat(data.ratings[0]?.ceorating || 0),
      reviewCount: parseInt(data.ratings[0]?.reviewcount || 0),
      date: data.stocks[0]?.date || latestDate
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
    // Get company ID first
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('companyid')
      .eq('companyname', getCompanyNameByTicker(ticker))
      .single();

    if (companyError || !company) {
      console.error('Company lookup error:', companyError);
      return [];
    }

    // Calculate date range based on period
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = getStartDateForPeriod(period);

    // Fetch actual stock data from database
    const { data: stockData, error: stockError } = await supabase
      .from('stocks')
      .select('stockprice, date')
      .eq('companyid', company.companyid)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    // Fetch actual ratings data from database
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('ratings')
      .select('rating, date')
      .eq('companyid', company.companyid)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (stockError) {
      console.error('Stock data fetch error:', stockError);
      return [];
    }

    if (ratingsError) {
      console.error('Ratings data fetch error:', ratingsError);
      return [];
    }

    // Combine stock and rating data by date
    const combinedData = stockData.map(stock => {
      const rating = ratingsData.find(r => r.date === stock.date);
      return {
        date: stock.date,
        price: parseFloat(stock.stockprice),
        glassdoorRating: rating ? parseFloat(rating.rating) : null
      };
    });

    return combinedData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

// Helper function to get company name by ticker
const getCompanyNameByTicker = (ticker) => {
  const tickerMap = {
    'GOOGL': 'Google',
    'GOOG': 'Google',
    'AMZN': 'Amazon',
    'AAPL': 'Apple',
    'MSFT': 'Microsoft',
    'META': 'Meta',
    'NVDA': 'NVIDIA',
    'TSLA': 'Tesla'
  };
  return tickerMap[ticker] || ticker;
};

// Helper function to calculate start date based on period
const getStartDateForPeriod = (period) => {
  const today = new Date();
  let startDate = new Date(today);

  switch (period) {
    case '1D':
      // For 1D, go back a few days to ensure we catch the data
      startDate.setDate(today.getDate() - 7);
      break;
    case '1M':
      startDate.setMonth(today.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(today.getMonth() - 3);
      break;
    case '1Y':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case '5Y':
      startDate.setFullYear(today.getFullYear() - 5);
      break;
    case 'ALL':
      startDate.setFullYear(2020); // Set to a very early date
      break;
    default:
      startDate.setMonth(today.getMonth() - 1);
  }

  return startDate.toISOString().split('T')[0];
};