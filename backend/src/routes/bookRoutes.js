import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router(); // Create a new router instance

// Route to create a new book
router.post('/', protectRoute, async (req, res) => {
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
    const newBook = new Book({
      title,
      caption,
      image: imageUrl, // Use the uploaded image URL
      rating: parseFloat(rating), // Convert rating to a float
      owner: req.user._id, // Get the owner's ID from the authenticated user
    });

    await newBook.save(); // Save the new book to the database
    res.status(201).json(newBook); // Return the created book in the response >> 201 Resource Created
  } catch (error) {}
});

// Fetch books from the database with pagination >> infinite scroll
router.get('/', protectRoute, async (req, res) => {
  try {
    // Pagination logic
    const page = req.query.page || 1; // Get the page number from query parameters, default to 1
    const limit = req.query.limit || 5; // Set the number of books per page
    const skip = (page - 1) * limit; // Calculate the number of books to skip based on the page number

    // Fetch books from the database
    const books = await Book.find()
      .sort({ createdAt: -1 }) // Sort books by creation date in descending order
      .skip(skip) // Skip the number of books based on the current page
      .limit(limit) // Limit the number of books returned to the specified limit
      .populate('user', 'username profileImage'); // Populate the 'user' field with username and profileImage from the User model

    const totalBooks = await Book.countDocuments(); // Get the total number of books in the database
    // Return the books, current page, total books, and total pages in the response
    res.send({
      books,
      curentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log('Error fetching all books route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get recommended books by the logged-in user
router.get('/user', protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }) // Find books created by the logged-in user
      .sort({ createdAt: -1 }); // Sort books by creation date in descending order
    res.json(books); // Return the user's books in the response
  } catch (error) {
    console.log('Error fetching user books:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' }); // Return 500 Internal Server Error if something goes wrong
  }
});

// Route to delete a book by ID
// This route is protected, meaning only authenticated users can access it
router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Find the book by ID from the request parameters
    if (!book) {
      return res.status(404).json({ message: 'Book not found' }); // Return 404 if book not found
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this book' }); // Return 403 if the user is not the owner of the book
    }

    //delete the image from cloudinary
    if (book.image && book.image.includes('cloudinary')) {
      try {
        const publicId = book.image.split('/').pop().split('.')[0]; // Extract the public ID from the image URL
        await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary using the public ID
        console.log('Image deleted from Cloudinary successfully');
      } catch (deleteError) {
        console.log('Error deleting image from Cloudinary:', deleteError);
      }
    }

    await book.deleteOne(); // Remove the book from the database
    res.json({ message: 'Book deleted successfully' }); // Return success
  } catch (error) {
    console.log('Error deleting book:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' }); // Return 500 Internal Server Error if something goes wrong
  }
});

export default router;
