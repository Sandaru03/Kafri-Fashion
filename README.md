# Kafri Fashion - E-Commerce Website

This is a full-stack e-commerce web application for Kafri Fashion, built using React + Tailwind CSS (Frontend) and Node.js + Express + MySQL (Backend).

## Project Structure

```
Kafri Fashion/
├── backend/            # Express Server & DB connection
│   ├── config/         # Database configuration
│   ├── controllers/    # Request controllers
│   ├── database/       # Database SQL schemas
│   ├── models/         # Database model queries
│   └── routes/         # Express API routes
├── frontend/           # React + Tailwind CSS (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   └── assets/     # Images and icons
└── .gitignore          # Root Git ignore rules
```

## Getting Started

### 1. Prerequisites
- Node.js installed (v18+)
- MySQL server installed and running

### 2. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or CLI).
2. Create a database named `kafri_fashion`.
3. Import the SQL schema located at `backend/database/schema.sql`.

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend` folder based on `.env.example` or manually:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=kafri_fashion
   ```
4. Start the backend server:
   - For production/standard start: `npm start`
   - For development auto-restart: `npm run dev`

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
