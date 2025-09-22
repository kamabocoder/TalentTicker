-- DailyInserts.sql
-- PostgreSQL script for daily MAG7 stock and Glassdoor ratings updates
-- Replace the values below with your actual research data

-- Insert/Update stock data for 2025-09-22
INSERT INTO stocks (companyid, stockticker, stockprice, date) VALUES
    ((SELECT companyid FROM companies WHERE companyname = 'Google'), 'GOOG', 252.88, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Amazon'), 'AMZN', 227.63, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Apple'), 'AAPL', 256.08, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Microsoft'), 'MSFT', 514.45, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Meta'), 'META', 765.16, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'NVIDIA'), 'NVDA', 183.61, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Tesla'), 'TSLA', 434.21, '2025-09-22')
ON CONFLICT (companyid, date) DO UPDATE SET
    stockticker = EXCLUDED.stockticker,
    stockprice = EXCLUDED.stockprice,
    updated_at = NOW();

-- Insert/Update Glassdoor ratings for 2025-09-22
INSERT INTO ratings (companyid, rating, ceoRating, reviewCount, date) VALUES
    ((SELECT companyid FROM companies WHERE companyname = 'Google'), 4.4, 78, 45769, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Amazon'), 3.6, 59, 200105, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Apple'), 4.1, 86, 41427, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Microsoft'), 4.1, 81, 51389, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Meta'), 3.8, 56, 16526, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'NVIDIA'), 4.6, 93, 3671, '2025-09-22'),
    ((SELECT companyid FROM companies WHERE companyname = 'Tesla'), 3.5, 55, 11411, '2025-09-22')
ON CONFLICT (companyid, date) DO UPDATE SET
    rating = EXCLUDED.rating,
    ceoRating = EXCLUDED.ceoRating,
    reviewCount = EXCLUDED.reviewCount,
    updated_at = NOW();

-- Verification query to check the inserted data
SELECT
    c.companyname,
    s.stockticker,
    s.stockprice,
    r.rating,
    r.ceoRating,
    r.reviewCount,
    s.date
FROM companies c
LEFT JOIN stocks s ON c.companyid = s.companyid AND s.date = '2025-09-22'
LEFT JOIN ratings r ON c.companyid = r.companyid AND r.date = '2025-09-22'
ORDER BY c.companyname;

-- TEMPLATE FOR FUTURE DAYS:
-- Simply copy this file, change the date and values, then run

/*
USAGE TEMPLATE (copy and modify for new dates):

-- Insert/Update stock data for YYYY-MM-DD
INSERT INTO stocks (companyid, stockticker, stockprice, date) VALUES
    ((SELECT companyid FROM companies WHERE companyname = 'Google'), 'GOOG', [PRICE], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Amazon'), 'AMZN', [PRICE], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Apple'), 'AAPL', [PRICE], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Microsoft'), 'MSFT', [PRICE], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Meta'), 'META', [PRICE], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'NVIDIA'), 'NVDA', [PRICE], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Tesla'), 'TSLA', [PRICE], 'YYYY-MM-DD')
ON CONFLICT (companyid, date) DO UPDATE SET
    stockticker = EXCLUDED.stockticker,
    stockprice = EXCLUDED.stockprice,
    updated_at = NOW();

-- Insert/Update Glassdoor ratings for YYYY-MM-DD
INSERT INTO ratings (companyid, rating, ceoRating, reviewCount, date) VALUES
    ((SELECT companyid FROM companies WHERE companyname = 'Google'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Amazon'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Apple'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Microsoft'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Meta'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'NVIDIA'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD'),
    ((SELECT companyid FROM companies WHERE companyname = 'Tesla'), [RATING], [CEO%], [REVIEWS], 'YYYY-MM-DD')
ON CONFLICT (companyid, date) DO UPDATE SET
    rating = EXCLUDED.rating,
    ceoRating = EXCLUDED.ceoRating,
    reviewCount = EXCLUDED.reviewCount,
    updated_at = NOW();
*/