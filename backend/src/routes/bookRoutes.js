import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';

const router = express.Router(); // Create a new router instance

router.post('/', async (req, res) => {
  try {
    // Check if the request body contains the required fields
    const { title, caption, image, rating } = req.body; // Destructure the request body to get book details
    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    // Get the secure URL of the uploaded image
    const imageUrl = uploadResponse.secure_url;

    // Create a new book object with the provided details and the uploaded image URL
    const newBook = {
      title,
      caption,
      image: imageUrl, // Use the uploaded image URL
      rating: parseFloat(rating), // Convert rating to a float
      owner: req.user._id, // Get the owner's ID from the authenticated user
    };
  } catch (error) {}
});

export default router;
