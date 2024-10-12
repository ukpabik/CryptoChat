# CryptoChat Web Application

Welcome to **CryptoChat**! This is a real-time cryptocurrency chat application built using modern web technologies. The application allows users to get breaking news about cryptocurrency, communicate via a real-time chat room, provide live cryptocurrency data, and integrate a generative AI model for answering crypto-related queries. This project is entirely my work, and I welcome any feedback or suggestions for improvement.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Application Routes](#application-routes)
- [Dependencies](#dependencies)
- [Contact](#contact)

## Overview

**CryptoChat** combines real-time communication with live cryptocurrency data and AI-powered responses. The application leverages several APIs to provide up-to-date information and advanced capabilities:

- **CoinMarketCap API**: For fetching live cryptocurrency data, including prices and trends of the top 100 cryptocurrencies.
- **CryptoPanic API**: For delivering the latest breaking news and updates about cryptocurrencies.
- **Google Generative AI (Gemini 1.5)**: For generating detailed answers and insights related to crypto queries through an advanced AI model.


You can access the live application here: [CryptoChat](https://cryptochat-frontend.vercel.app).

## Features

- **Real-Time Chat**: Users can send and receive messages instantly.
- **Live Crypto Data**: Fetches and displays the latest top 100 cryptocurrencies with price and trend data.
- **AI Responses**: Provides detailed answers to crypto questions using a generative AI model.
- **User Authentication**: Secure user registration and login with JWT and bcrypt.
- **Persistent Storage**: Stores chat messages and user data in PostgreSQL.
- **Scalable Architecture**: Built using Node.js and Express, with real-time features powered by Ably.

## Installation

To set up the project, follow these steps:

1. **Clone the Repository**:

    ```sh
    git clone https://github.com/ukpabik/cryptochat.git
    cd cryptochat
    ```

2. **Install Server Dependencies**:

    Navigate to the server directory and install the required Node.js packages:

    ```sh
    cd server
    npm install
    ```

3. **Install Client Dependencies**:

    Navigate to the client directory and install the required Node.js packages:

    ```sh
    cd ../client
    npm install
    ```

4. **Configure Environment Variables**:

    Create a `.env` file in the `server` directory with the following variables:

    ```plaintext
    DATABASE_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_google_generative_ai_api_key
    COINMARKET_API_KEY=your_coinmarketcap_api_key
    FRONTEND_URL=http://localhost:5173
    ABLY_API_KEY=your_ably_api_key
    EMAIL_RECEIVER=your_email@gmail.com
    EMAIL_PASSWORD=your_app_password
    ```

    Also, create a `.env` file in the `client` directory with the following variables:

    ```plaintext
    VITE_API_URL=http://localhost:3000
    VITE_ABLY_API_KEY=your_ably_api_key
    ```

## Running the Application

1. **Start the Server**:

    In the `server` directory, start the server:

    ```sh
    npm start
    ```

2. **Start the Client**:

    In the `client` directory, start the client:

    ```sh
    npm run dev
    ```

3. **Access the Application**:

    Open your browser and go to `http://localhost:5173`.

## API Endpoints

- **GET `/messages`**: Retrieve all chat messages from the database.
- **GET `/cryptodata`**: Fetch the latest cryptocurrency data from the **CoinMarketCap API**.
- **GET `/get-news`**: Gets daily breaking news about cryptocurrency from the **CryptoPanic API**.
- **POST `/register`**: Register a new user.
- **POST `/signin`**: Authenticate an existing user and return a JWT.
- **POST `/ai`**: Submit a request to the **Google Generative AI (Gemini 1.5)** and receive generated content.
- **POST `/send-email`**: Sends an email to the specified receiver with the form data.



## Socket Events

- **Connect**: Establishes a connection with the server.
- **Message**: Send and receive messages in real-time.
- **Disconnect**: Handles disconnection events.

## Application Routes

The application is built using React Router and has the following routes:

- **`/` (Homepage)**: Renders the `Homepage` component which displays the main page of the application.
- **`/signin` (Sign In)**: Renders the `SignIn` component for user authentication.
- **`/about` (About)**: Renders the `About` component which provides information about the application.
- **`/contact` (Contact)**: Renders the `Contact` component where users can get in touch.
- **`/crypto/:name` (Crypto Details by Name)**: Renders the `CryptoDetails` component for a specific cryptocurrency identified by its short name (e.g., BTC for Bitcoin).
- **`/crypto/:fullName` (Crypto Details by Full Name)**: Renders the `CryptoDetails` component for a specific cryptocurrency identified by its full name (e.g., Bitcoin).

### Example:
- Visiting `/crypto/BTC` will render the details for Bitcoin using the short name `BTC`.
- Visiting `/crypto/Bitcoin` will render the details for Bitcoin using the full name `Bitcoin`.

## Dependencies

- **APIs Used**:
  - **CoinMarketCap API**: Provides live cryptocurrency market data.
  - **CryptoPanic API**: Supplies breaking news and updates about cryptocurrencies.
  - **Google Generative AI (Gemini 1.5)**: Offers AI-generated responses for crypto-related queries.
- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express, PostgreSQL, bcrypt, JWT, Ably
- **Database**: PostgreSQL
- **Hosting**: Vercel

  
## Contact

For questions or feedback, you can contact me via:

- **Email**: officialcryptochat@gmail.com
- **GitHub**: [ukpabik](https://github.com/ukpabik)
