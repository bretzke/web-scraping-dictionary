# Web Scraping Dictionary

### Introduction

This project is built with Next.js and performs web scraping on Portuguese dictionary websites to collect specific information about words, such as definitions and related words. The scraped data is processed on the backend and rendered on the frontend to provide users with a complete, real-time search experience.

### Technologies

- Next.js: Main framework used to build the application with server-side rendering (SSR) and API Routes support.
- Cheerio: Library used for web scraping, simplifying navigation and HTML content extraction.
- Fetch: Used for making HTTP requests to dictionary sites.

### Features

- Word Search: Users can search for words and view definitions and related words pulled from online dictionaries.
- Intuitive Interface: UI designed to make it easy to understand and view information.

### How to Run Locally

*First of all, you need to create a test account on Stripe. Afterwards, you should add products in the "Products" section of your Stripe dashboard. Finally, update the .env file in your project with the secret key from your Stripe account to ensure proper API integration.*

1) Clone this repository;
2) Open the terminal inside the cloned repository folder and install the project dependencies;
```
npm install
```
3) Start the development server.
```
npm run dev
```