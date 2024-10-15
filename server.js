require('dotenv/config')
const mysql = require('mysql2/promise');
const app = require('./app');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,      
    password: process.env.MYSQL_PASSWORD,  
    database: process.env.MYSQL_DATABASE, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
pool.getConnection()
    .then(conn => {
        return conn.query('SELECT 1')
            .then(res => {
                conn.release(); // Release the connection back to the pool
                console.log('Connected to the MySQL database.');
            })
            .catch(err => {
                conn.release(); // Ensure the connection is released on error
                console.error('Error executing query:', err.message);
                console.error('Error stack:', err.stack);
            });
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.message);
        console.error('Error stack:', err.stack);
    });

// Set the pool in the app for later use
app.set('pool', pool);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});