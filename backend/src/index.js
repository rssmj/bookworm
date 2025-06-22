import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js'; // Import the authentication routes
import bookRoutes from './routes/bookRoutes.js'; // Import the book routes

import { connectDB } from './lib/db.js'; // Import the database connection function

const app = express(); // Initialize express app
const PORT = process.env.PORT || 3000; // Default port is 3000 if not specified in .env
console.log({ PORT }); // Log the port to verify it's being set correctly

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

app.use('/api/auth', authRoutes); // Use the authentication routes under the /api/auth path
app.use('/api/books', bookRoutes); // Use the book routes under the /api/books path'

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB(); // Connect to the database when the server starts
}); // Start the server and listen on the specified port
