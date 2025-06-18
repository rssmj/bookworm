import express from 'express';
import User from '../models/User.js';

const router = express.Router(); // Create a new router instance

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body; // Destructure the request body to get email, username, and password - JSON format
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

    // const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    // if (existingUser) return res.status(400).json({ message: 'User already exists' }); // Return error if user already exists

    const existingEmail = await User.find({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' }); // Return error if email already exists
    }

    const existingUsername = await User.findOneAndDelete({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' }); // Return error if username already exists
    }

    const profileImage = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`; // Generate a profile image URL using the username

    const user = new User({
      username,
      email,
      password,
      profileImage, // Default profile image can be set here
    });

    await user.save(); // Save the new user to the database
  } catch (error) {}
});

router.post('/login', async (req, res) => {
  res.send('login'); // Handle login requests
});

export default router;
