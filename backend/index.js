const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Database Connection on startup
db.query('SELECT 1')
  .then(() => {
    console.log('Database connected successfully to kafri_fashion');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    console.log('Ensure MySQL is running and the "kafri_fashion" database is created.');
  });

// API Routes Placeholders
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kafri Fashion E-Commerce API!' });
});

// Sample API routes for test
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json({ success: true, products: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
