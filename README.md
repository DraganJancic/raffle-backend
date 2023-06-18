# Raffle Backend Application

This application serves as the backend for a raffle application. It's responsible for managing raffles, handling raffle tickets, and dealing with user profiles.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (https://nodejs.org/en/download/)
- npm (https://www.npmjs.com/get-npm)
- MongoDB (https://docs.mongodb.com/manual/installation/)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the dependencies
4. Setup environment variables:
    Create a .env file in the root directory with the following variables:

      PORT=your_port  
      MONGO_URI=your_mongodb_connection_string  
      X_API_KEY=your_indexer_key  
      X_API_USER=your_indexer_user  
      ACCOUNT_ID=your_near_wallet_id  
      RAFFLE_CONTRACT_ID=your_raffle_contract_id_on_near_blockchain  
      BACKEND_ENVIRONMENT=your_backend_environment  

    For BACKEND_ENVIRONMENT, options are: `localhost`, `development`, `production`.

5. Run the application: 
   ```shell
      npm run dev

## Routes

The application contains the following routes:

1. ### Profile Routes
   - GET `/profiles/:accountId` - Get profile information
  
2. ### Raffle Routes
   - POST `/raffles/current` - Get current raffles
   - GET `/raffles/featured` - Get featured raffles
   - POST `/raffles/past` - Get past raffles
   - POST `/raffles/create-raffle` - Create a new raffle
   - POST `/raffles/buy-tickets` - Buy raffle tickets
   - POST `/raffles/cancel-raffle` - Cancel a raffle
   - GET `/raffles/collections` - Get all NFT collections involved in raffles

3. ### License
   This project is licensed under the MIT License - see the LICENSE.md file for details