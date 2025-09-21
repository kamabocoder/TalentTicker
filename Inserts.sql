-- Inserts.sql
-- SQL script to insert MAG7 stock data from GlassDoor Mag 7 - Mag7.csv into TalentTicker database

-- Insert company data first (Companies table)
INSERT INTO Companies (companyName) VALUES 
    ('Google'),
    ('Amazon'),
    ('Apple'),
    ('Microsoft'),
    ('Meta'),
    ('NVIDIA'),
    ('Tesla')
ON CONFLICT (companyName) DO NOTHING;

-- Insert stock data (Stocks table)
-- Using the company names to get the companyID via subquery
INSERT INTO Stocks (companyID, stockTicker, stockPrice, date) VALUES 
    ((SELECT companyID FROM Companies WHERE companyName = 'Google'), 'GOOG', 255.24, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Amazon'), 'AMZN', 231.48, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Apple'), 'AAPL', 245.50, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Microsoft'), 'MSFT', 517.93, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Meta'), 'META', 778.38, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'NVIDIA'), 'NVDA', 176.60, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Tesla'), 'TSLA', 426.07, '2025-09-21')
ON CONFLICT (companyID, date) DO UPDATE SET
    stockTicker = EXCLUDED.stockTicker,
    stockPrice = EXCLUDED.stockPrice,
    updated_at = NOW();

-- Insert Glassdoor ratings data (Ratings table)
INSERT INTO Ratings (companyID, rating, date) VALUES 
    ((SELECT companyID FROM Companies WHERE companyName = 'Google'), 4.4, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Amazon'), 3.6, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Apple'), 4.1, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Microsoft'), 4.1, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Meta'), 3.8, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'NVIDIA'), 4.6, '2025-09-21'),
    ((SELECT companyID FROM Companies WHERE companyName = 'Tesla'), 3.5, '2025-09-21')
ON CONFLICT (companyID, date) DO UPDATE SET
    rating = EXCLUDED.rating,
    updated_at = NOW();

-- Verify the data was inserted correctly
-- Uncomment these queries to check your data after running the inserts

/*
-- Check Companies table
SELECT * FROM Companies ORDER BY companyName;

-- Check Stocks table with company names
SELECT 
    c.companyName,
    s.stockTicker,
    s.stockPrice,
    s.date
FROM Stocks s
JOIN Companies c ON s.companyID = c.companyID
ORDER BY c.companyName;

-- Check Ratings table with company names
SELECT 
    c.companyName,
    r.rating,
    r.date
FROM Ratings r
JOIN Companies c ON r.companyID = c.companyID
ORDER BY c.companyName;

-- Combined view of all data
SELECT 
    c.companyName,
    s.stockTicker,
    s.stockPrice,
    r.rating,
    s.date
FROM Companies c
LEFT JOIN Stocks s ON c.companyID = s.companyID
LEFT JOIN Ratings r ON c.companyID = r.companyID AND s.date = r.date
ORDER BY c.companyName;
*/