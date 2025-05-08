import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // Connect to MongoDB using the URI from environment variables
    // Log the connection details
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting to MongoDB:', error); // Log the error message if connection fails
    process.exit(1); // Exit the process with failure
  }
};
