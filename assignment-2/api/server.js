// main server for book collection
// inits express erver with middlewate and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // loads environment variables

// import routes
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// initialize express app
const app = express();
const PORT = 5001; // avoid systems conflicts (apple airdrop uses 5000)

// middle ware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);

// root 
app.get('/', (req, res) => {
    res.send('Book Collection API is running');
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});