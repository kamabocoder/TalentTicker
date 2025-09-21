-- CreateTables.sql
-- SQL script to create tables for TalentTicker database in Supabase (PostgreSQL)

-- Create Companies table
CREATE TABLE IF NOT EXISTS Companies (
    companyID SERIAL PRIMARY KEY,
    companyName VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Stocks table
CREATE TABLE IF NOT EXISTS Stocks (
    id SERIAL PRIMARY KEY,
    companyID INTEGER NOT NULL REFERENCES Companies(companyID) ON DELETE CASCADE,
    stockTicker VARCHAR(10) NOT NULL,
    stockPrice DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(companyID, date)
);

-- Create Ratings table
CREATE TABLE IF NOT EXISTS Ratings (
    id SERIAL PRIMARY KEY,
    companyID INTEGER NOT NULL REFERENCES Companies(companyID) ON DELETE CASCADE,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(companyID, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stocks_company_date ON Stocks(companyID, date);
CREATE INDEX IF NOT EXISTS idx_stocks_ticker ON Stocks(stockTicker);
CREATE INDEX IF NOT EXISTS idx_ratings_company_date ON Ratings(companyID, date);

-- Add comments for documentation
COMMENT ON TABLE Companies IS 'Stores company information for MAG7 stocks';
COMMENT ON TABLE Stocks IS 'Stores historical stock price data';
COMMENT ON TABLE Ratings IS 'Stores Glassdoor rating data';

COMMENT ON COLUMN Companies.companyID IS 'Primary key for company identification';
COMMENT ON COLUMN Companies.companyName IS 'Full company name (e.g., Google, Apple)';

COMMENT ON COLUMN Stocks.companyID IS 'Foreign key reference to Companies table';
COMMENT ON COLUMN Stocks.stockTicker IS 'Stock ticker symbol (e.g., GOOG, AAPL)';
COMMENT ON COLUMN Stocks.stockPrice IS 'Stock price in USD';
COMMENT ON COLUMN Stocks.date IS 'Date of the stock price recording';

COMMENT ON COLUMN Ratings.companyID IS 'Foreign key reference to Companies table';
COMMENT ON COLUMN Ratings.rating IS 'Glassdoor rating (1.0 to 5.0 scale)';
COMMENT ON COLUMN Ratings.date IS 'Date of the rating recording';