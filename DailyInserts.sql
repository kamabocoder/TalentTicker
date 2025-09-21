-- DailyInserts.sql
-- Template script for daily MAG7 stock and Glassdoor ratings updates
-- Replace the variables with actual values after market close and Glassdoor research

-- Set the date for today's data (update this to the current date)
-- Format: YYYY-MM-DD
SET @insert_date = 'YYYY-MM-DD';

-- Stock Price Variables (replace with actual closing prices)
SET @goog_price = [GOOGLE_STOCK_PRICE];
SET @amzn_price = [AMAZON_STOCK_PRICE];
SET @aapl_price = [APPLE_STOCK_PRICE];
SET @msft_price = [MICROSOFT_STOCK_PRICE];
SET @meta_price = [META_STOCK_PRICE];
SET @nvda_price = [NVIDIA_STOCK_PRICE];
SET @tsla_price = [TESLA_STOCK_PRICE];

-- Glassdoor Rating Variables (replace with current ratings - format: X.X)
SET @goog_rating = [GOOGLE_GLASSDOOR_RATING];
SET @amzn_rating = [AMAZON_GLASSDOOR_RATING];
SET @aapl_rating = [APPLE_GLASSDOOR_RATING];
SET @msft_rating = [MICROSOFT_GLASSDOOR_RATING];
SET @meta_rating = [META_GLASSDOOR_RATING];
SET @nvda_rating = [NVIDIA_GLASSDOOR_RATING];
SET @tsla_rating = [TESLA_GLASSDOOR_RATING];

-- Insert/Update stock data for the day
INSERT INTO stocks (companyid, stockticker, stockprice, date) VALUES
    ((SELECT companyid FROM companies WHERE companyname = 'Google'), 'GOOG', @goog_price, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Amazon'), 'AMZN', @amzn_price, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Apple'), 'AAPL', @aapl_price, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Microsoft'), 'MSFT', @msft_price, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Meta'), 'META', @meta_price, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'NVIDIA'), 'NVDA', @nvda_price, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Tesla'), 'TSLA', @tsla_price, @insert_date)
ON CONFLICT (companyid, date) DO UPDATE SET
    stockticker = EXCLUDED.stockticker,
    stockprice = EXCLUDED.stockprice,
    updated_at = NOW();

-- Insert/Update Glassdoor ratings for the day
INSERT INTO ratings (companyid, rating, date) VALUES
    ((SELECT companyid FROM companies WHERE companyname = 'Google'), @goog_rating, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Amazon'), @amzn_rating, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Apple'), @aapl_rating, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Microsoft'), @msft_rating, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Meta'), @meta_rating, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'NVIDIA'), @nvda_rating, @insert_date),
    ((SELECT companyid FROM companies WHERE companyname = 'Tesla'), @tsla_rating, @insert_date)
ON CONFLICT (companyid, date) DO UPDATE SET
    rating = EXCLUDED.rating,
    updated_at = NOW();

-- Verification query to check the inserted data
SELECT
    c.companyname,
    s.stockticker,
    s.stockprice,
    r.rating,
    s.date
FROM companies c
LEFT JOIN stocks s ON c.companyid = s.companyid AND s.date = @insert_date
LEFT JOIN ratings r ON c.companyid = r.companyid AND r.date = @insert_date
ORDER BY c.companyname;

-- Example of how to fill this out:
/*
USAGE EXAMPLE (replace the bracketed values):

SET @insert_date = '2025-09-22';

-- Stock closing prices from your research
SET @goog_price = 157.50;
SET @amzn_price = 185.25;
SET @aapl_price = 220.75;
SET @msft_price = 425.30;
SET @meta_price = 315.80;
SET @nvda_price = 850.45;
SET @tsla_price = 245.60;

-- Current Glassdoor ratings from your research
SET @goog_rating = 4.4;
SET @amzn_rating = 3.7;
SET @aapl_rating = 4.2;
SET @msft_rating = 4.1;
SET @meta_rating = 3.9;
SET @nvda_rating = 4.7;
SET @tsla_rating = 3.4;
*/