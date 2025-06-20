import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router(); // Create a new router instance

// Generate a JWT token with userId as payload and secret from environment variables
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '15d', // Set the token expiration time, default is 15 days
  });
};

router.post('/register', async (req, res) => {
  try {
    // Destructure the request body to get username, email, and password in JSON format
    const { username, email, password } = req.body;

    // Validate the input fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' }); // Return error if any field is missing
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: 'Username must be at least 3 characters long' }); // Return error if username is too short
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' }); // Return error if password is too short
    }

    // Check if the email or username already exists in the database
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' }); // Return error if email already exists
    }

    // Check if the username already exists in the database
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' }); // Return error if username already exists
    }

    // Generate a random profile image avatar using the username
    const profileImage = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

    // Create a new user instance with the provided details
    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    // Save the new user to the database
    await user.save();

    // Generate a token for the user
    const token = generateToken(user._id);

    // Return the token and user details in the response
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      }, // Return the user details
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' }); // Return a 500 error if something goes wrong
  }
});

router.post('/login', async (req, res) => {
  try {
    // Destructure the request body to get email and password
    const { email, password } = req.body;

    // Validate the input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' }); // Return error if any field is missing
    }

    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' }); // Return error if user not found
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' }); // Return error if password does not match
    }

    // Generate a token for the user
    const token = generateToken(user._id);

    // Return the token and user details in the response
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      }, // Return the user details
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error('Error logging in user:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' }); // Return a 500 error if something goes wrong
  }
});

export default router;
