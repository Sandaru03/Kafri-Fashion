const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kafri_fashion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise wrapper for async/await usage
module.exports = pool.promise();
