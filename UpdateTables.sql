-- UpdateTables.sql
-- Script to add CEO approval rating and review count columns to the ratings table

-- Add ceoRating column (decimal for CEO approval percentage)
ALTER TABLE ratings
ADD COLUMN ceoRating DECIMAL(3,1) CHECK (ceoRating >= 0 AND ceoRating <= 100);

-- Add reviewCount column (integer for total number of reviews)
ALTER TABLE ratings
ADD COLUMN reviewCount INTEGER CHECK (reviewCount >= 0);

-- Add comments to document the new columns
COMMENT ON COLUMN ratings.ceoRating IS 'CEO approval rating as percentage (0.0 to 100.0)';
COMMENT ON COLUMN ratings.reviewCount IS 'Total number of Glassdoor reviews for the company';

-- Verify the table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'ratings'
ORDER BY ordinal_position;