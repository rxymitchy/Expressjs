// In-memory array to store users (for demonstration purposes)
const users = [];

// Controller function to get all users
const getAllUsers = (req, res) => {
    res.json(users); // Respond with the list of users
};

// Controller function to get a single user by ID
const getUserById = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id)); // Find user by ID
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Return 404 if user not found
    }
    res.json(user); // Respond with the found user
};

// Controller function to create a new user
const createUser = (req, res) => {
    const newUser = {
        id: users.length + 1, // Auto-generate an ID
        name: req.body.name, // Get name from request body
        email: req.body.email, // Get email from request body
    };
    users.push(newUser); // Add the new user to the array
    res.status(201).json(newUser); // Respond with the new user and 201 status code
};

// Controller function to update a user by ID
const updateUser = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id)); // Find user by ID
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Return 404 if user not found
    }
    user.name = req.body.name || user.name; // Update name if provided
    user.email = req.body.email || user.email; // Update email if provided
    res.json(user); // Respond with the updated user
};

// Controller function to delete a user by ID
const deleteUser = (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id)); // Find user index by ID
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' }); // Return 404 if user not found
    }
    users.splice(userIndex, 1); // Remove the user from the array
    res.status(204).send(); // Respond with 204 status code (No Content)
};

// Export all controller functions
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};