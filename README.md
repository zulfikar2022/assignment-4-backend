# E-Commerce Backend for Motorbikes

This is the backend of an e-commerce website for motorbikes, built using Express.js and TypeScript. It provides APIs for managing products, user authentication, and order processing.

## Features

### Admin Features:

- Add new products
- Modify existing products
- Delete products
- View all products
- Disable user accounts

### User Features:

- Register and log in (registered users are customers by default)
- View products
- Purchase products (select quantity, provide address, and phone number)

## Tech Stack

- **Backend Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Hosting:** Vercel (Free Deployment)

## How to run the server locally

> You need to create a .env file in the root directory and provide some credentials. They are `DATABASE_CONNECTION_STRING`, `PORT`, `NODE_ENV`, `SALT_ROUNDS`, `JWT_SECRET`, `JWT_EXPIRY`, `SP_ENDPOINT`, `SP_USERNAME`,`SP_PASSWORD`,`SP_PREFIX`,`SP_RETURN_URL`,`DB_FILE`.You need `nodemon` installed in your system to run the server locally. From the root directory of the project, run the command`npm start` and the server is live in your system.
