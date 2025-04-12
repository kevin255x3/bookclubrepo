// database connection configuration
// creates and exports mysql connection pool
const mysql = require('mysql2/promise');

// creating a connection pool 
// better performmance
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'bookclub_user',
    password: process.env.DB_PASSWORD || 'Bookclub444!',
    database: process.env.DB_NAME || 'book_collection',
    socketPath: '/tmp/mysql.sock', // had to use this to make it work for some reason (mac specific)
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