import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer', ''); // Extract the token from the Authorization header, removing 'Bearer' prefix
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No authentication token provided, access denied' }); // If no token is provided, return 401 Unauthorized
    }
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.userId).select('-password'); // Exclude the password field from the user object
    if (!user) {
      return res.status(401).json({ message: 'Invalid token, access denied' }); // If user not found, return 401 Unauthorized
    }
    req.user = user; // Attach the user object to the request for further use in the route
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error.message); // Log the error for debugging
    return res.status(401).json({ message: 'Invalid token, access denied' }); // Return 401 Unauthorized if token verification fails
  }
};

export default protectRoute;
