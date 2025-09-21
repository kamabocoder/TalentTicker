# TalentTicker Development Session - User Prompts Log

**Date:** September 21, 2025  
**User:** ryankobashigawa  
**Project:** TalentTicker Web App

## Session Overview

This log documents the user prompts and development progression for creating a React web application that displays MAG7 stocks with their stock prices and Glassdoor ratings.

---

## User Prompts Chronology

### 1. Initial Command

```
cd ls
```

### 2. Project Requirements

```
GlassCannon.docx is the requirements doc you should follow but here's is a summary of what I want. A web app that displays Mag7 stocks with their stock price and glassdoor ratings. I uploaded a CSV that has data for each of the MAG 7 stocks that should display the ticker, stock price, glassdoor rating, and the date. The home page should look like the list view on the dashboard/homepage section of GlassCannon.docx but only show the ticker symbol, company name, stock price, and glassdoor rating. Then when someone clicks into a individual company show a chart of the stock price and the glassdoor rating. For now I want a view of 1D, 1M, 3M, 1Y, 5Y, and ALL but I know I only have data for 9/21/25 and that's ok. Use the tech stack provided on GlassCannon.docx which is essentially a React app
```

### 7. Data Update Request

```
I updated the stock prices in the Glassdoor mag 7 csv can you update the code to reflect these changes
```

### 10. Database Schema Request

```
I made a supabase database called TalentTicker where I want to store my data in tables. Write me a sql file with scripts that will Create tables called Stocks which has columns companyID, stockTicker, stockPrice, and date columns. Another table called Companys which has columns companyID and companyName. Another table called Ratings which has companyID, rating, and date column. Call this SQL File CreateTables.sql and use postgresSQL syntax so its compatible with supabase. Then write me a Inserts.sql to insert the data from GlassDoor Mag 7 csv into the database. I will then run these scripts in supabase
```

### 11. Historical Data Verification

```
I want to store historical stock prices and glassdoor ratings so will this database schema accomplish that
```

### 12. Documentation Request

```
Can you make a prompts.md file that shows a log of my user prompts from today
```

---

## Development Outcomes

### Completed Features:

1. ✅ React application setup with routing
2. ✅ Homepage displaying MAG7 stocks in card layout
3. ✅ Individual stock detail pages with interactive charts
4. ✅ Time period filters (1D, 1M, 3M, 1Y, 5Y, ALL)
5. ✅ Data integration from CSV file
6. ✅ GitHub repository setup and deployment
7. ✅ Database schema design for Supabase
8. ✅ SQL scripts for table creation and data insertion

### Technologies Used:

- React.js
- React Router DOM
- Recharts (for data visualization)
- CSS3 (responsive design)
- PostgreSQL (Supabase)
- Git/GitHub

### Data Sources:

- GlassCannon.docx (requirements document)
- GlassDoor Mag 7 - Mag7.csv (stock and rating data)

---

_This log was generated automatically to document the development session and user interaction patterns._

### 9/21/25 Errors

Issues loading the web app after supabase integration
The "failed to load stock data" error has been fixed. The problem was with table name casing:

Root Cause:

- Supabase/PostgreSQL stores table names in lowercase (companies, stocks, ratings)
- But your code was trying to access them with capitalized names (Companies, Stocks, Ratings)
- Column names were also lowercase in the database (companyid, stockticker, stockprice) but the code expected camelCase

Changes Made:

1. Fixed table names in src/services/stockService.js:10,22,29,64,71,72,73
2. Fixed column names in the data transformation logic in src/services/stockService.js:40,41,44,45,46,67,68,80,81,82,83

Verification:

- Database connection test shows all tables are accessible and contain the expected MAG7 stock data
- React app compiled successfully and is now running at http://localhost:3000
- The app should now display stock data for Google, Amazon, Apple, Microsoft, Meta, Tesla, and Nvidia with their current stock prices and Glassdoor ratings

Your TalentTicker app is now ready to use! 🎉
