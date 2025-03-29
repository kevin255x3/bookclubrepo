// database connection configuration
// creates and exports mysql connection pool
const mysql = require('mysql2/promise');

// creating a connection pool 
// better performmance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'book_collection',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// on startup test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}


testConnection();

module.exports = pool;