// Import required modules
const express = require('express'); // Express framework
const dotenv = require('dotenv'); // Environment variables
const logger = require('./middleware/logger'); // Custom logger middleware
const userRoutes = require('./routes/userRoutes'); // User routes
const productRoutes = require('./routes/productRoutes'); // Product routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Define the port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Apply custom logger middleware globally
app.use(logger);

// Routes
app.use('/users', userRoutes); // All user-related routes
app.use('/products', productRoutes); // All product-related routes

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).json({ message: 'Something went wrong!' }); // Respond with a 500 error
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});