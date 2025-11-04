# E-Commerce Website

This is a full-stack e-commerce web application built with React (frontend) and Node.js/Express (backend). It allows users to browse products, manage a shopping cart, register and log in, and securely checkout using Stripe payment integration. Admin features include product management and order tracking.

## Features

- User registration and authentication
- Product browsing and search
- Shopping cart with add/remove functionality
- Secure checkout with Stripe
- Order history and tracking
- Admin dashboard for product and order management
- Responsive, modern UI

## Technologies Used

- Frontend: React, Vite, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT
- Payment: Stripe
- Styling: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kevinbrinsly07/ecommerce.git
   cd ecommerce
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the `backend` folder with your MongoDB URI, JWT secret, and Stripe keys.

### Running the App

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```
2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```
3. Visit `http://localhost:5173` in your browser.

## Folder Structure

- `backend/` - Express server, API routes, models, controllers
- `frontend/` - React app, components, hooks, utils

## License

This project is licensed under the ISC License.
