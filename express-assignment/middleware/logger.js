// Custom middleware to log request details
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); // Log timestamp, method, and URL
    next(); // Pass control to the next middleware or route handler
};

// Export the logger middleware
module.exports = logger;