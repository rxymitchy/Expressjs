// In-memory array to store products 
const products = [];

// get all products
const getAllProducts = (req, res) => {
    res.json(products); // Respond with the list of products
};

// get a single product by ID
const getProductById = (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id)); // Find product by ID
    if (!product) {
        return res.status(404).json({ message: 'Product not found' }); // Return 404 if product not found
    }
    res.json(product); // Respond with the found product
};

// create a new product
const createProduct = (req, res) => {
    const newProduct = {
        id: products.length + 1, // Auto-generate an ID
        name: req.body.name, // Get name from request body
        price: req.body.price, // Get price from request body
    };
    products.push(newProduct); // Add the new product to the array
    res.status(201).json(newProduct); // Respond with the new product and 201 status code
};

// update a product by ID
const updateProduct = (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id)); // Find product by ID
    if (!product) {
        return res.status(404).json({ message: 'Product not found' }); // Return 404 if product not found
    }
    product.name = req.body.name || product.name; // Update name if provided
    product.price = req.body.price || product.price; // Update price if provided
    res.json(product); // Respond with the updated product
};

// delete a product by ID
const deleteProduct = (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id)); // Find product index by ID
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' }); // Return 404 if product not found
    }
    products.splice(productIndex, 1); // Remove the product from the array
    res.status(204).send(); // Respond with 204 status code (No Content)
};

// Export all controller functions
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};